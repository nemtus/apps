import { NextRequest, NextResponse } from "next/server";

// NOTE: Next 16 では `middleware.ts` は非推奨 (`proxy.ts` 推奨) でビルド時に警告が出るが、
// `proxy.ts` は Node.js ランタイム専用であり、デプロイ先の OpenNext (Cloudflare Workers) が
// Node ミドルウェアを未サポートのため使用できない (proxy へ rename すると
// "Node.js middleware is not currently supported" でデプロイビルドが失敗する)。
// そのため Edge ランタイムで動く従来の `middleware.ts` を意図的に維持している。
// 追跡: https://github.com/opennextjs/opennextjs-cloudflare/issues/962
// OpenNext が Node proxy をサポートしたら `proxy.ts` へ移行する。
export const config = {};

export default function middleware(req: NextRequest) {
  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASS;

  // BASIC_AUTH_USER / BASIC_AUTH_PASS が両方設定されている場合のみ Basic 認証を要求する。
  // 未設定なら公開 (= 認証なし)。NODE_ENV には依存しない。
  // 例: ステージングだけ secret を設定して限定公開し、本番では未設定で公開する。
  if (!user || !pass) {
    return NextResponse.next();
  }

  const basicAuth = req.headers.get("authorization");
  if (basicAuth?.startsWith("Basic ")) {
    try {
      const [reqUser, reqPass] = atob(basicAuth.slice("Basic ".length)).split(":");
      if (reqUser === user && reqPass === pass) {
        return NextResponse.next();
      }
    } catch {
      // 不正な base64 等は握りつぶして 401 にフォールバックする
    }
  }

  return new NextResponse("Unauthorized.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}
