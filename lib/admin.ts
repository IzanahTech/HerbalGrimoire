import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function isAdminServer(): Promise<boolean> {
	const cookieStore = await cookies()
	const sessionCookie = cookieStore.get('admin-session')
	const expiryCookie = cookieStore.get('admin-expiry')
	
	if (!sessionCookie?.value || !expiryCookie?.value) {
		return false
	}
	
	// Check if session has expired
	try {
		const expiry = new Date(expiryCookie.value)
		if (expiry < new Date()) {
			return false
		}
	} catch {
		return false
	}
	
	// Session is valid
	return true
}

export async function requireAdmin() {
	if (!(await isAdminServer())) {
		redirect('/admin/login')
	}
}

export async function isAdminClient(): Promise<boolean> {
	try {
		const response = await fetch('/api/admin/check', {
			method: 'GET',
			credentials: 'include'
		})
		return response.ok
	} catch {
		return false
	}
}
