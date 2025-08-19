import crypto from 'crypto'

/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		NEXT_PUBLIC_BASE_URL: 'http://localhost:3000'
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'picsum.photos'
			}
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
								"img-src 'self' data: blob: https://picsum.photos",
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
			}
		]
	}
}

export default nextConfig
