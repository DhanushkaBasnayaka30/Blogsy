"use client";
import CreatePostPage from "@/app/blogs/create/page";
import ProfileView from "@/app/componets/profileView";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
type User = {
	id: string;
	name: string;
	email: string;
	image: string;
	role: string;
};
export default function Page() {
	const { data: session, status } = useSession();
	const [loading,setLoading] = useState(false)
		const [blogs, setBlogs] = useState([]);
	const [pageState, setPageState] = useState("all");
	const router = useRouter();
	const [users, setUsers] = useState<User[]>([]);
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

	const fetchUsers = async () => {
		try {
			const res = await fetch("/api/users");
			const data = await res.json();
			if (data.success) {
				setUsers(data.users);
			}
		} catch (error) {
			console.error("Failed to fetch users:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	return (
		<div className=" w-full flex mx-auto min-h-screen gap-x-4">
			{/* Profile Section */}
			<ProfileView
				session_data={session}
				blogs_data={blogs}
				pageState1={"all"}
			/>
		</div>
	);
}
