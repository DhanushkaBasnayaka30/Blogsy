"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
const SigninButton = () => {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="flex gap-4 ml-auto items-center">
       
      </div>
    );
  }
  return (
    <button onClick={() => signIn()} className="text-green-600  cursor-pointer font-semibold">
      Sign In
    </button>
  );
};

export default SigninButton;
