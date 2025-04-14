'use client'

import React, { useEffect, useState } from "react";

interface Blog {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
}

interface PaginatedBlogs {
  blogs: Blog[];
  totalBlogs: number;
}

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalBlogs, setTotalBlogs] = useState<number>(0);
console.log(blogs);
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`/api/blog/get-blogs?page=${page}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data: PaginatedBlogs = await response.json();
        setBlogs(data.blogs);
        setTotalBlogs(data.totalBlogs);
      } catch (err) {
        setError("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page]);

  const totalPages = Math.ceil(totalBlogs / 5); // 5 posts per page

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Blog List</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="relative">
              <div
                className="w-full h-56 bg-cover bg-center"
                style={{ backgroundImage: `url(${blog.content.match(/src="([^"]+)"/)?.[1] || ""})` }}
              />
							<p dangerouslySetInnerHTML={{ __html: blog.content }} />

            </div>
            <div className="p-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">{blog.title}</h2>
              <p className="text-gray-600 text-sm mb-4">Category: {blog.category}</p>
              <p className="text-gray-500 text-sm mb-4">Created on: {new Date(blog.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-500 text-sm">
                <strong>Tags:</strong> {Array.isArray(blog.tags) ? blog.tags.join(", ") : "No tags available"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span className="text-lg">{page} of {totalPages}</span>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogList;
