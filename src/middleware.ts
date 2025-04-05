import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./server/auth/config";

const PUBLIC_ROUTES = ["/login", "/register", "/"];
const ADMIN_ROUTES = ["/admin"];
const REPORTER_ROUTES = ["/reporter"];
const { auth: middleware } = NextAuth(authConfig);

export default middleware(async (req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>  nextUrl.pathname.startsWith(route) );
  const isAdminRoute = ADMIN_ROUTES.some((route) => nextUrl.pathname.startsWith(route) );
  const noNameUser = req.auth?.user?.name === null;
  const isReporterRoute = REPORTER_ROUTES.some((route) =>  nextUrl.pathname.startsWith(route) );
  if (
    isAuthenticated &&
    noNameUser &&
    !nextUrl.pathname.startsWith("/register")
  )  return NextResponse.redirect(new URL("/register", nextUrl));
  if (isAdminRoute) {
    if (!isAuthenticated || req.auth?.user?.role !== "ADMIN") return NextResponse.redirect(new URL("/", nextUrl));
  }
  if (isReporterRoute) {
    if (
      !isAuthenticated ||
      (req.auth?.user?.role !== "REPORTER" && req.auth?.user?.role !== "ADMIN")
    )  return NextResponse.redirect(new URL("/", nextUrl));
  }
  if (!isPublicRoute && !isAdminRoute && !isReporterRoute) {
    if (!isAuthenticated) return NextResponse.redirect(new URL("/login", nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
