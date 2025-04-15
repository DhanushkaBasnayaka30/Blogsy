"use client";
import CreatePostPage from "@/app/blogs/create/page";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import BlogList from "../blogs/page";
import { RiMenu2Line } from "react-icons/ri";
import { IoCloseOutline } from "react-icons/io5";
import UserBlogsPage from "./myBlog";

type Blog = {
	id: string;
	title: string;
	image?: string;
	createdAt: string;
};

export default function ProfileView({ session_data, blogs_data, pageState1 }) {
	const session = session_data;
	const [pageState, setPageState] = useState(pageState1);
	const [users, setUsers] = useState([]);
	const router = useRouter();
	const [mobileVisible, setMobileVisible] = useState(false);
	const [blogs, setBlogs] = useState<Blog[]>([]);
	const [loading1, setLoading1] = useState(true);
	
	const [error, setError] = useState("");
	const [page, setPage] = useState<number>(1);
	// const mobileMenuRef = useRef(null);

	// Fetch users when pageState changes to 'users'
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await fetch("/api/users");
				const data = await res.json();
				if (data.success) {
					setUsers(data.users);
				}
			} catch (error) {
				console.error("Failed to fetch users:", error);
			}
		};

		if (pageState === "users") {
			fetchUsers();
		}
	}, [pageState]);
console.log(users,"=------>");
	// useEffect(() => {
	//   const handleClickOutside = (event) => {
	//     if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
	//       setMobileVisible(false);
	//     }
	//   };

	//   const handleScroll = () => {
	//     setMobileVisible(false);
	//   };

	//   document.addEventListener("click", handleClickOutside);
	//   document.addEventListener("scroll", handleScroll);

	//   return () => {
	//     document.removeEventListener("click", handleClickOutside);
	//     document.removeEventListener("scroll", handleScroll);
	//   };
	// }, []);
	console.log(mobileVisible);
	const handleListChange = (state) => {
		setPageState(state);
		setMobileVisible(false);
	};
	// fetching my blogs
	useEffect(() => {
		async function fetchMyBlogs() {
			try {
				const res = await fetch(`/api/blog/get-blogs/${session?.user.email}`);
				const data = await res.json();
				setBlogs(data.blogs);
			} catch (error) {
				console.error("Failed to fetch blogs:", error);
			} finally {
				setLoading1(false);
			}
		}
		const fetchAllBlogs = async () => {
			try {
				const response = await fetch(`/api/blog/get-blogs`);
				if (!response.ok) throw new Error("Failed to fetch blogs");

				const data = await response.json();
				setBlogs(data.blogs);
			} catch (err) {
				setError("Failed to fetch blogs");
			} finally {
				setLoading1(false);
			}
		};
		if (pageState === "all") {
			fetchAllBlogs();
		} else if (pageState === "blog") {
		}
		fetchMyBlogs();
	}, [page, pageState]);

	

	return (
		<div className="mt-21 md:w-[90%] w-full flex mx-auto min-h-screen gap-x-4">
			{/* Profile Sidebar */}
			{session && blogs_data && (
				<>
					<div className="lg:w-[20%] w-0 duration-500 h-auto py-4 fixed flex-col bg-gray-50 items-center hidden lg:flex">
						<div className="relative w-[150px] h-[150px] rounded-full p-4 aspect-square flex border">
							{session?.user.role === "admin" && (
								<div className="absolute z-50 right-0 bottom-0">
									<MdOutlineAdminPanelSettings size={20} />
								</div>
							)}
							<Image
								src={session?.user.image ?? ""}
								alt={session?.user?.name ?? ""}
								className="rounded-full object-cover"
								fill
							/>
						</div>
						<p className="font-semibold">{session?.user.name}</p>
						<p className="text-blue-500">{session?.user.email}</p>
						<div className="w-full pl-2 mt-4">
							<div className="w-full flex flex-col gap-y-4 items-center">
								{session?.user.role === "admin" && (
									<p
										className={`w-[90%] text-start pl-2 py-2 text-gray-800 cursor-pointer hover:bg-gray-300 hover:scale-105 duration-500 ${
											pageState === "all" ? "bg-gray-400" : "bg-gray-200"
										} font-semibold rounded`}
										onClick={() => handleListChange("all")}>
										All Blogs
									</p>
								)}
								{session?.user.role !== "reader" && (
									<>
										<p
											className={`w-[90%] text-start pl-2 py-2 text-gray-800 cursor-pointer hover:bg-gray-300 hover:scale-105 duration-500 ${
												pageState === "blog" ? "bg-gray-400" : "bg-gray-200"
											} font-semibold rounded`}
											onClick={() => {
												handleListChange("blog");
											}}>
											My Blogs
										</p>
										<p
											className={`w-[90%] text-start pl-2 py-2 text-gray-800 cursor-pointer hover:bg-gray-300 hover:scale-105 duration-500 ${
												pageState === "new" ? "bg-gray-400" : "bg-gray-200"
											} font-semibold rounded`}
											onClick={() => {
												handleListChange("new");
											}}>
											Create New
										</p>
									</>
								)}

								<p
									className={`w-[90%] text-start pl-2 py-2 text-gray-800 cursor-pointer hover:bg-gray-300 hover:scale-105 duration-500 ${
										pageState === "saveitem" ? "bg-gray-400" : "bg-gray-200"
									} font-semibold rounded`}
									onClick={() => {
										handleListChange("saveitem");
									}}>
									Save Item
								</p>

								{session?.user.role === "admin" && (
									<p
										className={`w-[90%] text-start pl-2 py-2 text-gray-800 cursor-pointer hover:bg-gray-300 hover:scale-105 duration-500 ${
											pageState === "users" ? "bg-gray-400" : "bg-gray-200"
										} font-semibold rounded`}
										onClick={() => {
											handleListChange("users");
										}}>
										All Users
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Mobile section */}
					<div className="w-20 h-16 lg:hidden fixed ">
						<div
							onClick={() => setMobileVisible(true)}
							className={`w-full h-full flex justify-center items-center hover:scale-110 duration-500 bg-gray-200 cursor-pointer ${
								mobileVisible ? "hidden" : "flex"
							}`}>
							<RiMenu2Line size={30} />
						</div>
						<div
							className={`bg-gray-100 overflow-hidden fixed top-21 md:left-12 z-50 origin-top-left transition-all duration-500 ease-in-out transform ${
								mobileVisible
									? "scale-100 w-[300px] h-auto"
									: "scale-0  ease-in-out transform"
							}`}>
							<div
								className={`w-20 h-16 flex justify-center items-center hover:scale-110 duration-500 bg-gray-200 cursor-pointer ${
									mobileVisible ? "flex" : "hidden"
								}`}
								onClick={() => setMobileVisible(false)}>
								<IoCloseOutline size={30} color="red" />
							</div>
							<div className="flex w-full h-full flex-col items-center justify-start">
								<div className="w-[150px] relative h-[150px] mt-8 aspect-square">
									{session?.user.role === "admin" && (
										<div className="absolute z-50 right-0 bottom-0">
											<MdOutlineAdminPanelSettings size={20} />
										</div>
									)}
									<Image
										src={session?.user.image ?? ""}
										alt={session?.user?.name ?? ""}
										className="rounded-full object-cover"
										fill
									/>
								</div>
								<div className="w-full flex flex-col gap-y-4 items-center">
									{session?.user.role === "admin" && (
										<p
											className={`w-[90%] text-start pl-2 py-2 text-gray-800 cursor-pointer hover:bg-gray-300 hover:scale-105 duration-500 ${
												pageState === "all" ? "bg-gray-400" : "bg-gray-200"
											} font-semibold rounded`}
											onClick={() => setPageState("all")}>
											All Blogs
										</p>
									)}
									{session?.user.role !== "reader" && (
										<>
											<p
												className={`w-[90%] text-start pl-2 py-2 text-gray-800 cursor-pointer hover:bg-gray-300 hover:scale-105 duration-500 ${
													pageState === "blog" ? "bg-gray-400" : "bg-gray-200"
												} font-semibold rounded`}
												onClick={() => setPageState("blog")}>
												My Blogs
											</p>
											<p
												className={`w-[90%] text-start pl-2 py-2 text-gray-800 cursor-pointer hover:bg-gray-300 hover:scale-105 duration-500 ${
													pageState === "new" ? "bg-gray-400" : "bg-gray-200"
												} font-semibold rounded`}
												onClick={() => setPageState("new")}>
												Create New
											</p>
										</>
									)}

									<p
										className={`w-[90%] text-start pl-2 py-2 text-gray-800 cursor-pointer hover:bg-gray-300 hover:scale-105 duration-500 ${
											pageState === "saveitem" ? "bg-gray-400" : "bg-gray-200"
										} font-semibold rounded`}
										onClick={() => setPageState("saveitem")}>
										Save Item
									</p>

									{session?.user.role === "admin" && (
										<p
											className={`w-[90%] text-start pl-2 py-2 text-gray-800 cursor-pointer hover:bg-gray-300 hover:scale-105 duration-500 ${
												pageState === "users" ? "bg-gray-400" : "bg-gray-200"
											} font-semibold rounded`}
											onClick={() => setPageState("users")}>
											All Users
										</p>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Main content */}
					<div className="py-10 overflow-y-auto flex justify-center w-full lg:w-[100%]  h-auto lg:ml-[23%] mx-auto items-center">
						{/* Render content based on pageState */}
						{pageState === "new" ? (
							<CreatePostPage />
						) : pageState === "blog" ? (
							<div className="w-full h-auto min-h-screen">
								<h2 className="text-2xl font-bold   mb-4 text-center">
									My Blogs
								</h2>
								<UserBlogsPage blogs={blogs} loading={loading1} setLoading={setLoading1} />
							</div>
						) : pageState === "all" ? (
							<div className=" w-full h-auto">
								<h2 className="text-2xl font-bold   mb-4 text-center">
									All Blogs
								</h2>

								<UserBlogsPage blogs={blogs} />
							</div>
						) : pageState === "users" ? (
							<div className=" absolute top-21 min-h-screen flex items-center flex-col justify-start">
								<h2 className="text-2xl font-bold mb-4">All Users</h2>
								{/* Render users */}
								{users.length > 0 ? (
									<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-6 gap-4">
										{users.map((user, index) => (
											<div
												key={index}
												className="border p-4 rounded-lg shadow-md bg-gray-200 h-[300px] flex flex-col justify-center items-center">
												<div className="flex items-center gap-4 flex-col">
													<Image
														src={user.image }
														alt={user.name}
														width={90}
														height={90}
														className="rounded-full"
													/>
													<div className="flex flex-col justify-center items-center">
														<p className="font-semibold">{user.name}</p>
														<p className="text-gray-600 text-sm">
															{user.email}
														</p>
													</div>
												</div>
											</div>
										))}
									</div>
								) : (
									<p>No users found</p>
								)}
							</div>
						) : (
							<p className="text-center">No content available</p>
						)}
					</div>
				</>
			)}
		</div>
	);
}
