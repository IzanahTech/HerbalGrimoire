import { beforeAll, beforeEach, afterAll } from 'vitest'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

// Unique temp SQLite DB per run
const dbFile = path.join(os.tmpdir(), `herbal-test-${Date.now()}-${Math.random().toString(16).slice(2)}.db`)
process.env.DATABASE_URL = `file:${dbFile}`
process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000'

let prisma: PrismaClient

beforeAll(async () => {
	// Apply schema
	execSync('pnpm db:push', { stdio: 'ignore' })
	prisma = new PrismaClient()
	await prisma.$connect()
})

beforeEach(async () => {
	await prisma.image.deleteMany()
	await prisma.herb.deleteMany()
})

afterAll(async () => {
	await prisma.$disconnect()
	try { fs.unlinkSync(dbFile) } catch {}
})
