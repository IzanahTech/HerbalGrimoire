"use client"

import { useEffect, useRef } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

export function SearchBar() {
	const params = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()
	const ref = useRef<HTMLInputElement>(null)

	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
				e.preventDefault()
				ref.current?.focus()
			}
		}
		document.addEventListener('keydown', onKey)
		return () => document.removeEventListener('keydown', onKey)
	}, [])

	function onChange(value: string) {
		const next = new URLSearchParams(params)
		if (value) next.set('q', value)
		else next.delete('q')
		router.replace(`${pathname}?${next.toString()}`)
	}

	return (
		<div className="relative w-full">
			<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
			<input
				ref={ref}
				type="text"
				defaultValue={params.get('q') ?? ''}
				placeholder="Search herbs... (press /)"
				className="w-full rounded-md border border-emerald-200 bg-white/70 px-9 py-2 text-sm outline-none backdrop-blur focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	)
}
