export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { uploadImage, generateFilename } from '@/lib/blob'

// File signature verification (magic bytes)
const FILE_SIGNATURES = {
	'image/jpeg': [
		[0xFF, 0xD8, 0xFF], // JPEG
	],
	'image/png': [
		[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], // PNG
	],
	'image/webp': [
		[0x52, 0x49, 0x46, 0x46], // WebP (RIFF header)
	]
}

function verifyFileSignature(buffer: Buffer, mimeType: string): boolean {
	const signatures = FILE_SIGNATURES[mimeType as keyof typeof FILE_SIGNATURES]
	if (!signatures) return false
	
	return signatures.some(signature => {
		if (buffer.length < signature.length) return false
		return signature.every((byte, index) => buffer[index] === byte)
	})
}

// File validation schema
const imageUploadSchema = z.object({
	file: z.instanceof(File).refine(
		(file) => file.size <= 5 * 1024 * 1024, // 5MB limit
		'File size must be less than 5MB'
	).refine(
		(file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
		'Only JPEG, PNG, and WebP images are allowed'
	),
	alt: z.string().max(200).optional()
})

// Allowed file types and their extensions
const ALLOWED_TYPES = {
	'image/jpeg': '.jpg',
	'image/jpg': '.jpg',
	'image/png': '.png',
	'image/webp': '.webp'
}

function ok(data: unknown) {
	return NextResponse.json({ ok: true, data })
}

function badRequest(message: string, status = 400) {
	return NextResponse.json({ ok: false, error: message }, { status })
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params
		
		// Check admin authentication
		const cookieStore = await cookies()
		const adminCookie = cookieStore.get('admin-auth')
		if (adminCookie?.value !== 'true') {
			return badRequest('Unauthorized', 401)
		}

		// Validate herb exists
		const herb = await prisma.herb.findUnique({
			where: { slug }
		})

		if (!herb) {
			return badRequest('Herb not found', 404)
		}

		// Parse form data
		const formData = await request.formData()
		const files = formData.getAll('files').filter(Boolean) as File[]
		const single = formData.get('file') as File | null
		const alt = formData.get('alt') as string | null

		const toProcess: { file: File; alt?: string }[] = []
		if (files.length) {
			for (const f of files) toProcess.push({ file: f, alt: alt ?? undefined })
		} else if (single) {
			toProcess.push({ file: single, alt: alt ?? undefined })
		} else {
			return badRequest('No files provided')
		}

		// Validate inputs
		for (const item of toProcess) {
			const parsed = imageUploadSchema.safeParse({ file: item.file, alt: item.alt })
			if (!parsed.success) {
				return NextResponse.json(
					{ ok: false, error: 'Invalid file data', details: parsed.error.issues },
					{ status: 400 }
				)
			}
		}

		// Determine starting position
		const existingCount = await prisma.image.count({ where: { herbId: herb.id } })
		let position = existingCount

		const createdImages = [] as Array<{ id: string; url: string; alt: string | null; herbId: string; position: number; isPrimary: boolean }>

		for (const item of toProcess) {
			const f = item.file
			
			// Read file buffer for signature verification
			const bytes = await f.arrayBuffer()
			const buffer = Buffer.from(bytes)
			
			// Verify file signature matches MIME type
			if (!verifyFileSignature(buffer, f.type)) {
				return badRequest(`File signature verification failed for ${f.name}. File may be corrupted or spoofed.`)
			}
			
			// Generate unique filename
			const filename = generateFilename(f.name, herb.slug)
			
			// Upload to Vercel Blob (production) or local storage (development)
			const uploadResult = await uploadImage(f, filename, item.alt)

			const image = await prisma.image.create({
				data: {
					url: uploadResult.url,
					alt: item.alt || '',
					herbId: herb.id,
					position,
					isPrimary: position === 0 && existingCount === 0,
				},
			})
			position++
			createdImages.push(image)
		}

		return ok(createdImages)

	} catch (error) {
		console.error('Image upload error:', error)
		return NextResponse.json(
			{ ok: false, error: 'Failed to upload image' },
			{ status: 500 }
		)
	}
}
