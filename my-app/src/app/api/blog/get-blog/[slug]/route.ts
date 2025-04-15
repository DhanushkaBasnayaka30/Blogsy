import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const blog = await prisma.blog.findFirst({
      where: { slug: params.slug },
      include: {
        comments: true,
        likes: true,
      },
    });

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
