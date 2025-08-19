"use client"

export function ListEditor({ value, onChange, rows = 6 }: { value?: string[]; onChange: (v: string[]) => void; rows?: number }) {
	const text = (value ?? []).join('\n')
	return (
		<textarea
			className="w-full rounded-md border px-3 py-2 text-sm"
			rows={rows}
			value={text}
			onChange={(e) => onChange(e.currentTarget.value.split(/\r?\n/).map((s) => s.trim()).filter(Boolean))}
			placeholder="One item per line"
		/>
	)
}
