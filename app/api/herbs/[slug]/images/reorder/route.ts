import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

function ok(data: unknown) {
	return NextResponse.json({ ok: true, data })
}

function badRequest(message: string, status = 400) {
	return NextResponse.json({ ok: false, error: message }, { status })
}

const BodySchema = z.object({
	order: z.array(z.string()),
	setPrimaryFromFirst: z.boolean().optional()
})

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
	if (!parsed.success) return badRequest('Order must be an array of image IDs')
	const { order, setPrimaryFromFirst } = parsed.data

	await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
		for (let i = 0; i < order.length; i++) {
			await tx.image.update({ where: { id: order[i], herbId: herb.id }, data: { position: i } })
		}
		if (setPrimaryFromFirst) {
			await tx.image.updateMany({ where: { herbId: herb.id }, data: { isPrimary: false } })
			await tx.image.update({ where: { id: order[0] }, data: { isPrimary: true } })
		}
	})

	return ok({ reordered: true })
}
