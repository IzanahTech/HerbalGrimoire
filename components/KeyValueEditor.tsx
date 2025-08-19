"use client"

import { useState } from 'react'

export type KV = { key: string; value?: string | null }

export function KeyValueEditor({ value, onChange }: { value?: KV[]; onChange: (v: KV[]) => void }) {
	const [rows, setRows] = useState<KV[]>(value ?? [])
	function set(i: number, next: Partial<KV>) {
		const copy = [...rows]
		copy[i] = { ...copy[i], ...next }
		setRows(copy)
		onChange(copy)
	}
	return (
		<div className="space-y-2">
			{rows.map((r, i) => (
				<div key={i} className="flex gap-2">
					<input className="w-40 rounded-md border px-2 py-1 text-sm" placeholder="Key" value={r.key} onChange={(e) => set(i, { key: e.currentTarget.value })} />
					<input className="flex-1 rounded-md border px-2 py-1 text-sm" placeholder="Value" value={r.value ?? ''} onChange={(e) => set(i, { value: e.currentTarget.value })} />
					<button type="button" className="text-xs text-red-600" onClick={() => { const copy = rows.filter((_, j) => j !== i); setRows(copy); onChange(copy) }}>Remove</button>
				</div>
			))}
			<button type="button" className="text-xs text-blue-600" onClick={() => { const copy = [...rows, { key: '', value: '' }]; setRows(copy); onChange(copy) }}>Add Row</button>
		</div>
	)
}
