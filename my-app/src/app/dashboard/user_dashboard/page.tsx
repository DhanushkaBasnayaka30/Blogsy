'use client'
import { useSession } from 'next-auth/react';
import React from 'react'

export default function Page() {
  const { data: session } = useSession();
  return (
    <div className='bg-red-400 mt-20'>
      <p>user</p>
      <p>{session?.user?.email}</p>
    </div>
  )
}
