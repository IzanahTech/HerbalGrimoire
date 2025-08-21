import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
	try {
		const cookieStore = await cookies()
		const sessionCookie = cookieStore.get('admin-session')
		const expiryCookie = cookieStore.get('admin-expiry')
		
		let isAdmin = false
		if (sessionCookie?.value && expiryCookie?.value) {
			try {
				const expiry = new Date(expiryCookie.value)
				isAdmin = expiry > new Date()
			} catch {
				isAdmin = false
			}
		}
		
		return NextResponse.json({ 
			isAdmin,
			authenticated: !!isAdmin
		})
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Admin check error:', error)
		}
		return NextResponse.json({ 
			isAdmin: false,
			authenticated: false 
		})
	}
} 