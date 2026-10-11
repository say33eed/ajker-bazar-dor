
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isProtectedRoute =
    pathname === "/profile" ||
    pathname.startsWith("/profile/") ||
    pathname.startsWith("/product/");

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    const signInUrl = new URL("/signin", request.url);

    signInUrl.searchParams.set(
      "callbackUrl",
      `${pathname}${search}`
    );

    signInUrl.searchParams.set(
      "reason",
      "auth-required"
    );

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile",
    "/profile/:path*",
    "/product/:path*",
  ],
};
