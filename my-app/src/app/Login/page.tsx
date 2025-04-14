"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // optional if using shadcn/ui
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import SigninButton from "../componets/SigninButton";

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard/");
    }
  }, [session, router]);

  return (
    <div className="flex flex-col items-center justify-center  bg-gray-600 w-full z-50 absolute h-screen overflow-hidden">
      <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Welcome to Blogsy</h2>
        <button
          onClick={() => signIn("google")}
          className="bg-red-500 text-white w-full py-2 rounded-lg hover:bg-red-600 mb-4"
        >
          Sign in with Google
        </button>
        <button
          onClick={() => signIn("github")}
          className="bg-gray-800 text-white w-full py-2 rounded-lg hover:bg-gray-900"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
