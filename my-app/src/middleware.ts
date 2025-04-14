import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
	const token = await getToken({ req: request });

	const { pathname } = request.nextUrl;
	console.log("toekn ==========>", token);
	console.log("Middleware running for path:", pathname);
	// Check for protected routes
	const isAdminRoute = pathname.startsWith("/admin_dashboard");
	const isEditorRoute = pathname.startsWith("/editor_dashboard");
	const isUserRoute = pathname.startsWith("/user_dashboard");
	const isCreatePostRoute = pathname.startsWith("/blogs/create");

	// If accessing protected route and no token, redirect to sign-in
	if (
		(isAdminRoute || isEditorRoute || isUserRoute || isCreatePostRoute) &&
		!token
	) {
		return NextResponse.redirect(new URL("/api/auth/signin", request.url));
	}

	// Role-based access control
	if (isAdminRoute && token?.role !== "admin") {
		return NextResponse.redirect(new URL("/unauthorized", request.url));
	}

	if (isEditorRoute && token?.role !== "editor" && token?.role !== "admin") {
		return NextResponse.redirect(new URL("/unauthorized", request.url));
	}

	// Restrict /blogs/create to editor and admin
	if (
		isCreatePostRoute &&
		token?.role !== "editor" &&
		token?.role !== "admin"  &&
		token?.role !== "user"
	) {
		return NextResponse.redirect(new URL("/unauthorized", request.url));
	}

	// Optional: restrict /user_dashboard to logged-in users only
	if (isUserRoute && !token) {
		return NextResponse.redirect(new URL("/api/auth/signin", request.url));
	}

	return NextResponse.next();
}

// Apply middleware only to protected paths
export const config = {
	matcher: [
		"/admin_dashboard/:path*",
		"/editor_dashboard/:path*",
		"/user_dashboard/:path*",
		"/blogs/create",
	],
};
