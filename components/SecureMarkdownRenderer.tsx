'use client'

import { useEffect, useRef, useState } from 'react'
import DOMPurify from 'dompurify'

interface SecureMarkdownRendererProps {
	content: string
	className?: string
}

export function SecureMarkdownRenderer({ content, className = '' }: SecureMarkdownRendererProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const [sanitizedHtml, setSanitizedHtml] = useState('')

	useEffect(() => {
		if (!content || !containerRef.current) return

		// Convert markdown to HTML
		const html = convertMarkdownToHtml(content)

		// Sanitize the HTML
		const sanitizedHtml = DOMPurify.sanitize(html, {
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

		// Set the sanitized HTML using React's dangerouslySetInnerHTML
		setSanitizedHtml(sanitizedHtml)
	}, [content])

	return (
		<div 
			ref={containerRef} 
			className={`prose prose-sm max-w-none ${className}`}
			dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
		/>
	)
}

// Basic markdown to HTML converter
function convertMarkdownToHtml(markdown: string): string {
	let html = markdown

	// Headers
	html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
	html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
	html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')

	// Bold and italic
	html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
	html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
	html = html.replace(/__(.*?)__/g, '<strong>$1</strong>')
	html = html.replace(/_(.*?)_/g, '<em>$1</em>')

	// Code blocks
	html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
	html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

	// Links
	html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

	// Images
	html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')

	// Lists
	html = html.replace(/^\* (.*$)/gim, '<li>$1</li>')
	html = html.replace(/^- (.*$)/gim, '<li>$1</li>')
	html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>')

	// Wrap lists - find consecutive li elements and wrap them
	const lines = html.split('\n')
	let inList = false
	let listStart = -1
	
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].includes('<li>')) {
			if (!inList) {
				inList = true
				listStart = i
			}
		} else if (inList && !lines[i].includes('<li>')) {
			// End of list, wrap with ul
			if (listStart !== -1) {
				lines[listStart] = '<ul>' + lines[listStart]
				lines[i - 1] = lines[i - 1] + '</ul>'
			}
			inList = false
			listStart = -1
		}
	}
	
	// Handle case where list ends at end of content
	if (inList && listStart !== -1) {
		lines[listStart] = '<ul>' + lines[listStart]
		lines[lines.length - 1] = lines[lines.length - 1] + '</ul>'
	}
	
	html = lines.join('\n')

	// Blockquotes
	html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')

	// Horizontal rules
	html = html.replace(/^---$/gim, '<hr>')

	// Line breaks
	html = html.replace(/\n/g, '<br>')

	// Paragraphs
	html = html.replace(/<br><br>/g, '</p><p>')
	html = html.replace(/^(.*)$/gm, '<p>$1</p>')

	// Clean up empty paragraphs
	html = html.replace(/<p><\/p>/g, '')
	html = html.replace(/<p><br><\/p>/g, '')

	return html
} 