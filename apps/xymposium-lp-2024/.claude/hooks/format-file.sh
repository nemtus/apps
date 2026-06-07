#!/usr/bin/env bash
# PostToolUse フック: 編集/作成されたファイルを Prettier で整形する。
# これにより format:check が常にクリーンな状態を保つ。
set -uo pipefail

# 相対パス (Codex 等) でも解決できるようリポジトリルートへ移動する
cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}" 2>/dev/null || true

input=$(cat)
# Claude / Codex などツールにより JSON のフィールド名が異なるため複数候補を探索する
file=$(printf '%s' "$input" | jq -r '
  .tool_input.file_path // .tool_input.path // .tool_input.absolute_path //
  .file_path // .path // empty' 2>/dev/null || true)

[ -z "$file" ] && exit 0
[ -f "$file" ] || exit 0

case "$file" in
  *.ts | *.tsx | *.js | *.jsx | *.mjs | *.cjs | *.json | *.jsonc | *.css | *.md | *.yml | *.yaml)
    # .prettierignore 対象は prettier 側でスキップされる
    npx prettier --write "$file" >/dev/null 2>&1 || true
    ;;
esac

exit 0
