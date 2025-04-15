// File: src/app/api/blogs/get-blogs/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    
    const { searchParams } = req.nextUrl;
    

    
    const blogs = await prisma.blog.findMany({
      include: {
        author: true, 
        comments:true,
        likes:true
      },
    });

    
    

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("Error retrieving blogs:", error);
    return NextResponse.json({ message: "Error retrieving blogs" }, { status: 500 });
  }
}
