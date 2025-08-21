import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { deleteImage } from '@/lib/blob'

function ok(data: unknown) {
	return NextResponse.json({ ok: true, data })
}

function badRequest(message: string, status = 400) {
	return NextResponse.json({ ok: false, error: message }, { status })
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ slug: string; id: string }> }) {
	try {
		const { id } = await params
		
		// Check admin authentication using new session system
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
		
		if (!isAdmin) {
			return badRequest('Unauthorized: Admin session required', 401)
		}
		
		const image = await prisma.image.findUnique({ where: { id } })
		if (!image) return badRequest('Not found', 404)
		
		try {
			// Delete from Vercel Blob (production) or local storage (development)
			await deleteImage(image.url)
			
			// Delete from database
			await prisma.image.delete({ where: { id: image.id } })
			return ok({ deleted: true })
		} catch (e: unknown) {
			const error = e as Error
			return badRequest(error.message || 'Failed to delete')
		}
	} catch (error) {
		console.error('Error in DELETE image:', error)
		return badRequest('Internal server error')
	}
}

const PatchBodySchema = z.object({ alt: z.string().optional().nullable() })

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string; id: string }> }
) {
	try {
		const { slug, id } = await params
		
		// Check admin authentication using new session system
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
		
		if (!isAdmin) {
			return badRequest('Unauthorized: Admin session required', 401)
		}

		let body: unknown
		try {
			body = await request.json()
		} catch {
			return badRequest('Invalid JSON')
		}
		const parsed = PatchBodySchema.safeParse(body)
		if (!parsed.success) return badRequest('Invalid body')
		const { alt } = parsed.data
		const updated = await prisma.image.update({ where: { id }, data: { alt: alt ?? null } })
		return ok(updated)
	} catch (e: unknown) {
		const error = e as Error
		return badRequest(error.message || 'Failed to update')
	}
}
