"use client";
import React, { useState } from "react";
import { ModeToggle } from "./DarkModeToggle";
import { GoSearch } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SigninButton from "./SigninButton";
import Image from "next/image";
import { RiMenu3Fill } from "react-icons/ri";
import { AiTwotoneCloseCircle } from "react-icons/ai";

export default function Header() {
	const [profileDropdown, setProfileDrop] = useState(false);
	const router = useRouter();
	const { data: session } = useSession();
	const [menuVisible, setMenuVisible] = useState(false);

	
	return (
		<div className="w-full bg-gray-200    mx-auto h-20 flex px-4 justify-between  items-center   z-50 fixed top-0    transition-colors duration-300">
			<h1
				className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-black cursor-pointer"
				onClick={() => router.push("../blogs/")}>
				BLOGSY
			</h1>

			<div className="flex h-full items-center w-full ">
				<div className="w-full h-14 flex ml-20">
					<form action="" className=" w-full justify-end flex">
						<div className="lg:flex items-center justify-center w-[420px] hidden sm:hidden md:flex  pr-4 h-full border border-black  rounded-lg transition-colors duration-300 ">
							<input
								type="text"
								placeholder="Search..."
								className="w-[400px] text-xl pl-2 h-full bg-transparent outline-none"
							/>
							<GoSearch size={26} className="text-black " />
						</div>
					</form>
				</div>

				<div className="flex items-center gap-x-4 ml:12  md:ml-6">
					<ModeToggle />
					<div className="relative hiiden md:flex  duration-500  w-full h-full group">
						{!session ? (
							<CgProfile
								size={30}
								className="text-balck hidden sm:flex "
								color="black"
							/>
						) : (
							<Image
								src={session.user.image ?? ""}
								alt={session.user.name ?? ""}
								className=" rounded-full"
								width={80}
								height={80}
							/>
						)}
						<div
							className="w-60 h-80 rounded-lg   right-[-2]  hidden z-10 bg-gray-200   top-6 absolute 
						 items-center justify-start gap-y-2 flex-col group-hover:flex ">
							<p
								className="text-black hover:scale-105 duration-700 text-xl cursor-pointer p-2"
								onClick={() => {setMenuVisible(false);router.push("/dashboard");}}>
								profile
							</p>
							{session ? (
								<button
									onClick={() => {
										signOut();
										router.push("../blogs/");
									}}
									className="text-black hover:scale-105 duration-700 ">
									Sign Out
								</button>
							) : (
								<SigninButton />
							)}
						</div>
						<div></div>
					</div>

					{/* mobile Section */}
					<div className="flex sm:hidden">
						<RiMenu3Fill
							className={`${
								!menuVisible ? "flex duration-500" : "hidden duration-500"
							}`}
							size={24}
							onClick={() => setMenuVisible(true)}
						/>
						<div
							className={`absolute bg-gray-200 w-[80%] top-20 h-screen z-50 right-0 justify-center border transition-transform duration-300 ease-in-out ${
								menuVisible ? "translate-y-0" : "translate-y-[-1000px]"
							}`}>
							<div
								className={`${
									menuVisible ? "w-full justify-end flex duration-500 pr-2 pt-2" : "hidden duration-500"
								}`}
							>
								<AiTwotoneCloseCircle size={30} color="red"	onClick={() => setMenuVisible(false)} />
							</div>
							<div className="w-full h-auto flex justify-center">
								<div className="aspect-square flex relative w-[250px] justify-center">
									<Image
										fill
										aria-pressed
										src={
											session?.user.image
												? session?.user.image
												: "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-male-user-profile-vector-illustration-isolated-background-man-profile-sign-business-concept_157943-38764.jpg"
										}
										alt="profile image"
										className="rounded-full object-cover"
									/>
								</div>
							</div>
							{/* list */}

							<div className="w-[90%] mx-auto mt-4 $">
								<p
									className="text-black hover:scale-105 duration-700 border-b-2 border-black cursor-pointer text-2xl p-2"
									onClick={() => router.push("/dashboard")}>
									profile
								</p>
								<div className="flex flex-col gap-y-2">
									{session ? (
										<button
											onClick={() => {
												signOut();
												router.push("../blogs/");
											}}
											className="text-xl border-b-2 border-black ">
											Sign Out
										</button>
									) : (
										<div className="py-4 border-b-2 border-black">
											<SigninButton />
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
