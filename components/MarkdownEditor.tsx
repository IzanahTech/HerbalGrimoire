"use client"

import { useState } from 'react'
import { SecureMarkdownRenderer } from './SecureMarkdownRenderer'

export function MarkdownEditor({ value, onChange, rows = 10 }: { value?: string; onChange: (v: string) => void; rows?: number }) {
	const [showPreview, setShowPreview] = useState(false)
	
	return (
		<div className="space-y-3">
			<div className="flex gap-2">
				<button
					type="button"
					className={`px-3 py-1 text-sm rounded-md border ${
						!showPreview ? 'bg-blue-100 border-blue-300' : 'bg-gray-100 border-gray-300'
					}`}
					onClick={() => setShowPreview(false)}
				>
					Edit
				</button>
				<button
					type="button"
					className={`px-3 py-1 text-sm rounded-md border ${
						showPreview ? 'bg-blue-100 border-blue-300' : 'bg-gray-100 border-gray-300'
					}`}
					onClick={() => setShowPreview(true)}
				>
					Preview
				</button>
			</div>
			
			{!showPreview ? (
				<textarea
					className="w-full rounded-md border px-3 py-2 text-sm font-mono"
					rows={rows}
					value={value ?? ''}
					onChange={(e) => onChange(e.currentTarget.value)}
					placeholder="# Heading\n\nWrite markdown..."
				/>
			) : (
				<div className="min-h-[200px] rounded-md border p-3 bg-gray-50">
					{value ? (
						<SecureMarkdownRenderer content={value} />
					) : (
						<p className="text-gray-500 italic">No content to preview</p>
					)}
				</div>
			)}
		</div>
	)
}
