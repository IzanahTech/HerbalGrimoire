import request from 'supertest'
import { createTestApp } from '@/test/testServer'

const app = createTestApp()

describe('UI core flows (API backing)', () => {
	it('A–Z filter and search (simulated via API list with q/letter)', async () => {
		await request(app)
			.post('/api/herbs')
			.send({ name: 'Ginger', scientificName: 'Zingiber officinale', properties: ['antiemetic'], uses: ['tea', 'cooking'] })
			.set('Content-Type', 'application/json')
			.expect(200)

		const byLetter = await request(app).get('/api/herbs?letter=g').expect(200)
		expect(byLetter.body.data.map((h: any) => h.slug)).toContain('ginger')

		const bySearch = await request(app).get('/api/herbs?q=gin').expect(200)
		expect(bySearch.body.data.map((h: any) => h.slug)).toContain('ginger')
	})
})
