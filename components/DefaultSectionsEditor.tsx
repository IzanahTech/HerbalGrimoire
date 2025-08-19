"use client"

import { useMemo, useState } from 'react'
import { defaultSections } from '@/lib/defaultSections'
import { ListEditor } from '@/components/ListEditor'

const listIds = new Set(['partsUsed', 'constituents', 'recipes'])

type KeyValueItem = { key: string; value?: string | null }
type CustomSectionValue = string | string[] | KeyValueItem[]
type CustomSectionsInput = Array<{ id: string; value: CustomSectionValue }> | Record<string, CustomSectionValue>

function getValue(initial: CustomSectionsInput, id: string): CustomSectionValue | undefined {
	if (Array.isArray(initial)) return initial.find((s) => s.id === id)?.value
	return (initial as Record<string, CustomSectionValue>)?.[id]
}

export function DefaultSectionsEditor({ slug, initial }: { slug: string; initial: CustomSectionsInput }) {
	const [values, setValues] = useState<Record<string, CustomSectionValue>>(() => {
		const v: Record<string, CustomSectionValue> = {}
		for (const sec of defaultSections) {
			const val = getValue(initial, sec.id)
			v[sec.id] = val ?? (listIds.has(sec.id) ? [] : '')
		}
		return v
	})

	const extraSections = useMemo(() => {
		if (!Array.isArray(initial)) return [] as Array<{ id: string; title: string; kind: 'richtext' | 'markdown' | 'list' | 'keyvalue'; value: CustomSectionValue }>
		const allowed = new Set(defaultSections.map((s) => s.id))
		return (initial as Array<{ id: string; title?: string; kind: 'richtext' | 'markdown' | 'list' | 'keyvalue'; value: CustomSectionValue }>)
			.filter((s) => !allowed.has(s.id) && s.title)
			.map(s => ({ ...s, title: s.title! }))
	}, [initial])

	async function save() {
		const payload: Array<{ id: string; title: string; kind: 'list' | 'richtext' | 'markdown' | 'keyvalue'; value: CustomSectionValue }> = []
		for (const sec of defaultSections) {
			payload.push({ id: sec.id, title: sec.title, kind: listIds.has(sec.id) ? 'list' : 'richtext', value: values[sec.id] })
		}
		// preserve extras
		payload.push(...extraSections)
		await fetch(`/api/herbs/${slug}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ customSections: payload }),
		})
	}

	return (
		<div className="space-y-4">
			{defaultSections.map((sec) => (
				<div key={sec.id} className="space-y-2">
					<label className="text-sm font-medium">{sec.title}</label>
					{listIds.has(sec.id) ? (
						<ListEditor value={values[sec.id] as string[]} onChange={(v) => setValues((prev) => ({ ...prev, [sec.id]: v }))} />
					) : (
						<textarea
							rows={4}
							className="w-full rounded-md border px-3 py-2 text-sm"
							value={(values[sec.id] as string) ?? ''}
							onChange={(e) => setValues((prev) => ({ ...prev, [sec.id]: e.currentTarget.value }))}
							placeholder="Not provided"
						/>
					)}
				</div>
			))}
			<div className="flex justify-end">
				<button type="button" className="rounded-md border px-3 py-2 text-sm" onClick={save}>Save Sections</button>
			</div>
		</div>
	)
}
