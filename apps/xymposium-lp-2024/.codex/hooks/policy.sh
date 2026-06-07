#!/usr/bin/env bash
# Codex PreToolUse フック: 危険なシェルコマンドの自動実行を拒否する。
# (Claude Code の permissions.deny 相当。Codex は stdin で JSON を受け取り、
#  permissionDecision=deny を返すか exit 2 で実行をブロックできる。)
set -uo pipefail

input=$(cat 2>/dev/null || true)
cmd=$(printf '%s' "$input" | jq -r '
  .tool_input.command // .tool_input.cmd //
  (.tool_input.command[]? ) // empty' 2>/dev/null | tr '\n' ' ' || true)

[ -z "$cmd" ] && exit 0

deny() {
  # JSON で明示的に拒否を返す
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"%s"}}\n' "$1"
  exit 0
}

# 破壊的・危険なパターン
case "$cmd" in
  *"sudo "* | *"sudo") deny "sudo による特権昇格はブロックされています" ;;
  *"rm -rf /"* | *"rm -fr /"*) deny "ルート/絶対パスの再帰削除はブロックされています" ;;
  *"rm -rf ~"* | *"rm -rf \$HOME"*) deny "ホームディレクトリの削除はブロックされています" ;;
  *"git push --force"* | *"git push -f"*) deny "force push はブロックされています" ;;
  *"git clean -fdx"* | *"git clean -fdX"*) deny "git clean -fdx はブロックされています" ;;
  *"chmod -R 777"*) deny "chmod -R 777 はブロックされています" ;;
  *"npm publish"*) deny "npm publish はブロックされています" ;;
  *":(){"*) deny "fork bomb はブロックされています" ;;
esac

exit 0
