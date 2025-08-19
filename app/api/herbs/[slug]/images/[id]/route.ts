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
	const { id } = await params
	if ((await cookies()).get('admin-auth')?.value !== 'true') return badRequest('Unauthorized', 401)
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
}

const PatchBodySchema = z.object({ alt: z.string().optional().nullable() })

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string; id: string }> }) {
	const { id } = await params
	if ((await cookies()).get('admin-auth')?.value !== 'true') return badRequest('Unauthorized', 401)
	let body: unknown
	try {
		body = await req.json()
	} catch {
		return badRequest('Invalid JSON')
	}
	const parsed = PatchBodySchema.safeParse(body)
	if (!parsed.success) return badRequest('Invalid body')
	const { alt } = parsed.data
	const updated = await prisma.image.update({ where: { id }, data: { alt: alt ?? null } })
	return ok(updated)
}
