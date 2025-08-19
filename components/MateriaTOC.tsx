import Link from 'next/link'

export type TocItem = { id: string; title: string }

export function MateriaTOC({
	items,
	missing,
	slug,
}: {
	items: TocItem[]
	missing?: string[]
	slug: string
}) {
	return (
		<aside className="rounded-xl border border-emerald-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
			<div className="mb-2 text-sm font-semibold text-emerald-900">Contents</div>
			<nav className="space-y-1 text-sm">
				{items.map((it) => (
					<div key={it.id}>
						<a
							href={`#${it.id}`}
							className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-gray-700 transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
						>
							<span aria-hidden className="text-base leading-none">{iconFor(it.id)}</span>
							<span className="group-hover:text-emerald-800">{it.title}</span>
						</a>
					</div>
				))}
			</nav>
			{missing && missing.length > 0 && (
				<div className="mt-4 space-y-2">
					<div className="text-xs text-gray-500">Add section</div>
					<div className="flex flex-wrap gap-2">
						{missing.map((m) => (
							<Link
								key={m}
								href={`/herbs/${slug}/edit?add=${encodeURIComponent(m)}`}
								className="rounded-full border border-emerald-200 px-2 py-0.5 text-xs text-emerald-700 hover:bg-emerald-50"
							>
								{labelFor(m)}
							</Link>
						))}
					</div>
				</div>
			)}
		</aside>
	)
}

function iconFor(id: string) {
	switch (id) {
		case 'description':
			return '📜'
		case 'uses':
			return '🌱'
		case 'dosage':
			return '⚖️'
		case 'family':
			return '🌿'
		case 'location':
			return '📍'
		case 'energetics':
			return '✨'
		case 'parts-used':
			return '🧺'
		case 'constituents':
			return '🔬'
		case 'notes-on-use':
			return '📝'
		case 'harvesting':
			return '✂️'
		case 'recipes':
			return '🍵'
		case 'contraindications':
			return '⚠️'
		default:
			return '•'
	}
}

function labelFor(id: string) {
	switch (id) {
		case 'description':
			return 'Description'
		case 'properties':
			return 'Properties'
		case 'uses':
			return 'Uses'
		case 'contraindications':
			return 'Contraindications'
		default:
			return id.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
	}
}
