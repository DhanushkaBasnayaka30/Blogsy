import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'  // assuming you have a Prisma instance here

// GET /api/users/get-user/[email]
export async function GET(req: NextRequest, { params }: { params: { email: string } }) {
  const { email } = params

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
