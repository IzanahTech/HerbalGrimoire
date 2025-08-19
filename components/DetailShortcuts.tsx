"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function DetailShortcuts({ slug }: { slug: string }) {
	const router = useRouter()
	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.defaultPrevented) return
			const target = e.target as HTMLElement | null
			if (target && /^(input|textarea|select)$/i.test(target.tagName)) return
			if (e.key === 'e' && !e.metaKey && !e.ctrlKey && !e.altKey) {
				e.preventDefault()
				router.push(`/herbs/${slug}/edit`)
			}
			if ((e.key === 'Delete' || e.key === 'Backspace') && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				if (confirm('Delete this herb?')) {
					fetch(`/api/herbs/${slug}`, { method: 'DELETE' }).then(() => router.push('/'))
				}
			}
		}
		document.addEventListener('keydown', onKey)
		return () => document.removeEventListener('keydown', onKey)
	}, [router, slug])
	return null
}
