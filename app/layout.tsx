import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
// import { ImportExportMenu } from '@/components/ImportExportMenu'
import Link from 'next/link'
import { isAdminServer } from '@/lib/admin'
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts'
import Image from 'next/image'

export const metadata: Metadata = {
	title: 'The A to Z Herbal',
	description: 'Herbal knowledge from A to Z',
	icons: {
		icon: '/logo.png',
		shortcut: '/logo.png',
		apple: '/logo.png',
	},
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const isAdmin = await isAdminServer()
	return (
		<html lang="en">
			<body className="min-h-screen bg-emerald-50 text-gray-900 antialiased">
				<header className="sticky top-0 z-50 w-full border-b border-[#06402B] bg-[#06402B]" aria-label="Site header">
					<div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
						<Link href="/" aria-label="Home" className="flex items-center gap-3">
							<Image src="/logo.png" alt="The A to Z Herbal logo" width={48} height={48} className="h-12 w-12 rounded-md object-contain" />
							<span className="text-lg font-semibold tracking-tight text-white">The A to Z Herbal</span>
						</Link>
						<nav className="flex items-center gap-3" aria-label="Admin">
							{isAdmin ? (
								<>
									<form action="/api/admin/logout" method="post">
										<button className="rounded-md border border-emerald-300 bg-white px-2 py-1 text-xs text-emerald-700 hover:bg-emerald-100" type="submit">Logout</button>
									</form>
								</>
							) : (
								<Link href="/admin/login" className="rounded-md border border-emerald-300 bg-white px-2 py-1 text-xs text-emerald-700 hover:bg-emerald-100">Login</Link>
							)}
						</nav>
					</div>
				</header>
				<main className="mx-auto max-w-5xl px-4 py-8" aria-live="polite">{children}</main>
				<Toaster richColors position="top-center" />
				<KeyboardShortcuts />
			</body>
		</html>
	)
}
