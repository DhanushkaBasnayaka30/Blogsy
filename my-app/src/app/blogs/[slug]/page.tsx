import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export default async function SingleBlogPage({ params }: Props) {
  const blog = await prisma.blog.findUnique({
    where: { slug: params.slug },
  });

  if (!blog) return notFound();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
    </div>
  );
}
