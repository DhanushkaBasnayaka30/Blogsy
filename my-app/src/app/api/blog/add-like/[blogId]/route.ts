import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest, { params }: { params: { blogId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { blogId } = params;
  

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        blogId_userId: {
          blogId,
          userId: session.user.id,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          blogId_userId: {
            blogId,
            userId: session.user.id,
          },
        },
      });

      return NextResponse.json({ message: "Like removed" });
    } else {
      await prisma.like.create({
        data: {
          blogId,
          userId: session.user.id,
        },
      });

      return NextResponse.json({ message: "Liked successfully" });
    }
  } catch (error) {
    console.error("Error liking post:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
