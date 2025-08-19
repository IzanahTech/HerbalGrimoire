import express from 'express'
import type { Request as ExRequest, Response as ExResponse } from 'express'
import { GET as herbsGET, POST as herbsPOST } from '@/app/api/herbs/route'
import { GET as herbGET, PATCH as herbPATCH, DELETE as herbDELETE } from '@/app/api/herbs/[slug]/route'
import { POST as imagesPOST } from '@/app/api/herbs/[slug]/images/route'
import { PATCH as reorderPATCH } from '@/app/api/herbs/[slug]/images/reorder/route'
import { PATCH as primaryPATCH } from '@/app/api/herbs/[slug]/images/primary/route'
import { DELETE as imageDELETE, PATCH as imagePATCH } from '@/app/api/herbs/[slug]/images/[id]/route'

function toWebRequest(req: ExRequest): Request {
	const url = `http://localhost${req.originalUrl}`
	if (req.method === 'GET' || req.method === 'DELETE') return new Request(url, { method: req.method })
	const body = JSON.stringify(req.body || {})
	return new Request(url, { method: req.method, body, headers: { 'content-type': 'application/json' } })
}

async function sendWebResponse(res: ExResponse, webRes: Response) {
	const contentType = webRes.headers.get('content-type') || 'application/json'
	res.status(webRes.status)
	res.setHeader('content-type', contentType)
	const text = await webRes.text()
	res.send(text)
}

function wrap(handler: (req: Request, ctx?: any) => Promise<Response>) {
	return async (req: ExRequest, res: ExResponse) => {
		try {
			const webReq = toWebRequest(req)
			const ctx = { params: req.params }
			const out = await handler(webReq as any, ctx)
			await sendWebResponse(res, out)
		} catch (e: any) {
			console.error('Route error:', e)
			res.status(500).json({ ok: false, error: e?.message || String(e) })
		}
	}
}

export function createTestApp() {
	const app = express()
	app.use(express.json())

	app.get('/api/herbs', wrap(herbsGET))
	app.post('/api/herbs', wrap(herbsPOST))
	app.get('/api/herbs/:slug', wrap(herbGET))
	app.patch('/api/herbs/:slug', wrap(herbPATCH))
	app.delete('/api/herbs/:slug', wrap(herbDELETE))

	app.post('/api/herbs/:slug/images', wrap(imagesPOST))
	app.patch('/api/herbs/:slug/images/reorder', wrap(reorderPATCH))
	app.patch('/api/herbs/:slug/images/primary', wrap(primaryPATCH))
	app.patch('/api/herbs/:slug/images/:id', wrap(imagePATCH))
	app.delete('/api/herbs/:slug/images/:id', wrap(imageDELETE))

	return app
}
