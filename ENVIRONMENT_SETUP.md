# Environment Variables Setup Guide

This project uses different environment files for different purposes. Here's how to set them up:

## Environment Files Overview

### 1. `.env` (Base defaults - CAN be committed)
- Contains default values that are safe to commit
- Used as fallbacks when other files don't override them
- **Purpose**: Base configuration for all environments

### 2. `.env.local` (Local development - CANNOT be committed)
- Overrides `.env` for local development
- Contains sensitive information like passwords and API keys
- **Purpose**: Local development configuration

### 3. `.env.production` (Local production testing - CANNOT be committed)
- For testing production settings locally
- **Purpose**: Local production testing only

### 4. `.env.example` (Template - CAN be committed)
- Template file showing what environment variables are needed
- **Purpose**: Guide for other developers

## Setup Instructions

### For Local Development

1. **Copy the template**:
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** with your local values:
   ```bash
   # Database - use SQLite for local development
   DATABASE_URL="file:./dev.db"
   
   # Base URL for local development
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   
   # Admin password for local development
   ADMIN_PASSWORD="your-local-password"
   
   # Blob storage token (if using Vercel Blob)
   BLOB_READ_WRITE_TOKEN="your-blob-token"
   ```

### For Production (Vercel)

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables

2. **Add these variables**:
   ```bash
   DATABASE_URL=postgres://neondb_owner:npg_IWoCz0MN7GjY@ep-dawn-smoke-ad74xglt-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   NODE_ENV=production
   ADMIN_PASSWORD=your-secure-production-password
   BLOB_READ_WRITE_TOKEN=your-production-blob-token
   ```

3. **Deploy** - Vercel will automatically use these environment variables

## Environment Variable Priority

Next.js loads environment variables in this order (highest priority first):

1. `.env.local` (local development)
2. `.env.production` (production builds)
3. `.env` (base defaults)

## Important Notes

- **Never commit** `.env.local` or `.env.production` to git
- **Always commit** `.env` and `.env.example` to git
- The `.gitignore` file is already configured to ignore sensitive files
- For production, always set environment variables in your hosting platform (Vercel)

## Troubleshooting

### "Failed to load herbs" Error
- Check that `DATABASE_URL` is set correctly in production
- Ensure the database is accessible from your production environment
- Verify that `NODE_ENV=production` is set

### Build Warnings
- Run `pnpm approve-builds` to approve necessary build scripts
- Ensure Prisma is properly configured in your build process

### Local Development Issues
- Make sure `.env.local` exists and has the correct values
- Try running `pnpm dev` to see any error messages
- Check that your local database (SQLite) is accessible
