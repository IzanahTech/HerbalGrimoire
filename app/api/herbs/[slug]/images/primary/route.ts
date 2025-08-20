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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	if ((await cookies()).get('admin-auth')?.value !== 'true') return badRequest('Unauthorized', 401)
	const herb = await prisma.herb.findUnique({ where: { slug } })
	if (!herb) return badRequest('Herb not found', 404)
	let body: unknown
	try {
		body = await req.json()
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
}
