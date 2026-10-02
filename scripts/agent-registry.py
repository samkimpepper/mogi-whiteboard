#!/usr/bin/env python3
"""Register this Orca terminal, or resolve a role against the live inventory."""

import argparse
import json
import os
from pathlib import Path
import subprocess
import tempfile
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / ".local" / "agent-registry"
WORKSPACES = {"whiteboard": ROOT, "todo": ROOT.parent / "mogi-productivity"}


def orca(*args):
    result = subprocess.run(
        ["orca", *args, "--json"], capture_output=True, text=True, timeout=20
    )
    if result.returncode:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip())
    receipt = json.loads(result.stdout)
    if not receipt.get("ok"):
        raise RuntimeError("Orca did not return a successful receipt")
    return receipt


def inventory():
    receipt = orca("terminal", "list")
    result = receipt["result"]
    if result.get("truncated"):
        raise RuntimeError("Terminal inventory is incomplete; refusing discovery")
    return receipt["_meta"]["runtimeId"], result["terminals"]


def verify(binding, runtime_id, terminals):
    if binding["runtimeId"] != runtime_id:
        raise RuntimeError("Orca runtime changed; register this role again")
    matches = [t for t in terminals if t["handle"] == binding["terminalHandle"]]
    if len(matches) != 1:
        raise RuntimeError("Registered address is unavailable or ambiguous; not resolved")
    terminal = matches[0]
    for field in ("incarnationId", "worktreeId", "executionHostId", "agentIdentity"):
        if terminal.get(field) != binding[field]:
            raise RuntimeError(f"Registered {field} changed; register this role again")
    if not terminal.get("connected") or not terminal.get("writable"):
        raise RuntimeError("Registered terminal is not currently connected and writable")
    return terminal


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("register", "resolve"))
    parser.add_argument("role", choices=tuple(WORKSPACES))
    parser.add_argument("--replace", action="store_true",
                        help="Replace an older registration after explicit role transfer")
    args = parser.parse_args()
    path = REGISTRY / f"{args.role}.json"
    runtime_id, terminals = inventory()
    if args.action == "resolve":
        binding = json.loads(path.read_text())
        if binding["role"] != args.role or binding["workspacePath"] != str(WORKSPACES[args.role]):
            raise RuntimeError("Registration does not match the requested role and workspace")
        verify(binding, runtime_id, terminals)
        print(json.dumps(binding, ensure_ascii=False, indent=2))
        return

    if Path.cwd().resolve() != WORKSPACES[args.role].resolve():
        raise RuntimeError("Register from the role's own checkout directory")
    handle = os.environ.get("ORCA_TERMINAL_HANDLE")
    if not handle:
        raise RuntimeError("ORCA_TERMINAL_HANDLE missing; cannot establish own identity")
    candidates = [t for t in terminals if t["handle"] == handle]
    if len(candidates) != 1:
        raise RuntimeError("Own terminal is not uniquely present in Orca inventory")
    terminal = candidates[0]
    if terminal.get("agentIdentity") != "codex" or terminal.get("executionHostId") != "local":
        raise RuntimeError("This experiment supports local Codex terminals only")
    binding = {
        "schemaVersion": 1, "role": args.role,
        "workspacePath": str(WORKSPACES[args.role]),
        "runtimeId": runtime_id, "terminalHandle": handle,
        **{field: terminal[field] for field in
           ("incarnationId", "worktreeId", "executionHostId", "agentIdentity")},
        "registeredAt": datetime.now(timezone.utc).isoformat(),
    }
    verify(binding, runtime_id, terminals)
    if path.exists():
        old = json.loads(path.read_text())
        same = all(old.get(k) == binding[k] for k in ("runtimeId", "terminalHandle", "incarnationId"))
        if not same and not args.replace:
            raise RuntimeError("Role already registered elsewhere; explicit transfer needs --replace")
    REGISTRY.mkdir(parents=True, exist_ok=True)
    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", dir=REGISTRY, delete=False) as output:
            temp_path = Path(output.name)
            json.dump(binding, output, ensure_ascii=False, indent=2)
            output.write("\n")
        os.replace(temp_path, path)
    finally:
        if temp_path is not None and temp_path.exists():
            temp_path.unlink()
    print(json.dumps(binding, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, KeyError, ValueError, OSError, subprocess.TimeoutExpired) as error:
        raise SystemExit(f"Registration unavailable: {error}")
