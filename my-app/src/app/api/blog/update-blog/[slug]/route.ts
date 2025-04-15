import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { processImagesInContent } from "../../blog-create/processImageContent";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const body = await req.json();
    const { title, content, tags, category } = body;

    console.log("Updating blog post with slug:", slug);

    const existingPost = await prisma.blog.findUnique({
      where: { slug },
    });

    if (!existingPost) {
      return NextResponse.json({ message: "Post not found." }, { status: 404 });
    }

    const newSlug = generateSlug(title);

    // If title changed, check for slug conflict
    if (newSlug !== existingPost.slug) {
      const postWithNewSlug = await prisma.blog.findUnique({ where: { slug: newSlug } });
      if (postWithNewSlug) {
        return NextResponse.json(
          { message: "A post with this title already exists." },
          { status: 409 }
        );
      }
    }

    const updatedContent = await processImagesInContent(content, title);

    const updatedPost = await prisma.blog.update({
      where: { slug },
      data: {
        title,
        slug: newSlug,
        content: updatedContent,
        tags: { set: tags },
        category,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ message: "Error updating post" }, { status: 500 });
  }
}
