'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CreateHerbSchema, type CreateHerb } from '@/lib/zod/herb'

interface HerbFormProps {
	initialData?: Partial<CreateHerb>
	onSubmit: (data: CreateHerb) => Promise<void>
	submitLabel: string
}

export function HerbForm({ initialData, onSubmit, submitLabel }: HerbFormProps) {
	const [formData, setFormData] = useState<CreateHerb>({
		slug: '',
		name: '',
		scientificName: '',
		description: '',
		properties: [],
		uses: [],
		contraindications: '',
		family: '',
		location: '',
		energetics: '',
		partsUsed: [],
		constituents: [],
		dosage: '',
		notesOnUse: '',
		harvesting: '',
		recipes: [],
		...initialData
	})

	const [errors, setErrors] = useState<Record<string, string>>({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const router = useRouter()

	useEffect(() => {
		if (initialData) {
			setFormData(prev => ({ ...prev, ...initialData }))
		}
	}, [initialData])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setErrors({})
		setIsSubmitting(true)

		try {
			// Validate with Zod
			const validatedData = CreateHerbSchema.parse(formData)
			await onSubmit(validatedData)
		} catch (error: unknown) {
			if (error && typeof error === 'object' && 'errors' in error) {
				const zodError = error as { errors: Array<{ path: (string | number)[]; message: string }> }
				const newErrors: Record<string, string> = {}
				zodError.errors.forEach((err) => {
					const path = Array.isArray(err.path) ? err.path[0] : String(err.path)
					if (typeof path === 'string') {
						newErrors[path] = err.message
					}
				})
				setErrors(newErrors)
			} else {
				const errorMessage = error instanceof Error ? error.message : 'An error occurred'
				setErrors({ general: errorMessage })
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	const updateArrayField = (field: keyof CreateHerb, value: string) => {
		const newArray = value.split(',').map(item => item.trim()).filter(Boolean)
		setFormData(prev => ({ ...prev, [field]: newArray }))
	}

	const getArrayFieldValue = (field: keyof CreateHerb) => {
		const array = formData[field] as string[]
		return array ? array.join(', ') : ''
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{errors.general && (
				<div className="text-red-600 bg-red-50 p-3 rounded-md">
					{errors.general}
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<Label htmlFor="slug">Slug</Label>
					<Input
						id="slug"
						value={formData.slug}
						onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
						placeholder="herb-name"
						className={errors.slug ? 'border-red-500' : ''}
					/>
					{errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
				</div>

				<div>
					<Label htmlFor="name">Name</Label>
					<Input
						id="name"
						value={formData.name}
						onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
						placeholder="Herb Name"
						className={errors.name ? 'border-red-500' : ''}
					/>
					{errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
				</div>

				<div>
					<Label htmlFor="scientificName">Scientific Name</Label>
					<Input
						id="scientificName"
						value={formData.scientificName || ''}
						onChange={(e) => setFormData(prev => ({ ...prev, scientificName: e.target.value }))}
						placeholder="Scientific Name"
					/>
				</div>

				<div>
					<Label htmlFor="family">Family</Label>
					<Input
						id="family"
						value={formData.family || ''}
						onChange={(e) => setFormData(prev => ({ ...prev, family: e.target.value }))}
						placeholder="Plant Family"
					/>
				</div>

				<div>
					<Label htmlFor="location">Location</Label>
					<Input
						id="location"
						value={formData.location || ''}
						onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
						placeholder="Geographic Location"
					/>
				</div>

				<div>
					<Label htmlFor="energetics">Energetics</Label>
					<Input
						id="energetics"
						value={formData.energetics || ''}
						onChange={(e) => setFormData(prev => ({ ...prev, energetics: e.target.value }))}
						placeholder="Hot, Cold, etc."
					/>
				</div>
			</div>

			<div>
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					value={formData.description || ''}
					onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
					placeholder="General description of the herb"
					rows={3}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<Label htmlFor="properties">Properties (comma-separated)</Label>
					<Input
						id="properties"
						value={getArrayFieldValue('properties')}
						onChange={(e) => updateArrayField('properties', e.target.value)}
						placeholder="calming, anti-inflammatory"
					/>
				</div>

				<div>
					<Label htmlFor="uses">Uses (comma-separated)</Label>
					<Input
						id="uses"
						value={getArrayFieldValue('uses')}
						onChange={(e) => updateArrayField('uses', e.target.value)}
						placeholder="tea, sleep aid"
					/>
				</div>

				<div>
					<Label htmlFor="partsUsed">Parts Used (comma-separated)</Label>
					<Input
						id="partsUsed"
						value={getArrayFieldValue('partsUsed')}
						onChange={(e) => updateArrayField('partsUsed', e.target.value)}
						placeholder="flowers, leaves, roots"
					/>
				</div>

				<div>
					<Label htmlFor="constituents">Constituents (comma-separated)</Label>
					<Input
						id="constituents"
						value={getArrayFieldValue('constituents')}
						onChange={(e) => updateArrayField('constituents', e.target.value)}
						placeholder="essential oils, flavonoids"
					/>
				</div>
			</div>

			<div>
				<Label htmlFor="contraindications">Contraindications</Label>
				<Textarea
					id="contraindications"
					value={formData.contraindications || ''}
					onChange={(e) => setFormData(prev => ({ ...prev, contraindications: e.target.value }))}
					placeholder="When not to use this herb"
					rows={3}
				/>
			</div>

			<div>
				<Label htmlFor="dosage">Dosage</Label>
				<Textarea
					id="dosage"
					value={formData.dosage || ''}
					onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
					placeholder="Recommended dosage information"
					rows={2}
				/>
			</div>

			<div>
				<Label htmlFor="notesOnUse">Notes on Use</Label>
				<Textarea
					id="notesOnUse"
					value={formData.notesOnUse || ''}
					onChange={(e) => setFormData(prev => ({ ...prev, notesOnUse: e.target.value }))}
					placeholder="Additional usage notes"
					rows={3}
				/>
			</div>

			<div>
				<Label htmlFor="harvesting">Harvesting</Label>
				<Textarea
					id="harvesting"
					value={formData.harvesting || ''}
					onChange={(e) => setFormData(prev => ({ ...prev, harvesting: e.target.value }))}
					placeholder="When and how to harvest"
					rows={3}
				/>
			</div>

			<div>
				<Label htmlFor="recipes">Recipes (comma-separated)</Label>
				<Input
					id="recipes"
					value={getArrayFieldValue('recipes')}
					onChange={(e) => updateArrayField('recipes', e.target.value)}
					placeholder="tea recipe, tincture recipe"
				/>
			</div>

			<div className="flex gap-4 pt-4">
				<Button
					type="submit"
					disabled={isSubmitting}
					className="bg-emerald-600 hover:bg-emerald-700"
				>
					{isSubmitting ? 'Saving...' : submitLabel}
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={() => router.back()}
				>
					Cancel
				</Button>
			</div>
		</form>
	)
}
