import { HerbForm } from '@/components/forms/HerbForm'
import { isAdminServer } from '@/lib/admin'
import { CreateHerb } from '@/lib/zod/herb'
import { redirect } from 'next/navigation'

export default async function NewHerbPage() {
	if (!(await isAdminServer())) {
		redirect('/admin/login')
	}

	const handleSubmit = async (data: CreateHerb) => {
		'use server'
		
		try {
			const response = await fetch('/api/herbs', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})

			if (!response.ok) {
				throw new Error('Failed to create herb')
			}

			const result = await response.json()
			
			// Redirect to the new herb page
			redirect(`/herbs/${result.data.slug}`)
		} catch (error) {
			console.error('Error creating herb:', error)
			throw error
		}
	}

	return (
		<div className="mx-auto max-w-4xl space-y-8 p-6">
			<div className="space-y-2">
				<h1 className="text-3xl font-bold">New Herb</h1>
				<p className="text-gray-600">Add a new herb to your collection.</p>
			</div>

			<HerbForm
				initialData={{}}
				onSubmit={handleSubmit}
				submitLabel="Create Herb"
			/>
		</div>
	)
}
