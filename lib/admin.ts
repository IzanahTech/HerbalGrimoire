import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function isAdminServer(): Promise<boolean> {
	const cookieStore = await cookies()
	const adminCookie = cookieStore.get('admin-auth')
	return adminCookie?.value === 'true'
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
