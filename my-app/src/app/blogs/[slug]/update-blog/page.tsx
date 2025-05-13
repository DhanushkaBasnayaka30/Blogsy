"use client";
import JoditEditorTemplate from "@/app/componets/JoditEditor";
import RichTextEditor from "@/app/componets/rich-text-editor/page";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function UpdatePostPage() {
	const { data: session } = useSession();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [category, setCategory] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const { slug } = useParams();

	useEffect(() => {
		const fetchPost = async () => {
			const res = await fetch(`/api/blog/get-blog/${slug}`);
			const data = await res.json();
			setTitle(data.title);
			setContent(data.content);
			setTags(Array.isArray(data.tags) ? data.tags : []);
			console.log(data.tags);
			setCategory(data.category);
		};
		fetchPost();
	}, [slug]);
  

	console.log(content);
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const res = await fetch(`/api/blog/update-blog/${slug}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title, content, tags, category }),
		});

		const data = await res.json();
		setLoading(false);

		if (res.ok) {
			router.push(`/blogs/${data.slug}/`);
		} else {
			setError("Error in updating");
			console.error("Failed to update post:", data.message);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === "title") setTitle(value);
		else if (name === "category") setCategory(value);
	};

	const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		const tagArray = inputValue
			.split(",")
			.map((tag) => tag.trim())
			.filter((tag) => tag.length > 0);
		setTags(tagArray);
	};

	return (
		<div className="min-h-screen bg-white w-[100%] top-0 flex items-start justify-center px-4 sm:px-6 lg:px-8">
			{!loading && (
				<form
					onSubmit={handleSubmit}
					className="bg-white relative w-[90%] mx-auto rounded-3xl shadow-xl p-10 space-y-8">
					<div className="flex items-center justify-between">
						<h1 className="text-3xl font-extrabold tracking-tight text-gray-800 text-center w-full -ml-8">
							Update Blog
						</h1>
					</div>

					{error && (
						<div className="text-red-600 text-sm font-medium">{error}</div>
					)}

					<div>
						<input
							type="text"
							name="title"
							placeholder="Blog Title"
							className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition"
							value={title}
							onChange={handleInputChange}
							required
						/>
					</div>

					<div>
						<input
							type="text"
							name="category"
							placeholder="Category"
							className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition"
							value={category}
							onChange={handleInputChange}
							required
						/>
					</div>

					<div>
						<p className="text-lg font-medium text-gray-600 mb-2">Content</p>
						{/* <RichTextEditor content={content} onChange={setContent}  /> */}
						<JoditEditorTemplate
            
							value={content} // Controlled value
							onChange={(newContent) => setContent(newContent)} // Sync changes with state
							placeholder="Type something here..."
							
						/>
					</div>

					<div>
						<label
							htmlFor="tags"
							className="block text-lg font-medium text-gray-700 mb-2">
							Tags (comma separated)
						</label>
						<input
							type="text"
							name="tags"
							id="tags"
							placeholder="tag1, tag2, tag3"
							className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition"
							value={tags.join(", ")} //
							onChange={handleTagsChange}
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition transform hover:-translate-y-0.5 duration-300"
						disabled={loading}>
						{loading ? "Updating..." : "Update Blog"}
					</button>
				</form>
			)}

			{loading && (
				<div className="h-screen w-[60%] mx-auto left-[30%] absolute top-0 flex justify-center items-center overflow-hidden">
					<div className="bg-gray-400 h-screen w-[100%] mx-auto left-0 opacity-65 top-21 absolute z-[10]"></div>
					<p className="text-4xl uppercase font-bold text-black absolute z-50">
						Updating...
					</p>
				</div>
			)}
		</div>
	);
}
