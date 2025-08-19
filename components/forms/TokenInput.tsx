"use client"

import { X } from 'lucide-react'
import { useState } from 'react'

export function TokenInput({ value, onChange, placeholder }: { value?: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
	const [input, setInput] = useState('')
	const tokens = value ?? []
	function commit() {
		const parts = input
			.split(/[\s,]+/)
			.map((s) => s.trim())
			.filter(Boolean)
		if (parts.length) {
			onChange([...tokens, ...parts])
			setInput('')
		}
	}
	return (
		<div className="flex min-h-10 flex-wrap items-center gap-2 rounded-md border px-2 py-1">
			{tokens.map((t, i) => (
				<span key={i} className="flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs">
					{t}
					<button type="button" onClick={() => onChange(tokens.filter((_, j) => j !== i))} className="text-gray-500 hover:text-gray-700">
						<X className="h-3 w-3" />
					</button>
				</span>
			))}
			<input
				className="flex-1 border-0 bg-transparent px-1 py-1 text-sm outline-none"
				value={input}
				placeholder={placeholder}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ',') {
						e.preventDefault()
						commit()
					}
				}}
				onBlur={commit}
			/>
		</div>
	)
}
