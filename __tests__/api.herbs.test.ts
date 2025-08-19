import request from 'supertest'
import { createTestApp } from '@/test/testServer'

const app = createTestApp()

describe('API herbs CRUD', () => {
	it('creates, lists, gets, updates, and deletes a herb', async () => {
		const create = await request(app)
			.post('/api/herbs')
			.send({ name: 'Test Herb', scientificName: 'Testus herbus', properties: ['a'], uses: ['b'] })
			.set('Content-Type', 'application/json')
			.expect(200)
		const slug = create.body.data.slug

		const list = await request(app).get('/api/herbs').expect(200)
		expect(list.body.data.find((h: any) => h.slug === slug)).toBeTruthy()

		const get = await request(app).get(`/api/herbs/${slug}`).expect(200)
		expect(get.body.data.name).toBe('Test Herb')

		await request(app)
			.patch(`/api/herbs/${slug}`)
			.send({ description: 'Updated desc' })
			.set('Content-Type', 'application/json')
			.expect(200)

		const updated = await request(app).get(`/api/herbs/${slug}`).expect(200)
		expect(updated.body.data.description).toBe('Updated desc')

		await request(app).delete(`/api/herbs/${slug}`).expect(200)
		await request(app).get(`/api/herbs/${slug}`).expect(404)
	})
})
