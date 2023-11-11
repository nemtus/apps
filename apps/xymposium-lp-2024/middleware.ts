import { NextRequest, NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // const authorizationHeader = request.headers.get("authorization");

  // if (authorizationHeader) {
  //   const basicAuth = authorizationHeader.split(" ")[1];
  //   const [user, password] = Buffer.from(basicAuth, "base64").toString().split(":");

  //   if (user && password) {
  //     return NextResponse.next();
  //   }
  // }

  // return NextResponse.redirect(new URL("/home", request.url));

  // return new NextResponse("Basic Auth required", {
  //   status: 401,
  //   headers: {
  //     "WWW-Authenticate": 'Basic realm="Secure Area"',
  //   },
  // });

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
// export const config = {
//   matcher: "/about/:path*",
// };
