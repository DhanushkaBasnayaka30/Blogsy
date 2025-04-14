import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Blog Posts</h1>
      {posts.map((post) => (
        <Link key={post.id} href={`/blog/${post.slug}`}>
          <div className="border p-4 mb-4 hover:bg-gray-100 rounded">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-500">{post.createdAt.toLocaleDateString()}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
