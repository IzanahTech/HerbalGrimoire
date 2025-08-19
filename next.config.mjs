import crypto from 'crypto'

/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		NEXT_PUBLIC_BASE_URL: process.env.VERCEL_URL 
			? `https://${process.env.VERCEL_URL}` 
			: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'picsum.photos'
			},
			{
				protocol: 'https',
				hostname: '*.vercel.app'
			},
			{
				protocol: 'https',
				hostname: 'vercel.app'
			}
		],
		// Enable image optimization for Vercel
		unoptimized: false,
		// Allow external domains for production
		domains: process.env.NODE_ENV === 'production' ? ['picsum.photos'] : []
	},
	// Vercel deployment optimizations
	experimental: {
		// Optimize package imports
		optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
	},
	// Compiler options
	compiler: {
		// Remove console logs in production
		removeConsole: process.env.NODE_ENV === 'production'
	},
	// Vercel-specific configurations
	trailingSlash: false,
	// Redirects (if needed)
	async redirects() {
		return [
			// Add any redirects here if needed
			// Example: redirect old URLs to new ones
			// {
			//   source: '/old-page',
			//   destination: '/new-page',
			//   permanent: true,
			// },
		]
	},
	// Rewrites (if needed)
	async rewrites() {
		return [
			// Add any rewrites here if needed
			// Example: rewrite API calls to external services
			// {
			//   source: '/api/external/:path*',
			//   destination: 'https://api.external.com/:path*',
			// },
		]
	},
	async headers() {
		const isProduction = process.env.NODE_ENV === 'production'
		
		// Generate a nonce for inline scripts/styles in production
		const nonce = isProduction ? Buffer.from(crypto.randomBytes(16)).toString('base64') : ''
		
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-Frame-Options',
						value: 'DENY'
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff'
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin'
					},
					{
						key: 'X-XSS-Protection',
						value: '1; mode=block'
					},
					{
						key: 'Permissions-Policy',
						value: 'camera=(), microphone=(), geolocation=()'
					},
					{
						key: 'Content-Security-Policy',
						value: isProduction 
							? [
								"default-src 'self'",
								"script-src 'self' 'nonce-" + nonce + "'",
								"style-src 'self' 'nonce-" + nonce + "'",
								"img-src 'self' data: blob: https://picsum.photos https://*.vercel.app",
								"font-src 'self'",
								"connect-src 'self'",
								"media-src 'self'",
								"object-src 'none'",
								"base-uri 'self'",
								"form-action 'self'",
								"frame-ancestors 'none'",
								"upgrade-insecure-requests"
							].join('; ')
							: [
								"default-src 'self'",
								"script-src 'self' 'unsafe-eval' 'unsafe-inline'",
								"style-src 'self' 'unsafe-inline'",
								"img-src 'self' data: https: blob:",
								"font-src 'self'",
								"connect-src 'self'",
								"media-src 'self'",
								"object-src 'none'",
								"base-uri 'self'",
								"form-action 'self'",
								"frame-ancestors 'none'"
							].join('; ')
					}
				]
			},
			// API-specific headers
			{
				source: '/api/(.*)',
				headers: [
					{
						key: 'Access-Control-Allow-Origin',
						value: '*'
					},
					{
						key: 'Access-Control-Allow-Methods',
						value: 'GET, POST, PUT, DELETE, OPTIONS'
					},
					{
						key: 'Access-Control-Allow-Headers',
						value: 'Content-Type, Authorization'
					}
				]
			}
		]
	}
}

export default nextConfig
