'use client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function MainPage() {
  const router = useRouter();
  const { data: session } = useSession();

 
  return (
    <div className=' '>
      <p>Loading...</p>
    </div>
  );
}
