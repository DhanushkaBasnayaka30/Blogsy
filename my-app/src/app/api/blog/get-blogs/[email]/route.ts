import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: { email: string } }
) {
  try {
    const email = context.params.email;
    console.log("email -------->", email);

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const blogs = await prisma.blog.findMany({
      where: {
        author: {
          email: email,
        },
      },
      include: {
        author: true,
        comments: true,
        likes: true,
      },
    });
console.log(blogs);
    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("Error retrieving blogs by email:", error);
    return NextResponse.json(
      { message: "Error retrieving blogs" },
      { status: 500 }
    );
  }
}
