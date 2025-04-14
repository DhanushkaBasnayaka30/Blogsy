// File: src/app/api/blogs/get-blogs/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Get query parameters for pagination
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1"); // Default to page 1 if not provided
    const limit = 5; // Number of posts per page
    const skip = (page - 1) * limit; // Skip the appropriate number of posts

    // Fetch paginated blog posts
    const blogs = await prisma.blog.findMany({
      skip,
      take: limit,
      include: {
        author: true, // Include the author info (optional)
      },
    });

    // Get the total count of blogs for pagination
    const totalBlogs = await prisma.blog.count();

    return NextResponse.json({ blogs, totalBlogs });
  } catch (error) {
    console.error("Error retrieving blogs:", error);
    return NextResponse.json({ message: "Error retrieving blogs" }, { status: 500 });
  }
}
