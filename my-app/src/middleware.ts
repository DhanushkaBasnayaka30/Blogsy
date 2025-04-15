import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  console.log("token ==========>", token);
  console.log("Middleware running for path:", pathname);


  const isBlogPage = pathname.startsWith("/blogs");

  if (isBlogPage && !token) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }

  
  const isAdminRoute = pathname.startsWith("/dashboard/admin_dashboard");
  const isEditorRoute = pathname.startsWith("/editor_dashboard");
  const isUserRoute = pathname.startsWith("/dashboard/user_dashboard");
  const isCreatePostRoute = pathname.startsWith("/blogs/create");

  if (
    (isAdminRoute || isEditorRoute || isUserRoute || isCreatePostRoute) &&
    !token
  ) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }

  // Existing role-based checks
  if (isAdminRoute && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (isEditorRoute && token?.role !== "editor" && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (
    isCreatePostRoute &&
    token?.role !== "editor" &&
    token?.role !== "admin" &&
    token?.role !== "reader"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (isUserRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    }

    if (!token.email) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/admin_dashboard/:path*",
    "/dashboard/editor_dashboard/:path*",
    "/dashboard/user_dashboard/:path*",
    "/blogs/create",
    "/blogs/:slug", 
  ],
};
