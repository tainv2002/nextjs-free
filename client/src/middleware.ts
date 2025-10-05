import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authPaths = ["/login", "/register"];
const privatePaths = ["/me"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("sessionToken")?.value;
  const pathname = request.nextUrl.pathname;

  console.log(sessionToken);

  if (sessionToken && authPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/me", request.url));
  }

  if (!sessionToken && privatePaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login", "/register", "/me"],
};
