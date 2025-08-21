import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
	try {
		const env = {
			NODE_ENV: process.env.NODE_ENV || 'not set',
			ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'set' : 'not set',
			VERCEL_URL: process.env.VERCEL_URL || 'not set',
			VERCEL_ENV: process.env.VERCEL_ENV || 'not set'
		}
		
		return NextResponse.json({
			status: 'success',
			environment: env,
			timestamp: new Date().toISOString()
		})
	} catch (error) {
		return NextResponse.json({
			status: 'error',
			error: error instanceof Error ? error.message : 'Unknown error',
			timestamp: new Date().toISOString()
		}, { status: 500 })
	}
}
