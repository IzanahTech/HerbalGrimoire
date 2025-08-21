import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

function ok(data: unknown) {
	return NextResponse.json({ ok: true, data })
}

function badRequest(message: string, status = 400) {
	return NextResponse.json({ ok: false, error: message }, { status })
}

const BodySchema = z.object({ imageId: z.string() })

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params
		
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

		const herb = await prisma.herb.findUnique({ where: { slug } })
		if (!herb) return badRequest('Herb not found', 404)
		let body: unknown
		try {
			body = await request.json()
		} catch {
			return badRequest('Invalid JSON')
		}

		const parsed = BodySchema.safeParse(body)
		if (!parsed.success) return badRequest('imageId required')
		const { imageId } = parsed.data

		await prisma.$transaction(async (tx: any) => {
			await tx.image.updateMany({ where: { herbId: herb.id }, data: { isPrimary: false } })
			await tx.image.update({ where: { id: imageId }, data: { isPrimary: true } })
		})

		return ok({ primarySet: true })
	} catch (error) {
		console.error('Error setting primary image:', error)
		return badRequest('Internal server error')
	}
}
