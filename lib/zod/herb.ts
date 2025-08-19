import { z } from 'zod'

// Sanitize and validate text inputs
const sanitizeText = (text: string) => text.trim().replace(/[<>]/g, '')

const textField = z.string()
	.min(1, 'This field is required')
	.max(1000, 'Text too long (max 1000 characters)')
	.transform(sanitizeText)

const shortTextField = z.string()
	.min(1, 'This field is required')
	.max(200, 'Text too long (max 200 characters)')
	.transform(sanitizeText)

const slugField = z.string()
	.min(1, 'Slug is required')
	.max(100, 'Slug too long (max 100 characters)')
	.regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
	.transform(sanitizeText)

const arrayField = z.array(z.string().max(100).transform(sanitizeText))
	.max(20, 'Too many items (max 20)')
	.optional()

export const HerbSchema = z.object({
	id: z.string().cuid().optional(),
	slug: slugField,
	name: shortTextField,
	scientificName: shortTextField.optional(),
	description: textField.optional(),
	properties: arrayField,
	uses: arrayField,
	contraindications: textField.optional(),
	family: shortTextField.optional(),
	location: shortTextField.optional(),
	energetics: shortTextField.optional(),
	partsUsed: arrayField,
	constituents: arrayField,
	dosage: textField.optional(),
	notesOnUse: textField.optional(),
	harvesting: textField.optional(),
	recipes: arrayField,
	customSections: z.record(z.string(), z.any()).optional()
})

export const CreateHerbSchema = HerbSchema.omit({ id: true })
export const UpdateHerbSchema = HerbSchema.partial().extend({ id: z.string().cuid() })

export type Herb = z.infer<typeof HerbSchema>
export type CreateHerb = z.infer<typeof CreateHerbSchema>
export type UpdateHerb = z.infer<typeof UpdateHerbSchema>

// List herb type for search results
export const ListHerbSchema = z.object({
	id: z.string().cuid(),
	slug: slugField,
	name: shortTextField,
	scientificName: shortTextField.optional(),
	properties: arrayField,
	uses: arrayField,
	customSections: z.union([
		z.array(z.any()),
		z.record(z.string(), z.any())
	]).optional(),
	images: z.array(z.object({
		id: z.string().cuid(),
		url: z.string().refine(
			(url) => {
				// Allow both valid URLs and local file paths
				if (url.startsWith('/uploads/') || url.startsWith('http')) {
					return true
				}
				return false
			},
			'URL must be either a valid HTTP/HTTPS URL or a local upload path'
		),
		alt: z.string().max(200).optional(),
		herbId: z.string().cuid(),
		position: z.number().int().min(0),
		isPrimary: z.boolean(),
		createdAt: z.string().datetime()
	})).optional()
})

export type ListHerb = z.infer<typeof ListHerbSchema>
