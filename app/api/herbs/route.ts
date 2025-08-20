import { NextRequest, NextResponse } from 'next/server'
import { CreateHerbSchema, ListHerbSchema } from '@/lib/zod/herb'
import { toSlug } from '@/lib/slug'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

function ok(data: unknown) {
	return NextResponse.json({ ok: true, data })
}

function badRequest(message: string) {
	return NextResponse.json({ ok: false, error: message }, { status: 400 })
}

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url)
		const q = searchParams.get('q')?.toLowerCase() || undefined
		const letter = searchParams.get('letter')?.toLowerCase() || undefined

		const where: any = {}
		if (q) {
			where.OR = [
				{ name: { contains: q } },
				{ scientificName: { contains: q } },
				{ description: { contains: q } },
			]
		}
		if (letter) {
			where.name = { startsWith: letter }
		}

		const herbs = await prisma.herb.findMany({
			where,
			orderBy: { name: 'asc' },
			include: { images: { orderBy: { position: 'asc' } } },
		})

		const result = herbs.map((h: any) => ({
			id: h.id,
			slug: h.slug,
			name: h.name,
			scientificName: h.scientificName ?? undefined,
			properties: h.properties ? JSON.parse(h.properties) : [],
			uses: h.uses ? JSON.parse(h.uses) : [],
			customSections: h.customSections ? JSON.parse(h.customSections) : [],
			images: h.images.map((img: any) => ({
				id: img.id,
				url: img.url,
				alt: img.alt ?? undefined,
				herbId: img.herbId,
				position: img.position,
				isPrimary: img.isPrimary,
				createdAt: img.createdAt.toISOString()
			}))
		}))

		// Validate the result with Zod
		const validatedResult = result.map((herb: any) => ListHerbSchema.parse(herb))
		
		return ok(validatedResult)
	} catch (error) {
		console.error('Error fetching herbs:', error)
		return NextResponse.json(
			{ ok: false, error: 'Failed to fetch herbs' },
			{ status: 500 }
		)
	}
}

export async function POST(req: NextRequest) {
	try {
		// Check admin authentication
		const cookieStore = await cookies()
		const adminCookie = cookieStore.get('admin-auth')
		if (adminCookie?.value !== 'true') {
			return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
		}

		let json: unknown
		try {
			json = await req.json()
		} catch {
			return badRequest('Invalid JSON')
		}

		// Validate with new schema
		const parse = CreateHerbSchema.safeParse(json)
		if (!parse.success) {
			return badRequest(parse.error.message)
		}
		const data = parse.data

		const slug = (data.slug && toSlug(data.slug)) || toSlug(data.name)

		try {
			const created = await prisma.herb.create({
				data: {
					slug,
					name: data.name,
					scientificName: data.scientificName ?? null,
					description: data.description ?? null,
					properties: JSON.stringify(data.properties ?? []),
					uses: JSON.stringify(data.uses ?? []),
					contraindications: data.contraindications ?? null,
					// Default sections
					family: data.family ?? null,
					location: data.location ?? null,
					energetics: data.energetics ?? null,
					partsUsed: JSON.stringify(data.partsUsed ?? []),
					constituents: JSON.stringify(data.constituents ?? []),
					dosage: data.dosage ?? null,
					notesOnUse: data.notesOnUse ?? null,
					harvesting: data.harvesting ?? null,
					recipes: JSON.stringify(data.recipes ?? []),
					customSections: JSON.stringify(data.customSections ?? {}),
				},
			})

			return ok(created)
		} catch (dbError) {
			console.error('Database error:', dbError)
			return badRequest('Failed to create herb')
		}
	} catch (error) {
		console.error('Error in POST /api/herbs:', error)
		return NextResponse.json(
			{ ok: false, error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
