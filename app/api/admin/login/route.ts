import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'

// Force Node.js runtime for better compatibility
export const runtime = 'nodejs'

const loginSchema = z.object({
	password: z.string().min(1, 'Password is required')
})

export async function POST(request: NextRequest) {
	try {
		// Parse request body
		const body = await request.json()
		const { password } = loginSchema.parse(body)

		// Check password
		const correctPassword = process.env.ADMIN_PASSWORD
		if (!correctPassword) {
			return NextResponse.json(
				{ error: 'Server configuration error' },
				{ status: 500 }
			)
		}

		if (password !== correctPassword) {
			return NextResponse.json(
				{ error: 'Invalid password' },
				{ status: 401 }
			)
		}

		// Generate simple session token (using timestamp + random for now)
		const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
		const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

		// Set secure cookie with session token
		const cookieStore = await cookies()
		cookieStore.set('admin-session', sessionToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 60 * 60 * 24, // 24 hours
			path: '/'
		})

		// Set session expiry cookie
		cookieStore.set('admin-expiry', sessionExpiry.toISOString(), {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 60 * 60 * 24, // 24 hours
			path: '/'
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		// Log error for debugging
		console.error('Login error:', error)
		
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: 'Invalid request data' },
				{ status: 400 }
			)
		}
		
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
