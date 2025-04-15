"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function MainPage() {
	const router = useRouter();
	const { data: session } = useSession();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (session?.user.role === "admin") {
			router.push("../dashboard/admin_dashboard");
			console.log("asdf");
		} else if (session?.user.role === "editor") {
			router.push("../dashboard/editor_dashboard.tsx");
		} else {
			router.push("../dashboard/user_dashboard");
		}
	}, []);
	return (
		<div className=" ">
			{!loading ? (
				<div></div>
			) : (
				<div className=" w-full h-screen flex justify-center items-center">
					<p className="text-xl font-semibold">Loading...</p>
				</div>
			)}
		</div>
	);
}
