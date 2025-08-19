import { HerbForm } from '@/components/forms/HerbForm'
import { ImageUploader } from '@/components/ImageUploader'
import { CustomSectionsPanel } from '@/components/CustomSectionsPanel'
import { DefaultSectionsEditor } from '@/components/DefaultSectionsEditor'
import { isAdminServer } from '@/lib/admin'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { CreateHerb } from '@/lib/zod/herb'

async function fetchHerb(slug: string) {
	// Get the host from headers for server-side rendering
	const headersList = await headers()
	const host = headersList.get('host') || 'localhost:3000'
	const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
	const baseUrl = `${protocol}://${host}`

	const res = await fetch(`${baseUrl}/api/herbs/${slug}`, { cache: 'no-store' })
	if (!res.ok) throw new Error('Failed to load')
	const json = await res.json()
	return json.data
}

export default async function EditHerbPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	if (!(await isAdminServer())) notFound()

	const herb = await fetchHerb(slug)
	if (!herb) notFound()

	// Transform herb data to match CreateHerb type
	const initialData: Partial<CreateHerb> = {
		slug: herb.slug,
		name: herb.name,
		scientificName: herb.scientificName || '',
		description: herb.description || '',
		properties: herb.properties || [],
		uses: herb.uses || [],
		contraindications: herb.contraindications || '',
		family: herb.family || '',
		location: herb.location || '',
		energetics: herb.energetics || '',
		partsUsed: herb.partsUsed || [],
		constituents: herb.constituents || [],
		dosage: herb.dosage || '',
		notesOnUse: herb.notesOnUse || '',
		harvesting: herb.harvesting || '',
		recipes: herb.recipes || [],
		customSections: herb.customSections || {}
	}

	const handleSubmit = async (data: CreateHerb) => {
		'use server'
		
		try {
			const response = await fetch(`/api/herbs/${slug}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})

			if (!response.ok) {
				throw new Error('Failed to update herb')
			}

			// Redirect to the herb page
			window.location.href = `/herbs/${slug}`
		} catch (error) {
			console.error('Error updating herb:', error)
			throw error
		}
	}

	// Prepare custom sections data for the components
	const customSections = Array.isArray(herb.customSections) 
		? herb.customSections 
		: []

	return (
		<div className="mx-auto max-w-4xl space-y-8 p-6">
			<div className="space-y-2">
				<h1 className="text-3xl font-bold">Edit {herb.name}</h1>
				<p className="text-gray-600">Update the herb information and properties.</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-6">
					<HerbForm
						initialData={initialData}
						onSubmit={handleSubmit}
						submitLabel="Save Changes"
					/>
					{Array.isArray(herb.images) && <ImageUploader slug={herb.slug} initial={herb.images} />}
				</div>

				<div className="space-y-6">
					<DefaultSectionsEditor slug={herb.slug} initial={customSections} />
					<CustomSectionsPanel slug={herb.slug} initial={customSections} />
				</div>
			</div>
		</div>
	)
}
