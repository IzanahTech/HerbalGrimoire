import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
	try {
		// Test 1: Basic connection
		console.log('Testing database connection...')
		await prisma.$connect()
		console.log('✓ Database connected')
		
		// Test 2: Simple query
		console.log('Testing basic query...')
		const result = await prisma.$queryRaw`SELECT 1 as test, NOW() as timestamp`
		console.log('✓ Basic query successful:', result)
		
		// Test 3: Check if herbs table exists
		console.log('Testing herbs table access...')
		const herbCount = await prisma.herb.count()
		console.log(`✓ Herbs table accessible, count: ${herbCount}`)
		
		// Test 4: Check environment
		const env = {
			NODE_ENV: process.env.NODE_ENV || 'not set',
			DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'not set',
			VERCEL_URL: process.env.VERCEL_URL || 'not set'
		}
		console.log('Environment variables:', env)
		
		return NextResponse.json({
			status: 'success',
			tests: {
				connection: 'passed',
				basicQuery: 'passed',
				herbsTable: 'passed',
				herbCount
			},
			environment: env,
			timestamp: new Date().toISOString()
		})
		
	} catch (error) {
		console.error('Database test failed:', error)
		
		const errorInfo = {
			message: error instanceof Error ? error.message : 'Unknown error',
			name: error instanceof Error ? error.name : 'Unknown',
			stack: error instanceof Error ? error.stack : undefined,
			code: (error as any)?.code,
			environment: {
				NODE_ENV: process.env.NODE_ENV || 'not set',
				DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'not set',
				VERCEL_URL: process.env.VERCEL_URL || 'not set'
			}
		}
		
		return NextResponse.json({
			status: 'failed',
			error: errorInfo,
			timestamp: new Date().toISOString()
		}, { status: 500 })
		
	} finally {
		try {
			await prisma.$disconnect()
		} catch (disconnectError) {
			console.error('Error disconnecting:', disconnectError)
		}
	}
}
