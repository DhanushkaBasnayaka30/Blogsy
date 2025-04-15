"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GrLike } from "react-icons/gr";

type Blog = {
	id: string;
	title: string;
	image?: string;
	createdAt: string;
};

export default function UserBlogsPage({ blogs }) {
	const { data: session } = useSession();
	const router = useRouter();
	console.log("in compoent-->", blogs);

	const deleteBlog = async (id: string) => {
		try {
			const res = await fetch(`/api/blog/remove-blog/${id}`, {
				method: "DELETE",
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || "Failed to delete blog");
			}
			alert("Blog deleted successfully!");
			router.refresh();
			return data;
		} catch (error) {
			console.error("Error deleting blog:", error);
			throw error;
		}
	};

	const handleClikedEvent = (state, id_or_slug) => {
		if (state == "route") {
			router.push(`/blogs/${id_or_slug}`);
		} else if (state === "delete") {
			deleteBlog(id_or_slug);
		} else if (state === "update") {
			router.push(`../blogs/${id_or_slug}/update-blog/`);
		}
	};

	return (
		<main className="min-h-screen bg-gray-50  w-full lg:w-[80%]   mx-auto">
			{/* Navbar */}
			{/* Blog List */}
			<div className=" w-full py-10 px-4">
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
					{blogs.map((blog) => (
						<div
							key={blog.id}
							className="border border-gray-300 bg-white rounded-lg overflow-hidden shadow hover:scale-105 transition duration-300 cursor-pointer"
							onClick={() => handleClikedEvent("route", blog.slug)}>
							<div
								className="w-full h-56 bg-cover bg-center"
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
								{session && (
									<div
										className="w-full flex mt-3 gap-x-4
                ">
										<div
											className="bg-blue-500 text-center flex justify-center items-center px-6 py-1 rounded "
											onClick={(e) => {
												e.stopPropagation();
												handleClikedEvent("update", blog.slug);
											}}>
											<p className="text-center text-white">Update</p>
										</div>
										<div
											className="bg-red-500 text-center flex justify-center items-center px-6 py-1 rounded "
											onClick={(e) => {
												e.stopPropagation();
												handleClikedEvent("delete", blog.id);
											}}>
											<p className="text-center text-white">Delete</p>
										</div>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
