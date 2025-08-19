import { NextRequest, NextResponse } from 'next/server'
import { UpdateHerbSchema } from '@/lib/zod/herb'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params
		const herb = await prisma.herb.findUnique({
			where: { slug },
			include: { images: { orderBy: { position: 'asc' } } }
		})

		if (!herb) {
			return NextResponse.json({ error: 'Herb not found' }, { status: 404 })
		}

		const result = {
			...herb,
			properties: herb.properties ? JSON.parse(herb.properties) : [],
			uses: herb.uses ? JSON.parse(herb.uses) : [],
			contraindications: herb.contraindications ? herb.contraindications : '',
			partsUsed: herb.partsUsed ? JSON.parse(herb.partsUsed) : [],
			constituents: herb.constituents ? JSON.parse(herb.constituents) : [],
			recipes: herb.recipes ? JSON.parse(herb.recipes) : [],
			customSections: herb.customSections ? JSON.parse(herb.customSections) : {}
		}

		return NextResponse.json({ ok: true, data: result })
	} catch (error) {
		console.error('Error fetching herb:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch herb' },
			{ status: 500 }
		)
	}
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params
		
		// Check admin authentication
		const cookieStore = await cookies()
		const adminCookie = cookieStore.get('admin-auth')
		if (adminCookie?.value !== 'true') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const herb = await prisma.herb.findUnique({ where: { slug } })
		if (!herb) {
			return NextResponse.json({ error: 'Herb not found' }, { status: 404 })
		}

		let json: unknown
		try {
			json = await request.json()
		} catch {
			return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
		}

		// Validate with new schema
		const parse = UpdateHerbSchema.safeParse(json)
		if (!parse.success) {
			return NextResponse.json({ error: parse.error.message }, { status: 400 })
		}
		const data = parse.data

		const updateData: Record<string, unknown> = {}
		if (data.name) updateData.name = data.name
		if (data.scientificName !== undefined) updateData.scientificName = data.scientificName
		if (data.description !== undefined) updateData.description = data.description
		if (data.properties) updateData.properties = JSON.stringify(data.properties)
		if (data.uses) updateData.uses = JSON.stringify(data.uses)
		if (data.contraindications !== undefined) updateData.contraindications = data.contraindications
		if (data.family !== undefined) updateData.family = data.family
		if (data.location !== undefined) updateData.location = data.location
		if (data.energetics !== undefined) updateData.energetics = data.energetics
		if (data.partsUsed) updateData.partsUsed = JSON.stringify(data.partsUsed)
		if (data.constituents) updateData.constituents = JSON.stringify(data.constituents)
		if (data.dosage !== undefined) updateData.dosage = data.dosage
		if (data.notesOnUse !== undefined) updateData.notesOnUse = data.notesOnUse
		if (data.harvesting !== undefined) updateData.harvesting = data.harvesting
		if (data.recipes) updateData.recipes = JSON.stringify(data.recipes)
		if (data.customSections) updateData.customSections = JSON.stringify(data.customSections)

		const updated = await prisma.herb.update({
			where: { slug },
			data: updateData
		})

		return NextResponse.json({ ok: true, data: updated })
	} catch (error) {
		console.error('Error updating herb:', error)
		return NextResponse.json(
			{ error: 'Failed to update herb' },
			{ status: 500 }
		)
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params
		
		// Check admin authentication
		const cookieStore = await cookies()
		const adminCookie = cookieStore.get('admin-auth')
		if (adminCookie?.value !== 'true') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const herb = await prisma.herb.findUnique({ where: { slug } })
		if (!herb) {
			return NextResponse.json({ error: 'Herb not found' }, { status: 404 })
		}

		await prisma.herb.delete({ where: { slug } })

		return NextResponse.json({ ok: true })
	} catch (error) {
		console.error('Error deleting herb:', error)
		return NextResponse.json(
			{ error: 'Failed to delete herb' },
			{ status: 500 }
		)
	}
}
