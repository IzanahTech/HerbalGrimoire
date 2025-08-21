import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
	try {
		// Test database connection
		await prisma.$queryRaw`SELECT 1`
		
		// Test if we can query herbs
		const herbCount = await prisma.herb.count()
		
		return NextResponse.json({
			status: 'healthy',
			timestamp: new Date().toISOString(),
			database: 'connected',
			herbCount,
			environment: process.env.NODE_ENV || 'unknown'
		})
	} catch (error) {
		console.error('Health check failed:', error)
		
		return NextResponse.json({
			status: 'unhealthy',
			timestamp: new Date().toISOString(),
			database: 'disconnected',
			error: error instanceof Error ? error.message : 'Unknown error',
			environment: process.env.NODE_ENV || 'unknown'
		}, { status: 500 })
	}
}
