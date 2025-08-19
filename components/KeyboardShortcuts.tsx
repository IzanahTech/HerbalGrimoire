"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function KeyboardShortcuts() {
	const router = useRouter()
	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.defaultPrevented) return
			if (e.target && (e.target as HTMLElement).tagName?.match(/input|textarea|select/i)) return
			if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !e.altKey) {
				e.preventDefault()
				router.push('/herbs/new')
			}
		}
		document.addEventListener('keydown', onKey)
		return () => document.removeEventListener('keydown', onKey)
	}, [router])
	return null
}
