
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname === "/profile" ||
    pathname.startsWith("/profile/");

  // Public pages, including product details, need no login.
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
      pathname
    );

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/profile/:path*"],
};
