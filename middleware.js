import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAuth = !!token;
  const isProtected = req.nextUrl.pathname.startsWith("/dashboard");

  if (isProtected && !isAuth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(loginUrl);

  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/dashboard/:path*"],
};
