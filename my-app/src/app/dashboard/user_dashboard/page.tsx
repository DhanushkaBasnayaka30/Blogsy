"use client";
import CreatePostPage from "@/app/blogs/create/page";
import ProfileView from "@/app/componets/profileView";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
	const { data: session, status } = useSession();
	const [pageState, setPageState] = useState("save");
	const [blogs, setBlogs] = useState([]);
	const router = useRouter();

	useEffect(() => {
		const fetchBlogs = async () => {
			if (!session?.user?.email) return; // avoid calling when no email

			try {
				const response = await fetch(
					`/api/blog/get-blogs/${encodeURIComponent(session.user.email)}`
				);

				if (!response.ok) {
					throw new Error("Failed to fetch blogs");
				}

				const data = await response.json();
				console.log("Fetched blogs:", data);
				setBlogs(data.blogs); // store them if needed
			} catch (err) {
				console.error(err);
			}
		};

		if (status === "authenticated" && pageState === "blog") {
			fetchBlogs();
		}
	}, [pageState, session]);

	return (
		<div className=" w-full flex mx-auto min-h-screen gap-x-4">
			{/* Profile Section */}
			<ProfileView
				session_data={session}
				blogs_data={blogs}
				pageState1={"save"}
			/>
		</div>
	);
}
