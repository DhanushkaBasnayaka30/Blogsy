"use client";
import BlogEditor from "@/app/componets/BlogEdier";
import TiptapEditor from "@/app/componets/Editor";
import JoditEditorTemplate from "@/app/componets/JoditEditor";
import Example from "@/app/componets/JoditEditor";
import RichTextEditor from "@/app/componets/rich-text-editor/page";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";

export default function CreatePostPage() {
	const { data: session } = useSession();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [tags, setTags] = useState([]);
	const [category, setCategory] = useState("");
	const [userId, setUserId] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const router = useRouter();

	console.info(content, tags, title);
	useEffect(() => {
		if (session?.user.id) {
			setUserId(session.user.id);
		}
	}, [session]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === "title") setTitle(value);
		else if (name === "category") setCategory(value);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await fetch("../../api/blog/blog-create/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title, content, tags, category, userId }),
			});

			if (response.ok) {
				const post = await response.json();

				console.log("Post created successfully", post);
				router.push(`/blogs`);
				router.refresh();
			} else {
				const error = await response.json();
				setError(error.message || "Error creating post");
			}
		} catch (error) {
			console.log(error);
			setError("Error creating post");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-white w-[100%]   top-0 flex items-start justify-center  px-4 sm:px-6 lg:px-8">
			{!loading && (
				<form
					onSubmit={handleSubmit}
					className="  bg-white relative w-[90%] mx-auto rounded-3xl shadow-xl p-10 space-y-8">
					<div className="flex items-center justify-between">
						<h1 className="text-3xl font-extrabold tracking-tight text-gray-800 text-center w-full -ml-8">
							Create a New Blog
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
						{/* <RichTextEditor content={content} onChange={setContent} /> */}
						<JoditEditorTemplate
							value={content} // Controlled value
							onChange={(newContent) => setContent(newContent)} // Sync changes with state
							placeholder="Type something here..."
							className="h-[500px]" // Set height through Tailwind CSS (if you're using it)
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
							value={tags.join(", ")}
							onChange={(e) =>
								setTags(e.target.value.split(",").map((tag) => tag.trim()))
							}
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition transform hover:-translate-y-0.5 duration-300"
						disabled={loading}>
						{loading ? "Creating..." : "Create Blog"}
					</button>
				</form>
			)}
			{loading && (
				<div className=" h-screen w-[60%] mx-auto left-[30%] absolute top-0 flex justify-center items-center overflow-hidden">
					<div className="bg-gray-400 h-screen w-[100%] mx-auto left-0 opacity-65 top-21 absolute z-[10]"></div>
					<p className="text-4xl uppercase font-bold text-black absolute z-50">
						creating...
					</p>
				</div>
			)}
		</div>
	);
}
