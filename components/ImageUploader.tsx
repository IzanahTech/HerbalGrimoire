"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

type ImageRecord = { id: string; url: string; alt: string | null; position: number; isPrimary: boolean }

export function ImageUploader({ slug, initial }: { slug: string; initial: ImageRecord[] }) {
	const [images, setImages] = useState<ImageRecord[]>([...initial].sort((a, b) => a.position - b.position))
	const [uploading, setUploading] = useState(false)
	const [progress, setProgress] = useState(0)
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		setImages([...initial].sort((a, b) => a.position - b.position))
	}, [initial])

	const onFiles = useCallback(async (files: FileList | File[]) => {
		const list = Array.from(files)
		if (!list.length) return
		const fd = new FormData()
		for (const f of list) fd.append('files', f)
		setUploading(true)
		setProgress(0)
		try {
			const res = await fetch(`/api/herbs/${slug}/images`, { method: 'POST', body: fd })
			const json = await res.json()
			if (!res.ok || !json.ok) throw new Error(json.error || 'Upload failed')
			setImages((prev) => [...prev, ...json.data].sort((a, b) => a.position - b.position))
		} finally {
			setUploading(false)
			setProgress(100)
			setTimeout(() => setProgress(0), 500)
		}
	}, [slug])

	const onDrop = (e: React.DragEvent) => {
		e.preventDefault()
		if (e.dataTransfer.files) onFiles(e.dataTransfer.files)
	}

	const onPaste = (e: React.ClipboardEvent) => {
		const items = e.clipboardData.files
		if (items && items.length) onFiles(items)
	}

	async function removeImage(id: string) {
		const res = await fetch(`/api/herbs/${slug}/images/${id}`, { method: 'DELETE' })
		const json = await res.json()
		if (json.ok) setImages((prev) => prev.filter((i) => i.id !== id))
	}

	async function makePrimary(id: string) {
		await fetch(`/api/herbs/${slug}/images/primary`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageId: id }) })
		setImages((prev) => prev.map((i) => ({ ...i, isPrimary: i.id === id })))
	}

	async function reorder(next: ImageRecord[]) {
		setImages(next)
		await fetch(`/api/herbs/${slug}/images/reorder`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ order: next.map((i) => i.id) }),
		})
	}

	async function updateAlt(id: string, alt: string) {
		await fetch(`/api/herbs/${slug}/images/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ alt }) })
		setImages((prev) => prev.map((i) => (i.id === id ? { ...i, alt } : i)))
	}

	return (
		<div onDrop={onDrop} onDragOver={(e) => e.preventDefault()} onPaste={onPaste} className="space-y-3">
			<div className="rounded-md border border-dashed p-4 text-center">
				<p className="text-sm text-gray-600">Drag & drop, paste, or</p>
				<div className="mt-2"><Button type="button" onClick={() => inputRef.current?.click()}>Choose files</Button></div>
				<input ref={inputRef} type="file" multiple hidden onChange={(e) => e.target.files && onFiles(e.target.files)} />
				{uploading && <div className="mx-auto mt-3 h-2 w-40 overflow-hidden rounded bg-gray-100"><div className="h-2 bg-gray-600" style={{ width: `${progress}%` }} /></div>}
			</div>

			{images.length === 0 ? (
				<div className="rounded-md border p-6 text-center text-sm text-gray-500">No images</div>
			) : (
				<ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
					{images.map((img, idx) => (
						<li key={img.id} className="space-y-2">
							<div className="relative aspect-square overflow-hidden rounded-md border">
								<Image src={img.url} alt={img.alt ?? ''} fill className="object-cover" />
								{img.isPrimary && <span className="absolute left-1 top-1 rounded bg-black/70 px-1 text-[10px] text-white">Primary</span>}
							</div>
							<div className="flex items-center gap-2">
								<Button type="button" variant="outline" className="h-8 px-2" onClick={() => makePrimary(img.id)}>Primary</Button>
								<Button type="button" variant="outline" className="h-8 px-2" onClick={() => removeImage(img.id)}>Delete</Button>
							</div>
							<input
								className="w-full rounded-md border px-2 py-1 text-xs"
								placeholder="Alt text"
								defaultValue={img.alt ?? ''}
								onBlur={(e) => updateAlt(img.id, e.currentTarget.value)}
							/>
							<div className="flex items-center justify-between text-[10px] text-gray-500">
								<button type="button" onClick={() => idx > 0 && reorder(swap(images, idx, idx - 1))}>Move left</button>
								<button type="button" onClick={() => idx < images.length - 1 && reorder(swap(images, idx, idx + 1))}>Move right</button>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

function swap(arr: ImageRecord[], i: number, j: number) {
	const next = [...arr]
	;[next[i], next[j]] = [next[j], next[i]]
	return next.map((it, idx) => ({ ...it, position: idx }))
}
