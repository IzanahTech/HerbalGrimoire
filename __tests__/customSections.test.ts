import request from 'supertest'
import { createTestApp } from '@/test/testServer'

const app = createTestApp()

describe('Custom sections order', () => {
	it('persists and returns in saved order', async () => {
		const create = await request(app)
			.post('/api/herbs')
			.send({ name: 'Sections Herb' })
			.set('Content-Type', 'application/json')
			.expect(200)
		const slug = create.body.data.slug

		const sections = [
			{ id: 'a', title: 'A', kind: 'richtext', value: 'one' },
			{ id: 'b', title: 'B', kind: 'list', value: ['x', 'y'] },
			{ id: 'c', title: 'C', kind: 'keyvalue', value: [{ key: 'k', value: 'v' }] },
		]
		await request(app)
			.patch(`/api/herbs/${slug}`)
			.send({ customSections: sections })
			.set('Content-Type', 'application/json')
			.expect(200)

		const get = await request(app).get(`/api/herbs/${slug}`).expect(200)
		const fetched = get.body.data.customSections
		expect(Array.isArray(fetched)).toBe(true)
		expect(fetched.map((s: any) => s.id)).toEqual(['a', 'b', 'c'])
	})
})
