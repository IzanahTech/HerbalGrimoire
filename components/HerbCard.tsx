import Image from 'next/image'
import Link from 'next/link'

type Herb = {
	id: string
	slug: string
	name: string
	scientificName?: string | null
	description?: string | null
	properties?: string[]
	uses?: string[]
	images?: { url: string; alt?: string | null }[]
}

export function HerbCard({ herb }: { herb: Herb }) {
	const img = herb.images?.[0]
	const props = herb.properties ?? []
	const uses = herb.uses ?? []
	const chip = props[0]

	return (
		<Link
			href={`/herbs/${herb.slug}`}
			aria-label={`Open ${herb.name}`}
			className="group block overflow-hidden rounded-lg border bg-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
		>
			<div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
				{img ? (
					<Image src={img.url} alt={img.alt ?? herb.name} fill className="object-cover transition-transform duration-200 group-hover:scale-105" />
				) : (
					<div className="absolute inset-0 grid place-items-center text-gray-400">No image</div>
				)}
			</div>
			<div className="space-y-2 p-4">
				<div className="flex items-center justify-between gap-2">
					<div>
						<div className="font-medium leading-tight group-hover:text-emerald-800">{herb.name}</div>
						{herb.scientificName && (
							<div className="text-sm italic text-gray-500">{herb.scientificName}</div>
						)}
					</div>
					{chip && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 border border-emerald-200">{chip}</span>}
				</div>
				{uses.length > 0 ? (
					<div className="text-sm text-gray-600">
						Top uses: {uses.slice(0, 3).join(', ')}
					</div>
				) : (
					<div className="text-sm text-gray-400">No listed uses</div>
				)}
			</div>
		</Link>
	)
}
