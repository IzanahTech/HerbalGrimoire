import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function isRateLimited(ip: string, limit: number, windowMs: number): boolean {
	const now = Date.now()
	const record = rateLimitStore.get(ip)
	
	if (!record || now > record.resetTime) {
		rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
		return false
	}
	
	if (record.count >= limit) {
		return true
	}
	
	record.count++
	return false
}

export function middleware(request: NextRequest) {
	const response = NextResponse.next()
	
	// Get client IP from headers
	const ip = request.headers.get('x-forwarded-for') || 
		request.headers.get('x-real-ip') || 
		'unknown'

	// CSRF protection: enforce same-origin on state-changing API routes
	const isApi = request.nextUrl.pathname.startsWith('/api/')
	const method = request.method.toUpperCase()
	const stateChanging = method === 'POST' || method === 'PATCH' || method === 'PUT' || method === 'DELETE'
	if (isApi && stateChanging) {
		const origin = request.headers.get('origin')
		const host = request.headers.get('host')
		if (!origin || !host || !origin.includes(host)) {
			return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
		}
	}
	
	// Rate limiting for API routes
	if (isApi) {
		// Stricter rate limiting for admin routes
		if (request.nextUrl.pathname.startsWith('/api/admin/')) {
			if (isRateLimited(ip, 10, 60 * 1000)) { // 10 requests per minute
				return NextResponse.json(
					{ error: 'Rate limit exceeded' },
					{ status: 429 }
				)
			}
		} else {
			// General API rate limiting
			if (isRateLimited(ip, 100, 60 * 1000)) { // 100 requests per minute
				return NextResponse.json(
					{ error: 'Rate limit exceeded' },
					{ status: 429 }
				)
			}
		}
	}
	
	// Add security headers
	response.headers.set('X-DNS-Prefetch-Control', 'off')
	response.headers.set('X-Download-Options', 'noopen')
	response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
	
	// Block suspicious user agents
	const userAgent = request.headers.get('user-agent') || ''
	const suspiciousPatterns = [
		/curl/i,
		/wget/i,
		/python/i,
		/php/i,
		/scanner/i,
		/bot/i,
		/crawler/i
	]
	
	if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
		// Log suspicious activity but don't block completely
		console.warn(`Suspicious user agent detected: ${userAgent} from IP: ${ip}`)
	}
	
	return response
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		'/((?!_next/static|_next/image|favicon.ico|public).*)',
	],
} 