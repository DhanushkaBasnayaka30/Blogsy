import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { processImagesInContent } from "./processImageContent";

// Utility to generate a slug from title
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-word characters
    .replace(/\s+/g, "-");    // replace spaces with hyphens
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, tags, category, userId } = body;
    console.log("Creating blog for user:", userId);

    // Generate slug
    const slug = generateSlug(title);

    // Check if slug already exists
    const existingPost = await prisma.blog.findUnique({
      where: { slug },
    });
    if (existingPost) {
      return NextResponse.json(
        { message: "A post with this title already exists." },
        { status: 409 }
      );
    }

   
    const updatedContent = await processImagesInContent(content,title);

    
    const post = await prisma.blog.create({
      data: {
        title,
        slug,
        content: updatedContent,
        tags: { set: tags },
        category,
        author: { connect: { id: userId } },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { message: "Error creating post" },
      { status: 500 }
    );
  }
}
