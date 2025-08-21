import { AlphabetBar } from '@/components/AlphabetBar'
import { HerbCard } from '@/components/HerbCard'
import { SearchBar } from '@/components/SearchBar'
import Link from 'next/link'
import { isAdminServer } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

const RANGE_MAP: Record<string, string[]> = {
	'a-e': ['a', 'b', 'c', 'd', 'e'],
	'f-j': ['f', 'g', 'h', 'i', 'j'],
	'k-o': ['k', 'l', 'm', 'n', 'o'],
	'p-t': ['p', 'q', 'r', 's', 't'],
	'u-z': ['u', 'v', 'w', 'x', 'y', 'z'],
}

type ListHerb = {
	id: string
	slug: string
	name: string
	scientificName?: string | null
	properties?: string[]
	uses?: string[]
	images?: Array<{ id: string; url: string; alt?: string | null; isPrimary: boolean }>
}

async function fetchHerbsDirect(q?: string | null, letter?: string | null): Promise<ListHerb[]> {
	try {
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

		return herbs.map((h: any) => ({
			id: h.id,
			slug: h.slug,
			name: h.name,
			scientificName: h.scientificName ?? undefined,
			properties: h.properties ? JSON.parse(h.properties) : [],
			uses: h.uses ? JSON.parse(h.uses) : [],
			images: h.images.map((img: any) => ({
				id: img.id,
				url: img.url,
				alt: img.alt ?? undefined,
				isPrimary: img.isPrimary,
			}))
		}))
	} catch (error) {
		console.error('Error fetching herbs directly:', error)
		throw new Error('Failed to load herbs from database')
	}
}

export default async function HomePage({ searchParams }: { searchParams?: Promise<{ q?: string; letter?: string; range?: string }> }) {
	const params = await searchParams
	const q = params?.q ?? null
	const range = params?.range ?? null
	let letters: string[] | null = null
	if (range && RANGE_MAP[range]) letters = RANGE_MAP[range]

	let herbs: ListHerb[] = []
	if (letters) {
		const results = await Promise.all(letters.map((l) => fetchHerbsDirect(q, l)))
		herbs = results.flat()
		// de-duplicate by id
		herbs = Array.from(new Map(herbs.map((h) => [h.id, h])).values())
		// ensure order by name
		herbs.sort((a, b) => a.name.localeCompare(b.name))
	} else {
		herbs = await fetchHerbsDirect(q, params?.letter ?? null)
	}

	const isAdmin = await isAdminServer()

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<AlphabetBar currentRange={range ?? undefined} q={q ?? undefined} />
				<div className="flex items-center gap-3 sm:min-w-[320px] sm:max-w-sm">
					<div className="flex-1"><SearchBar /></div>
					{isAdmin && (
						<Link
							href="/herbs/new"
							className="inline-flex items-center gap-2 rounded-xl border border-green-500 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 shadow-sm transition-all duration-200 hover:bg-green-500 hover:text-white hover:shadow-md active:scale-95"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2}
								stroke="currentColor"
								className="h-4 w-4"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 4.5v15m7.5-7.5h-15"
								/>
							</svg>
							Add Herb
						</Link>
					)}
				</div>
			</div>

			{herbs.length === 0 ? (
				<div className="rounded-lg border p-8 text-center text-gray-500">No herbs found. Try adjusting your search or range filter.</div>
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{herbs.map((h) => (
						<HerbCard
							key={h.id}
							herb={{
								id: h.id,
								slug: h.slug,
								name: h.name,
								scientificName: h.scientificName ?? null,
								properties: Array.isArray(h.properties) ? h.properties : [],
								uses: Array.isArray(h.uses) ? h.uses : [],
								images: Array.isArray(h.images) ? h.images : [],
							}}
						/>
					))}
				</div>
			)}
		</div>
	)
}
