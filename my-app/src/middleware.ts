import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
	const token = await getToken({ req: request });

	const { pathname } = request.nextUrl;
	console.log("toekn ==========>", token);
	console.log("Middleware running for path:", pathname);
		const isAdminRoute = pathname.startsWith("/admin_dashboard");
	const isEditorRoute = pathname.startsWith("/editor_dashboard");
	const isUserRoute = pathname.startsWith("/user_dashboard");
	const isCreatePostRoute = pathname.startsWith("/blogs/create");

	
	if (
		(isAdminRoute || isEditorRoute || isUserRoute || isCreatePostRoute) &&
		!token
	) {
		return NextResponse.redirect(new URL("/api/auth/signin", request.url));
	}

	
	if (isAdminRoute && token?.role !== "admin") {
		return NextResponse.redirect(new URL("/unauthorized", request.url));
	}

	if (isEditorRoute && token?.role !== "editor" && token?.role !== "admin") {
		return NextResponse.redirect(new URL("/unauthorized", request.url));
	}

	
	if (
		isCreatePostRoute &&
		token?.role !== "editor" &&
		token?.role !== "admin"  &&
		token?.role !== "user"
	) {
		return NextResponse.redirect(new URL("/unauthorized", request.url));
	}


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
