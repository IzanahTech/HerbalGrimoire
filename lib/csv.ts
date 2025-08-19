export type CsvRecord = Record<string, string>

export function parseCsv(text: string): CsvRecord[] {
	const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
	if (lines.length === 0) return []
	const headers = splitRow(lines[0])
	const records: CsvRecord[] = []
	for (let i = 1; i < lines.length; i++) {
		const cols = splitRow(lines[i])
		const rec: CsvRecord = {}
		headers.forEach((h, idx) => {
			rec[h] = cols[idx] ?? ''
		})
		records.push(rec)
	}
	return records
}

export function toCsv(records: CsvRecord[], headers?: string[]): string {
	if (!records.length) return ''
	const cols = headers ?? Array.from(new Set(records.flatMap((r) => Object.keys(r))))
	const lines = [cols.join(',')]
	for (const r of records) {
		lines.push(cols.map((c) => sanitize(r[c] ?? '')).join(','))
	}
	return lines.join('\n')
}

function splitRow(row: string): string[] {
	// No quoted-field support; simple split
	return row.split(',').map((s) => s.trim())
}

function sanitize(value: string): string {
	// Remove newlines and commas to keep our simple CSV intact
	return String(value).replace(/[\n\r]+/g, ' ').replace(/,/g, ';')
}

export function joinArray(values?: unknown): string {
	if (!Array.isArray(values)) return ''
	return values.map((v) => String(v)).join('|')
}

export function splitArray(value?: string): string[] {
	if (!value) return []
	return value
		.split('|')
		.map((s) => s.trim())
		.filter((s) => s.length > 0)
}
