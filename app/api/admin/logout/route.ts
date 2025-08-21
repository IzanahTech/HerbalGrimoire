import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
	try {
		const cookieStore = await cookies()
		
		// Clear the new session cookies
		cookieStore.set('admin-session', '', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 0,
			path: '/'
		})
		
		cookieStore.set('admin-expiry', '', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 0,
			path: '/'
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Logout error:', error)
		return NextResponse.json(
			{ error: 'Failed to logout' },
			{ status: 500 }
		)
	}
}
