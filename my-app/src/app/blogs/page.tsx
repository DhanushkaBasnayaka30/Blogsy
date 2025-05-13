"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GrLike } from "react-icons/gr";
import { useSession } from "next-auth/react";
import JoditEditor from 'jodit-react';

interface Blog {
	id: string;
	slug: string;
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

	const router = useRouter();
	const { data: session } = useSession();

	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				const response = await fetch(`/api/blog/get-blogs`);
				if (!response.ok) throw new Error("Failed to fetch blogs");

				const data: PaginatedBlogs = await response.json();
				setBlogs(data.blogs);
			} catch (err) {
				console.error(err);
				setError("Failed to fetch blogs");
			} finally {
				setLoading(false);
			}
		};

		fetchBlogs();
	}, []);

	if (loading) return <div className="text-center mt-20">Loading blogs...</div>;
	if (error)
		return <div className="text-center mt-20 text-red-600">{error}</div>;

	return (
		<main className="min-h-screen bg-gray-100  w-full lg:w-[90%] mt-20   mx-auto">
			{/* Navbar */}
			{/* Blog List */}
			<div className=" w-full py-10 px-4">
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
					{blogs.map((blog) => (
						<div
							key={blog.id}
							className="border border-gray-300 bg-white rounded-lg overflow-hidden shadow hover:scale-105 transition duration-300 cursor-pointer"
							onClick={() => router.push(`/blogs/${blog.slug}`)}>
							<div
								className="w-full h-80 bg-cover bg-center"
								style={{
									backgroundImage: `url(${
										blog.content.match(/src="([^"]+)"/)?.[1] ||
										"https://via.placeholder.com/600x400"
									})`,
								}}
							/>
							<div className="p-4">
								<h3 className="text-2xl font-semibold mb-2 text-gray-900">
									{blog.title}
								</h3>
								<p className="text-sm text-gray-600 mb-2">
									Category: {blog.category}
								</p>
								<p className="text-xs text-gray-500">
									Posted on {new Date(blog.createdAt).toLocaleDateString()}
								</p>

								{session && (
									<div className="flex items-center justify-between mt-4 text-sm">
										<div className="flex items-center gap-1">
											<GrLike color="#2563eb" />
											<span>Dhanushka and 4 others like</span>
										</div>
										<span className="underline">5 comments</span>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
				
			</div>
		</main>
	);
};

export default BlogList;
