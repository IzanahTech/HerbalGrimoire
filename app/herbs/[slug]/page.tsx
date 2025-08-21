import Image from 'next/image'
import Link from 'next/link'
import { MateriaTOC, TocItem } from '@/components/MateriaTOC'
import { DetailShortcuts } from '@/components/DetailShortcuts'
import { defaultSections } from '@/lib/defaultSections'
import { isAdminServer } from '@/lib/admin'
import { Leaf } from 'lucide-react'
import { prisma } from '@/lib/prisma'

async function fetchHerbDirect(slug: string) {
	try {
		const herb = await prisma.herb.findUnique({
			where: { slug },
			include: { images: { orderBy: { position: 'asc' } } }
		})

		if (!herb) return null

		// Parse JSON fields
		const result = {
			...herb,
			properties: herb.properties ? JSON.parse(herb.properties) : [],
			uses: herb.uses ? JSON.parse(herb.uses) : [],
			contraindications: herb.contraindications ? JSON.parse(herb.contraindications) : '',
			partsUsed: herb.partsUsed ? JSON.parse(herb.partsUsed) : [],
			constituents: herb.constituents ? JSON.parse(herb.constituents) : [],
			recipes: herb.recipes ? JSON.parse(herb.recipes) : [],
			customSections: herb.customSections ? JSON.parse(herb.customSections) : {}
		}

		return result
	} catch (error) {
		console.error('Error fetching herb directly:', error)
		return null
	}
}

export default async function HerbReadPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const herb = await fetchHerbDirect(slug)
	if (!herb) return <div className="text-center text-gray-500">Not found</div>
	const isAdmin = await isAdminServer()

	const primary = herb.images?.find((i: { isPrimary: boolean }) => i.isPrimary) ?? herb.images?.[0]

	// Always include all sections in a fixed order
	type KeyValueItem = { key: string; value?: string | null }
	type SectionValue = string | string[] | KeyValueItem[]
	const toVal = (id: string): SectionValue | undefined => (Array.isArray(herb.customSections) ? (herb.customSections as Array<{ id: string; value: SectionValue }>).find((s) => s.id === id)?.value : (herb.customSections as Record<string, SectionValue> | undefined)?.[id])
	const orderedSections: { id: string; title: string; value: SectionValue }[] = [
		{ id: 'description', title: 'Description', value: herb.description ?? '' },
		{ id: 'uses', title: 'Uses', value: Array.isArray(herb.uses) ? herb.uses : [] },
		...defaultSections.map((d) => ({ id: d.id, title: d.title, value: toVal(d.id) ?? (d.id === 'partsUsed' || d.id === 'constituents' || d.id === 'recipes' ? [] : '') })),
		{ id: 'contraindications', title: 'Contraindications', value: Array.isArray(herb.contraindications) ? herb.contraindications : [] },
	]

	const toc: TocItem[] = orderedSections.map((s) => ({ id: s.id, title: s.title }))

	return (
		<div className="space-y-4">
			<DetailShortcuts slug={herb.slug} />
			<div className="flex flex-col gap-4 md:flex-row">
				<div className="md:w-2/3">
					{primary ? (
						<div className="relative h-64 w-full rounded-xl border border-gray-200 shadow-sm sm:h-80 md:h-96 overflow-hidden">
							<Image src={primary.url} alt={primary.alt ?? herb.name} fill className="object-cover object-center" sizes="(min-width: 768px) 66vw, 100vw" />
						</div>
					) : (
						<div className="grid h-64 w-full place-items-center rounded-xl border border-gray-200 text-gray-400 sm:h-80 md:h-96">No image</div>
					)}
				</div>
				<div className="md:w-1/3">
					<MateriaTOC items={toc} slug={herb.slug} />
				</div>
			</div>

			<header className="flex items-end justify-between gap-4">
				<h1 className="text-2xl font-semibold leading-tight">{herb.name}</h1>
				{herb.scientificName ? (
					<div className="italic text-gray-600">{herb.scientificName}</div>
				) : (
					<div className="italic text-gray-400">Scientific name — not provided</div>
				)}
				{isAdmin && (
					<div className="ml-auto">
						<Link href={`/herbs/${herb.slug}/edit`} className="rounded-md border border-emerald-300 bg-white px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-100">Edit</Link>
					</div>
				)}
			</header>

			{orderedSections.map((sec) => (
				<section id={sec.id} key={sec.id} className="scroll-mt-24">
					<div className="group overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/60 shadow-sm backdrop-blur-sm transition hover:shadow-md">
						<div className="rounded-lg bg-emerald-100/70 p-5 md:p-6">
							<div className="mb-4 flex items-center gap-2">
								<Leaf className="h-5 w-5 text-emerald-600" aria-hidden />
								<h2 className="text-xl font-bold text-emerald-900 border-l-4 border-emerald-500 pl-2">{sec.title}</h2>
							</div>
							{Array.isArray(sec.value) ? (
								sec.value.length > 0 ? (
									<ul className="list-inside list-disc space-y-1 pl-4 text-gray-700 marker:text-emerald-500 md:columns-2 md:[&>li]:break-inside-avoid">
										{(sec.value as Array<string | { key: string; value?: string | null }>).map((v, i) => (
											<li key={i}>{typeof v === 'string' ? v : `${v.key}: ${v.value ?? ''}`}</li>
										))}
									</ul>
								) : (
									<div className="rounded-md border border-dashed border-emerald-300 bg-emerald-50 p-4 text-sm italic text-gray-600">Not provided</div>
								)
							) : sec.value && String(sec.value).trim().length > 0 ? (
								<div className="prose prose-slate max-w-none text-gray-800">{String(sec.value)}</div>
							) : (
								<div className="rounded-md border border-dashed border-emerald-300 bg-emerald-50 p-4 text-sm italic text-gray-600">Not provided</div>
							)}
						</div>
					</div>
				</section>
			))}

			
		</div>
	)
}
