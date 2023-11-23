import { NextRequest, NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const authorizationHeader = request.headers.get("authorization");

  const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER;
  const BASIC_AUTH_PASS = process.env.BASIC_AUTH_PASS;

  if (authorizationHeader) {
    const basicAuth = authorizationHeader.split(" ")[1];
    const [user, password] = Buffer.from(basicAuth, "base64").toString().split(":");

    if (user === BASIC_AUTH_USER && password === BASIC_AUTH_PASS) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Basic Auth required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}
