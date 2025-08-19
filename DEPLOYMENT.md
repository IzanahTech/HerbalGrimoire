# 🚀 Vercel Deployment Guide

This guide will walk you through deploying your Herbal Grimoire app to Vercel with PostgreSQL.

## 📋 Prerequisites

- [Vercel account](https://vercel.com/signup) (free tier available)
- GitHub repository with your code
- **PostgreSQL database** (see options below)

## 🗄️ PostgreSQL Database Options for Vercel

### Option 1: Vercel Postgres (Recommended)
- **Pros**: Fully managed, automatic scaling, Vercel integration, built-in connection pooling
- **Cons**: Limited free tier (1GB storage, 10GB bandwidth)
- **Setup**: Use Vercel dashboard to create Postgres database
- **Cost**: Free tier available, then $20/month

### Option 2: Supabase (PostgreSQL)
- **Pros**: Free tier with 500MB, real-time features, excellent dashboard
- **Cons**: External service
- **Setup**: Create account at [supabase.com](https://supabase.com)
- **Cost**: Free tier, then $25/month

### Option 3: PlanetScale (MySQL - requires schema change)
- **Pros**: Generous free tier, excellent performance
- **Cons**: Requires changing Prisma provider to MySQL
- **Setup**: Create account at [planetscale.com](https://planetscale.com)
- **Cost**: Free tier, then $29/month

### Option 4: Railway (PostgreSQL)
- **Pros**: Simple setup, good free tier, easy scaling
- **Cons**: External service
- **Setup**: Create account at [railway.app](https://railway.app)
- **Cost**: Free tier, then pay-as-you-use

### Option 5: Neon (PostgreSQL)
- **Pros**: Serverless PostgreSQL, generous free tier, branching
- **Cons**: External service
- **Setup**: Create account at [neon.tech](https://neon.tech)
- **Cost**: Free tier with 3GB storage

## 🔧 Database Schema

Your Prisma schema is now configured for PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 🚀 Deployment Steps

### 1. Prepare Your Repository

Ensure your code is committed and pushed to GitHub:

```bash
git add .
git commit -m "Switch to PostgreSQL for production"
git push origin main
```

### 2. Set Up PostgreSQL Database

#### Option A: Vercel Postgres (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in
2. Navigate to "Storage" in the dashboard
3. Click "Create Database"
4. Choose "Postgres" and select your plan
5. Note down the connection string

#### Option B: Supabase
1. Go to [supabase.com](https://supabase.com) and create account
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string

#### Option C: Other Providers
Follow the provider's setup guide and get your connection string.

### 3. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository

### 4. Configure Project Settings

#### Environment Variables
Set these in the Vercel dashboard:

```env
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"
NODE_ENV="production"
```

**Important**: Replace the DATABASE_URL with your actual PostgreSQL connection string.

#### Build Settings
- **Framework Preset**: Next.js
- **Build Command**: `pnpm build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

### 5. Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Your app will be live at `https://your-project.vercel.app`

## 🔄 Database Migration

After deployment, run database migrations:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Pull environment variables
vercel env pull .env.production

# Push the new PostgreSQL schema
pnpm prisma db push

# Generate Prisma client
pnpm prisma generate
```

## 📱 Post-Deployment

### 1. Test Your App
- Navigate to your Vercel URL
- Test all major functionality
- Check admin panel access
- Verify image uploads work
- Test database operations

### 2. Set Up Custom Domain (Optional)
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### 3. Monitor Performance
- Use Vercel Analytics (free tier available)
- Monitor function execution times
- Check for any build errors
- Monitor database performance

## 🐛 Troubleshooting

### Common Issues

#### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

#### Database Connection Issues
- Verify `DATABASE_URL` is correct and includes `?schema=public`
- Check database is accessible from Vercel
- Ensure database schema is up to date
- Verify SSL requirements (add `?sslmode=require` if needed)

#### Prisma Issues
- Run `pnpm prisma generate` after schema changes
- Check Prisma logs for connection errors
- Verify database permissions

#### Image Upload Issues
- Check `next.config.mjs` image configuration
- Verify file size limits
- Ensure proper CORS headers

### Debug Commands

```bash
# Check build locally
pnpm build

# Test production build
pnpm start

# Check environment variables
vercel env ls

# View deployment logs
vercel logs

# Test database connection
pnpm prisma db push --preview-feature
```

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files
- Use Vercel's environment variable system
- Rotate database passwords regularly

### Database Security
- Use connection pooling (automatic with Vercel Postgres)
- Implement proper authentication
- Regular backups
- Enable SSL connections

### API Security
- Rate limiting (already implemented)
- Input validation (already implemented)
- CORS configuration (already implemented)

## 📊 Performance Optimization

### Vercel Features
- **Edge Functions**: For global performance
- **Image Optimization**: Automatic with Next.js
- **CDN**: Global content delivery
- **Analytics**: Built-in performance monitoring

### PostgreSQL Features
- **Connection Pooling**: Automatic with Vercel Postgres
- **Indexing**: Optimize query performance
- **Materialized Views**: For complex queries
- **Full-Text Search**: Built-in search capabilities

### Code Optimization
- **Bundle Analysis**: Use `@next/bundle-analyzer`
- **Tree Shaking**: Automatic with modern bundlers
- **Code Splitting**: Automatic with Next.js

## 🔄 Continuous Deployment

### Automatic Deployments
- Every push to `main` branch triggers deployment
- Preview deployments for pull requests
- Automatic rollback on failures

### Manual Deployments
```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel
```

## 📞 Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Prisma Documentation**: [prisma.io/docs](https://prisma.io/docs)
- **Project Issues**: Use GitHub Issues in your repository

---

## 🎉 You're Ready to Deploy with PostgreSQL!

Your Herbal Grimoire app is now configured for Vercel deployment with PostgreSQL. Follow the steps above and you'll have a production-ready application with a robust database running in minutes!

**Next Steps:**
1. Choose your PostgreSQL provider
2. Set up the database and get connection string
3. Deploy to Vercel
4. Run database migrations
5. Test thoroughly
6. Share your live app! 🌿✨
