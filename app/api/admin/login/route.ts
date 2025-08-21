import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import crypto from 'crypto'

// Rate limiting store (in production, use Redis)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

const loginSchema = z.object({
	password: z.string().min(1, 'Password is required')
})

export async function POST(request: NextRequest) {
	try {
		// Rate limiting check - get IP from headers
		const clientIP = request.headers.get('x-forwarded-for') || 
			request.headers.get('x-real-ip') || 
			'unknown'
		const now = Date.now()
		const attempts = loginAttempts.get(clientIP) || { count: 0, lastAttempt: 0 }
		
		// Reset attempts after 15 minutes
		if (now - attempts.lastAttempt > 15 * 60 * 1000) {
			attempts.count = 0
		}
		
		// Block after 5 failed attempts for 15 minutes
		if (attempts.count >= 5) {
			return NextResponse.json(
				{ error: 'Too many login attempts. Please try again later.' },
				{ status: 429 }
			)
		}

		const body = await request.json()
		const { password } = loginSchema.parse(body)

		// Check password
		const correctPassword = process.env.ADMIN_PASSWORD
		if (!correctPassword) {
			console.error('ADMIN_PASSWORD environment variable not set')
			return NextResponse.json(
				{ error: 'Server configuration error' },
				{ status: 500 }
			)
		}

		if (password !== correctPassword) {
			// Increment failed attempts
			attempts.count++
			attempts.lastAttempt = now
			loginAttempts.set(clientIP, attempts)
			
			return NextResponse.json(
				{ error: 'Invalid password' },
				{ status: 401 }
			)
		}

		// Reset attempts on successful login
		loginAttempts.delete(clientIP)

		// Generate secure session token
		const sessionToken = crypto.randomBytes(32).toString('hex')
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
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: 'Invalid request data' },
				{ status: 400 }
			)
		}
		
		console.error('Login error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
