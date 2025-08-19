import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
	const cookieStore = await cookies()
	
	// Clear the admin authentication cookie
	cookieStore.set('admin-auth', '', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 0,
		path: '/'
	})

	return NextResponse.json({ success: true })
}
