'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLoginPage() {
	const [password, setPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError('')

		try {
			const response = await fetch('/api/admin/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ password }),
			})

			const data = await response.json()

			if (response.ok && data.success) {
				router.push('/')
				router.refresh()
			} else {
				setError(data.error || 'Login failed')
			}
		} catch {
			setError('Network error. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-emerald-50">
			<div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-lg">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
					<p className="mt-2 text-sm text-gray-600">
						Enter your password to access admin features
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-4">
						<div>
							<Label htmlFor="password" className="sr-only">
								Password
							</Label>
							<Input
								id="password"
								name="password"
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter admin password"
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
								disabled={isLoading}
							/>
						</div>
					</div>

					{error && (
						<div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
							{error}
						</div>
					)}

					<Button
						type="submit"
						disabled={isLoading || !password.trim()}
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? 'Signing in...' : 'Sign in'}
					</Button>
				</form>

				<div className="text-center">
					<Link
						href="/"
						className="text-sm text-emerald-600 hover:text-emerald-500"
					>
						← Back to home
					</Link>
				</div>
			</div>
		</div>
	)
}
