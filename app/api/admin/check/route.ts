import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
	try {
		const cookieStore = await cookies()
		const adminCookie = cookieStore.get('admin-auth')
		const isAdmin = adminCookie?.value === 'true'
		
		return NextResponse.json({ 
			isAdmin,
			authenticated: !!isAdmin
		})
	} catch (error) {
		console.error('Admin check error:', error)
		return NextResponse.json({ 
			isAdmin: false,
			authenticated: false 
		})
	}
} 