"use client"

import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useState } from 'react'
import { ListEditor } from './ListEditor'
import { KeyValueEditor, KV } from './KeyValueEditor'
import { MarkdownEditor } from './MarkdownEditor'

type KeyValueItem = { key: string; value?: string | null }
export type SectionValue = string | string[] | KeyValueItem[]
export type Section = { id: string; title?: string; kind: 'richtext' | 'markdown' | 'list' | 'keyvalue'; value: SectionValue }

type Props = {
	value?: Section[]
	onChange: (sections: Section[]) => void
}

export function CustomSectionsEditor({ value, onChange }: Props) {
	const [sections, setSections] = useState<Section[]>(value ?? [])
	useEffect(() => { setSections(value ?? []) }, [value])

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
	)

	function add(kind: Section['kind']) {
		const id = `section-${crypto.randomUUID()}`
		const next: Section = { id, title: '', kind, value: kind === 'list' ? [] : kind === 'keyvalue' ? [] : '' }
		const copy = [...sections, next]
		setSections(copy)
		onChange(copy)
	}

	function remove(id: string) {
		const copy = sections.filter((s) => s.id !== id)
		setSections(copy)
		onChange(copy)
	}

	function update(id: string, patch: Partial<Section>) {
		const copy = sections.map((s) => (s.id === id ? { ...s, ...patch } : s))
		setSections(copy)
		onChange(copy)
	}

	function onDragEnd(event: DragEndEvent) {
		const { active, over } = event
		if (!over || active.id === over.id) return
		const oldIndex = sections.findIndex((s) => s.id === active.id)
		const newIndex = sections.findIndex((s) => s.id === over.id)
		const copy = arrayMove(sections, oldIndex, newIndex)
		setSections(copy)
		onChange(copy)
	}

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap gap-2">
				<button type="button" className="rounded-md border px-2 py-1 text-xs" onClick={() => add('richtext')}>Add Rich Text</button>
				<button type="button" className="rounded-md border px-2 py-1 text-xs" onClick={() => add('markdown')}>Add Markdown</button>
				<button type="button" className="rounded-md border px-2 py-1 text-xs" onClick={() => add('list')}>Add List</button>
				<button type="button" className="rounded-md border px-2 py-1 text-xs" onClick={() => add('keyvalue')}>Add Key/Value</button>
			</div>
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
				<SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
					<ul className="space-y-3">
						{sections.map((s) => (
							<SectionItem key={s.id} section={s} onChange={update} onRemove={remove} />
						))}
					</ul>
				</SortableContext>
			</DndContext>
		</div>
	)
}

function SectionItem({ section, onChange, onRemove }: { section: Section; onChange: (id: string, patch: Partial<Section>) => void; onRemove: (id: string) => void }) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id })
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}
	return (
		<li ref={setNodeRef} style={style} className="rounded-md border">
			<div className="flex items-center justify-between border-b px-3 py-2">
				<input
					className="flex-1 rounded-md border px-2 py-1 text-sm"
					placeholder="Section title"
					value={section.title ?? ''}
					onChange={(e) => onChange(section.id, { title: e.currentTarget.value })}
				/>
				<button type="button" className="text-xs" {...attributes} {...listeners}>Drag</button>
				<button type="button" className="text-xs text-red-600" onClick={() => onRemove(section.id)}>Delete</button>
			</div>
			<div className="p-3">
				{section.kind === 'richtext' && (
					<textarea 
						className="w-full rounded-md border px-3 py-2 text-sm" 
						rows={8} 
						value={typeof section.value === 'string' ? section.value : ''} 
						onChange={(e) => onChange(section.id, { value: e.currentTarget.value })} 
					/>
				)}
				{section.kind === 'markdown' && (
					<MarkdownEditor 
						value={typeof section.value === 'string' ? section.value : ''} 
						onChange={(v) => onChange(section.id, { value: v })} 
					/>
				)}
				{section.kind === 'list' && (
					<ListEditor 
						value={Array.isArray(section.value) && section.value.every(v => typeof v === 'string') ? section.value as string[] : []} 
						onChange={(v) => onChange(section.id, { value: v })} 
					/>
				)}
				{section.kind === 'keyvalue' && (
					<KeyValueEditor 
						value={Array.isArray(section.value) && section.value.every(v => typeof v === 'object' && v !== null && 'key' in v) ? section.value as KV[] : []} 
						onChange={(v) => onChange(section.id, { value: v as KV[] })} 
					/>
				)}
			</div>
		</li>
	)
}
