"use client";

import { SessionProvider } from "next-auth/react";
import MainPage from "./dashboard/page";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
const router = useRouter()
	useEffect(()=>{
router.push('./blogs/')
	},[])

	return (
		<SessionProvider>
      <>
     			<div className="w-[80%] mx-auto mt-20 h-auto min-h-screen border border-black">
            
				</div>
      </>
		</SessionProvider>
	);
}
