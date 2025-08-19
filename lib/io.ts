import { parseCsv, toCsv, joinArray, splitArray, CsvRecord } from './csv'

export type HerbRecord = {
	slug?: string
	name: string
	scientificName?: string | null
	description?: string | null
	properties?: string[]
	uses?: string[]
	contraindications?: string[]
}

export type ExportedHerb = {
	id: string
	slug: string
	name: string
	scientificName?: string | null
	description?: string | null
	properties?: string[]
	uses?: string[]
	contraindications?: string[]
	customSections?: unknown
	images?: Array<{ id: string; url: string; alt?: string | null; position: number; isPrimary: boolean }>
}

export async function exportJson(): Promise<Blob> {
	const res = await fetch('/api/herbs')
	const json = await res.json()
	const data = json.data as ExportedHerb[]
	return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
}

export async function exportCsv(): Promise<Blob> {
	const res = await fetch('/api/herbs')
	const json = await res.json()
	const data = json.data as ExportedHerb[]
	const records: CsvRecord[] = data.map((h) => ({
		slug: h.slug,
		name: h.name,
		scientificName: h.scientificName ?? '',
		description: h.description ?? '',
		properties: joinArray(h.properties),
		uses: joinArray(h.uses),
		contraindications: joinArray(h.contraindications),
	}))
	const csv = toCsv(records, ['slug', 'name', 'scientificName', 'description', 'properties', 'uses', 'contraindications'])
	return new Blob([csv], { type: 'text/csv' })
}

export async function importJson(file: File): Promise<{ created: number; updated: number; failed: number }> {
	const text = await file.text()
	let arr: ExportedHerb[]
	try {
		arr = JSON.parse(text)
		if (!Array.isArray(arr)) throw new Error('JSON must be an array of herbs')
	} catch {
		throw new Error('Invalid JSON')
	}
	let created = 0, updated = 0, failed = 0
	for (const h of arr) {
		const payload: HerbRecord & { slug?: string } = {
			name: String(h.name ?? ''),
			slug: typeof h.slug === 'string' ? h.slug : undefined,
			scientificName: h.scientificName ?? null,
			description: h.description ?? null,
			properties: Array.isArray(h.properties) ? h.properties : [],
			uses: Array.isArray(h.uses) ? h.uses : [],
			contraindications: Array.isArray(h.contraindications) ? h.contraindications : [],
		}
		if (!payload.name) { failed++; continue }
		try {
			const exists = payload.slug ? await fetch(`/api/herbs/${payload.slug}`) : null
			if (exists && exists.ok) {
				const r = await fetch(`/api/herbs/${payload.slug}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
				if (r.ok) updated++; else failed++
			} else {
				const r = await fetch(`/api/herbs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
				if (r.ok) created++; else failed++
			}
		} catch {
			failed++
		}
	}
	return { created, updated, failed }
}

export async function importCsv(file: File): Promise<{ created: number; failed: number }> {
	const text = await file.text()
	const rows = parseCsv(text)
	let created = 0, failed = 0
	for (const r of rows) {
		const payload: HerbRecord & { slug?: string } = {
			name: r.name,
			slug: r.slug || undefined,
			scientificName: r.scientificName || undefined,
			description: r.description || undefined,
			properties: splitArray(r.properties),
			uses: splitArray(r.uses),
			contraindications: splitArray(r.contraindications),
		}
		if (!payload.name) { failed++; continue }
		try {
			const res = await fetch('/api/herbs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
			if (res.ok) created++; else failed++
		} catch {
			failed++
		}
	}
	return { created, failed }
}
