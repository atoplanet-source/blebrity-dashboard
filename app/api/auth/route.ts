import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const { password } = await request.json()

  const correctPassword = process.env.DASHBOARD_PASSWORD

  if (!correctPassword) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }

  if (password === correctPassword) {
    const cookieStore = await cookies()
    cookieStore.set('blebrity_auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('blebrity_auth')
  return NextResponse.json({ success: true })
}
