import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup");

  if (!tokenCookie) {
    if (!isAuthRoute) return NextResponse.redirect(new URL("/login", request.url));
    return NextResponse.next();
  }

  // Validate JWT — clear stale/invalid cookies so users aren't stuck on dashboard
  const secret = process.env.JWT_SECRET;
  if (secret) {
    try {
      await jwtVerify(tokenCookie.value, new TextEncoder().encode(secret));
    } catch {
      const res = isAuthRoute
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("token");
      return res;
    }
  }

  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/backend).*)"],
};
