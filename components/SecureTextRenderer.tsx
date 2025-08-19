'use client'

import DOMPurify from 'dompurify'

interface SecureTextRendererProps {
	content: string
	className?: string
	allowHtml?: boolean
}

export function SecureTextRenderer({ content, className = '', allowHtml = false }: SecureTextRendererProps) {
	if (!content) return null

	if (allowHtml) {
		// Sanitize HTML content
		const sanitizedHtml = DOMPurify.sanitize(content, {
			ALLOWED_TAGS: [
				'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
				'p', 'br', 'hr',
				'strong', 'em', 'u', 's', 'code', 'pre',
				'ul', 'ol', 'li',
				'blockquote',
				'a',
				'span', 'div'
			],
			ALLOWED_ATTR: [
				'href', 'src', 'alt', 'title', 'target',
				'class', 'id'
			],
			ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
			KEEP_CONTENT: true,
			RETURN_DOM: false,
			RETURN_DOM_FRAGMENT: false,
			RETURN_TRUSTED_TYPE: false
		})

		return (
			<div 
				className={className}
				dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
			/>
		)
	}

	// Plain text - escape HTML
	const escapedContent = content
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;')

	return (
		<div className={className}>
			{escapedContent}
		</div>
	)
} 