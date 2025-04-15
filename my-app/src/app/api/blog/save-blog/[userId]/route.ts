import { prisma } from "@/lib/prisma"; // Adjust the import based on your project structure
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  // Ensure params is awaited before accessing userId
  const { userId } = await params;
  
  try {
    const { blogId } = await req.json(); // Get the blogId from the request body

    // Check if the blogId and userId are provided
    if (!blogId || !userId) {
      return NextResponse.json({ message: "Blog ID and User ID are required" }, { status: 400 });
    }

    // Check if the user already saved this post
    const existingSave = await prisma.savedPost.findUnique({
      where: {
        blogId_userId: {
          blogId,
          userId,
        },
      },
    });

    if (existingSave) {
      return NextResponse.json({ message: "Post already saved" }, { status: 409 });
    }

    // Save the post to the database
    const savedPost = await prisma.savedPost.create({
      data: {
        blog: { connect: { id: blogId } }, // Connect to the blog
        user: { connect: { id: userId } }, // Connect to the user
      },
      include: {
        blog: true,
        user: true,
      },
    });

    // Return the saved post
    return NextResponse.json(savedPost, { status: 201 });
  } catch (error) {
    console.error("[SAVE POST ERROR]", error);
    return NextResponse.json({ message: "Failed to save post", error }, { status: 500 });
  }
}
