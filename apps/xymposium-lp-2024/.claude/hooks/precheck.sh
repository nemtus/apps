#!/usr/bin/env bash
# Stop フック: ソース/設定に未コミットの変更がある場合、CI 相当の静的チェックを実行する。
# いずれか失敗したら exit 2 でブロックし、Claude に修正させる (CI を自然に緑へ保つ)。
#
# 速度・安定性のため、Stop ゲートには以下を含める:
#   format:check / lint / typecheck / knip / depcruise / build / unit test
# Storybook ブラウザテスト(`npm run test`) と E2E(`npm run test:e2e`) はサーバ/ブラウザ起動を
# 伴い重く不安定なため Stop では実行せず、CI で担保する (CLAUDE.md 参照)。
set -uo pipefail

cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}" 2>/dev/null || exit 0

input=$(cat 2>/dev/null || true)
# 無限ループ防止: 既に Stop フック起因の停止なら何もしない
if printf '%s' "$input" | jq -e '.stop_hook_active == true' >/dev/null 2>&1; then
  exit 0
fi

# 対象拡張子に変更が無ければスキップ (コミット済みのクリーンな状態では走らせない)
globs=(':(glob)**/*.ts' ':(glob)**/*.tsx' ':(glob)**/*.js' ':(glob)**/*.jsx' ':(glob)**/*.mjs' ':(glob)**/*.cjs' ':(glob)**/*.css')
tracked_changes=$(git status --porcelain -- "${globs[@]}" 2>/dev/null)
if [ -z "$tracked_changes" ]; then
  exit 0
fi

fail() {
  echo "❌ Stop ゲート: $1 が失敗しました。CI を緑にするため修正してください。" >&2
  exit 2
}

npm run format:check >/dev/null 2>&1 || fail "format:check (npm run format で整形)"
npm run lint >/dev/null 2>&1 || fail "lint"
npm run typecheck >/dev/null 2>&1 || fail "typecheck"
npm run knip >/dev/null 2>&1 || fail "knip (デッドコード)"
npm run depcruise >/dev/null 2>&1 || fail "depcruise (依存境界)"
npm run build >/dev/null 2>&1 || fail "build"
npx vitest run --project=unit >/dev/null 2>&1 || fail "ユニットテスト"

exit 0
