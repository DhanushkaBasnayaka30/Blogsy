'use client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function MainPage() {
  const router = useRouter();
  const { data: session } = useSession();

  // useEffect(() => {
  //   if (session?.user) {
  //     console.log(session);
  //     if (session?.user.role === "admin" || session?.user?.role === "editor") {
  //       router.push("./user_dashboard/");
  //     } else {
  //       router.push("./user_dashboard/");
  //     }
  //   } 
  // }, [session, router]);  // Add session and router as dependencies

  return (
    <div className=' '>
      <p>Loading...</p>
    </div>
  );
}
