"use client"

import { useState } from 'react'
import { CustomSectionsEditor, type Section } from '@/components/CustomSectionsEditor'

export function CustomSectionsPanel({ slug, initial }: { slug: string; initial: Section[] }) {
	const [sections, setSections] = useState<Section[]>(initial)
	return (
		<CustomSectionsEditor
			value={sections}
			onChange={async (next) => {
				setSections(next)
				await fetch(`/api/herbs/${slug}`, {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ customSections: next }),
				})
			}}
		/>
	)
}
