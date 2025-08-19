"use client"

import { exportCsv, exportJson, importCsv, importJson } from '@/lib/io'
import { toast } from 'sonner'

export function ImportExportMenu() {
	async function doExport(kind: 'json' | 'csv') {
		try {
			const blob = kind === 'json' ? await exportJson() : await exportCsv()
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = kind === 'json' ? 'herbs.json' : 'herbs.csv'
			document.body.appendChild(a)
			a.click()
			a.remove()
			URL.revokeObjectURL(url)
			toast.success(`Exported ${kind.toUpperCase()}`)
		} catch (e: unknown) {
			const err = e as Error
			toast.error(`Export failed: ${err.message ?? String(e)}`)
		}
	}

	async function pickFile(accept: string): Promise<File | null> {
		return new Promise((resolve) => {
			const input = document.createElement('input')
			input.type = 'file'
			input.accept = accept
			input.onchange = () => resolve(input.files?.[0] ?? null)
			input.click()
		})
	}

	async function doImport(kind: 'json' | 'csv') {
		const file = await pickFile(kind === 'json' ? 'application/json' : 'text/csv')
		if (!file) return
		try {
			if (kind === 'json') {
				const { created, updated, failed } = await importJson(file)
				toast.success(`JSON import: created ${created}, updated ${updated}, failed ${failed}`)
			} else {
				const { created, failed } = await importCsv(file)
				toast.success(`CSV import: created ${created}, failed ${failed}`)
			}
			window.location.reload()
		} catch (e: unknown) {
			const err = e as Error
			toast.error(`Import failed: ${err.message ?? String(e)}`)
		}
	}

	return (
		<div className="flex items-center gap-2" title="CSV: no quoted fields; arrays split by |">
			<button type="button" className="rounded-md border px-2 py-1 text-xs" onClick={() => doImport('json')}>Import JSON</button>
			<button type="button" className="rounded-md border px-2 py-1 text-xs" onClick={() => doImport('csv')}>Import CSV</button>
			<span className="mx-1 h-4 w-px bg-gray-200" />
			<button type="button" className="rounded-md border px-2 py-1 text-xs" onClick={() => doExport('json')}>Export JSON</button>
			<button type="button" className="rounded-md border px-2 py-1 text-xs" onClick={() => doExport('csv')}>Export CSV</button>
		</div>
	)
}
