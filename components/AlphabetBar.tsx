import Link from 'next/link'
import { cn } from '@/lib/utils'

const GROUPS = [
	{ id: 'a-e', label: 'A–E', letters: ['a', 'b', 'c', 'd', 'e'] },
	{ id: 'f-j', label: 'F–J', letters: ['f', 'g', 'h', 'i', 'j'] },
	{ id: 'k-o', label: 'K–O', letters: ['k', 'l', 'm', 'n', 'o'] },
	{ id: 'p-t', label: 'P–T', letters: ['p', 'q', 'r', 's', 't'] },
	{ id: 'u-z', label: 'U–Z', letters: ['u', 'v', 'w', 'x', 'y', 'z'] },
]

export function AlphabetBar({ currentRange, q }: { currentRange?: string | null; q?: string | null }) {
	const queryFor = (range?: string) => {
		const params = new URLSearchParams()
		if (q) params.set('q', q)
		if (range) params.set('range', range)
		return params.size ? `/?${params.toString()}` : '/'
	}

	return (
		<nav className="flex flex-wrap items-center gap-2" aria-label="Letter ranges">
			<Link
				href={queryFor(undefined)}
				className={cn(
					'rounded-full border px-3 py-1 text-xs transition-colors',
					!currentRange ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-100'
				)}
			>
				All
			</Link>
			{GROUPS.map((g) => {
				const active = currentRange === g.id
				return (
					<Link
						key={g.id}
						href={queryFor(g.id)}
						className={cn(
							'rounded-full border px-3 py-1 text-xs transition-colors',
							active ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-100'
						)}
					>
						{g.label}
					</Link>
				)
			})}
		</nav>
	)
}
