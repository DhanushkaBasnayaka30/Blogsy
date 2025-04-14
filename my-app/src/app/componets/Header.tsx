"use client";
import React, { useState } from "react";
import { ModeToggle } from "./DarkModeToggle";
import { GoSearch } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SigninButton from "./SigninButton";
import Image from "next/image";

export default function Header() {
	const [profileDropdown, setProfileDrop] = useState(false);
	const router = useRouter();
	const { data: session } = useSession();

	return (
		<div className=" w-[80%]  mx-auto h-20 flex px-4 justify-between  items-center bg-white  z-50 fixed top-0 border border-black left-[10%] transition-colors duration-300">
			<h1 className="text-5xl font-bold text-black dark:text-black">BLOGSY</h1>

			<div className="flex h-full items-center">
				<div className="w-full h-14 flex ml-20">
					<form action="">
						<div className="flex items-center justify-center w-[420px]   pr-4 h-full border border-black  rounded-lg transition-colors duration-300">
							<input
								type="text"
								placeholder="Search..."
								className="w-[400px] text-xl pl-2 h-full bg-transparent outline-none"
							/>
							<GoSearch size={26} className="text-black " />
						</div>
					</form>
				</div>
				<p className="px-4 py-2 bg-black text-white rounded-lg ml-2" onClick={()=>router.push('../blogs/create')}>createBlog</p>
				<div className="flex items-center gap-x-4 ml-6">
					<ModeToggle />
					<div className="relative  border  w-full h-full group">
						{!session ? (
							<CgProfile size={30} className="text-balck " color="black" />
						) : (
							<Image
								src={session.user.image ?? ""}
								alt={session.user.name ?? ""}
								className=" rounded-full"
								width={80}
								height={80}
							/>
						)}
						<div className="w-40 h-40 border-black border right-[-20] z-10 bg-white  top-0 absolute hidden items-center justify-start gap-y-2 flex-col group-hover:flex ">
							<p className="text-black">profile</p>
							{session ? (
								<button onClick={() => signOut()} className="text-red-600 ">
									Sign Out
								</button>
							) : (
								<SigninButton />
							)}
						</div>
						<div></div>
					</div>
				</div>
			</div>
		</div>
	);
}
