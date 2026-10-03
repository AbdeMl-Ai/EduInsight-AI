import { NextRequest, NextResponse } from "next/server";

import { hasWorkspaceAccess, type WorkspaceRole } from "@/lib/auth-token";

const AUTH_COOKIE = "eduinsight_access_token";

function requiredRole(pathname: string): WorkspaceRole | null {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return "admin";
  if (pathname === "/teacher" || pathname.startsWith("/teacher/")) return "teacher";
  if (pathname === "/student" || pathname.startsWith("/student/")) return "student";
  return null;
}

export function middleware(request: NextRequest) {
  const role = requiredRole(request.nextUrl.pathname);
  if (!role) return NextResponse.next();

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (hasWorkspaceAccess(token, role)) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete(AUTH_COOKIE);
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*"],
};
