import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	await prisma.image.deleteMany()
	await prisma.herb.deleteMany()

	const herbs = [
		{
			slug: 'chamomile',
			name: 'Chamomile',
			scientificName: 'Matricaria chamomilla',
			description: 'Soothing herb often used for teas and relaxation.',
			properties: ['calming', 'anti-inflammatory'],
			uses: ['tea', 'sleep aid'],
			contraindications: ['ragweed allergy'],
			customSections: { preparation: 'Steep flowers for 5-10 minutes.' },
			images: [{ url: 'https://picsum.photos/seed/chamomile/600/400', alt: 'Chamomile flowers' }],
		},
		{
			slug: 'peppermint',
			name: 'Peppermint',
			scientificName: 'Mentha × piperita',
			description: 'Cooling herb used for digestion and flavor.',
			properties: ['carminative', 'antispasmodic'],
			uses: ['tea', 'aromatherapy'],
			contraindications: ['GERD'],
			customSections: { notes: 'Avoid with severe reflux.' },
			images: [{ url: 'https://picsum.photos/seed/peppermint/600/400', alt: 'Peppermint leaves' }],
		},
		{
			slug: 'ginger',
			name: 'Ginger',
			scientificName: 'Zingiber officinale',
			description: 'Warming rhizome for nausea and circulation.',
			properties: ['antiemetic', 'circulatory stimulant'],
			uses: ['tea', 'cooking'],
			contraindications: ['gallstones caution'],
			customSections: { dosage: '1–2 g dried root per day.' },
			images: [{ url: 'https://picsum.photos/seed/ginger/600/400', alt: 'Ginger root' }],
		},
		{
			slug: 'turmeric',
			name: 'Turmeric',
			scientificName: 'Curcuma longa',
			description: 'Golden spice with anti-inflammatory properties.',
			properties: ['anti-inflammatory', 'antioxidant'],
			uses: ['cooking', 'supplement'],
			contraindications: ['bile duct obstruction'],
			customSections: { synergy: 'Combine with black pepper for absorption.' },
			images: [{ url: 'https://picsum.photos/seed/turmeric/600/400', alt: 'Turmeric powder' }],
		},
		{
			slug: 'echinacea',
			name: 'Echinacea',
			scientificName: 'Echinacea purpurea',
			description: 'Immune-support herb commonly used for colds.',
			properties: ['immunomodulatory'],
			uses: ['tincture', 'tea'],
			contraindications: ['autoimmune caution'],
			customSections: { harvest: 'Use aerial parts during flowering.' },
			images: [{ url: 'https://picsum.photos/seed/echinacea/600/400', alt: 'Echinacea flower' }],
		},
		{
			slug: 'lavender',
			name: 'Lavender',
			scientificName: 'Lavandula angustifolia',
			description: 'Aromatic herb for relaxation and sleep.',
			properties: ['anxiolytic', 'sedative'],
			uses: ['aromatherapy', 'tea'],
			contraindications: [],
			customSections: { aroma: 'Floral, calming scent.' },
			images: [{ url: 'https://picsum.photos/seed/lavender/600/400', alt: 'Lavender blossoms' }],
		},
		{
			slug: 'rosemary',
			name: 'Rosemary',
			scientificName: 'Salvia rosmarinus',
			description: 'Stimulating herb for focus and circulation.',
			properties: ['antioxidant', 'circulatory'],
			uses: ['cooking', 'tea'],
			contraindications: ['pregnancy high doses'],
			customSections: { folklore: 'Associated with remembrance.' },
			images: [{ url: 'https://picsum.photos/seed/rosemary/600/400', alt: 'Rosemary sprig' }],
		},
		{
			slug: 'thyme',
			name: 'Thyme',
			scientificName: 'Thymus vulgaris',
			description: 'Antimicrobial culinary herb.',
			properties: ['antimicrobial', 'expectorant'],
			uses: ['cooking', 'steam inhalation'],
			contraindications: [],
			customSections: { constituents: 'Thymol, carvacrol.' },
			images: [{ url: 'https://picsum.photos/seed/thyme/600/400', alt: 'Thyme leaves' }],
		},
		{
			slug: 'sage',
			name: 'Sage',
			scientificName: 'Salvia officinalis',
			description: 'Astringent herb used for sore throats.',
			properties: ['astringent', 'antimicrobial'],
			uses: ['gargle', 'tea'],
			contraindications: ['pregnancy high doses'],
			customSections: { caution: 'Thujone content at high doses.' },
			images: [{ url: 'https://picsum.photos/seed/sage/600/400', alt: 'Sage leaves' }],
		},
		{
			slug: 'dandelion',
			name: 'Dandelion',
			scientificName: 'Taraxacum officinale',
			description: 'Bitter herb supportive of digestion and liver.',
			properties: ['diuretic', 'bitter'],
			uses: ['salads', 'tea'],
			contraindications: ['diuretics interaction'],
			customSections: { parts: 'Leaves and roots used.' },
			images: [{ url: 'https://picsum.photos/seed/dandelion/600/400', alt: 'Dandelion plant' }],
		},
	]

	for (const herb of herbs) {
		await prisma.herb.create({
			data: {
				slug: herb.slug,
				name: herb.name,
				scientificName: herb.scientificName,
				description: herb.description,
				properties: JSON.stringify(herb.properties ?? []),
				uses: JSON.stringify(herb.uses ?? []),
				contraindications: JSON.stringify(herb.contraindications ?? []),
				customSections: JSON.stringify(herb.customSections ?? {}),
				images: {
					create: herb.images,
				},
			},
		})
	}

	const count = await prisma.herb.count()
	console.log(`Seeded ${count} herbs`)
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
