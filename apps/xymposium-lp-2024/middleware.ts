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
  const basicAuth = req.headers.get("authorization");

  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  if (process.env.NODE_ENV === "production" || !process.env.BASIC_AUTH_USER) {
    return NextResponse.next();
  }

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, password] = atob(authValue).split(":");

    if (user === process.env.BASIC_AUTH_USER && password === process.env.BASIC_AUTH_PASS) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Unauthorized.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}
