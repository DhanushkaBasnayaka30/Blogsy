import { NextRequest, NextResponse } from "next/server";
import prisma from     "../../../../../lib/prisma";
import cloudinary from "../../../../../lib/cloudinary";

// Utility to extract public_id from a Cloudinary URL
function getPublicIdFromUrl(url: string) {
  const matches = url.match(/\/([^/]+)\.(jpg|jpeg|png|webp|gif)$/i);
  return matches ? matches[1] : null;
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Find the blog post
    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    // If blog has a top-level image, delete from Cloudinary
    if (blog.image) {
      const publicId = getPublicIdFromUrl(blog.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
        console.log(`🗑️ Deleted main blog image: ${publicId}`);
      }
    }

    // Delete the blog from Prisma
    await prisma.blog.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Blog deleted successfully" });

  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ message: "Error deleting blog" }, { status: 500 });
  }
}
