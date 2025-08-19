# 🚀 Vercel Deployment Guide

This guide will walk you through deploying your Herbal Grimoire app to Vercel.

## 📋 Prerequisites

- [Vercel account](https://vercel.com/signup) (free tier available)
- GitHub repository with your code
- Database solution for production (see options below)

## 🗄️ Database Options for Vercel

### Option 1: Vercel Postgres (Recommended)
- **Pros**: Fully managed, automatic scaling, Vercel integration
- **Cons**: Limited free tier (1GB storage)
- **Setup**: Use Vercel dashboard to create Postgres database

### Option 2: PlanetScale (MySQL)
- **Pros**: Generous free tier, excellent performance
- **Cons**: Requires external account
- **Setup**: Create account at [planetscale.com](https://planetscale.com)

### Option 3: Supabase (PostgreSQL)
- **Pros**: Free tier with 500MB, real-time features
- **Cons**: External service
- **Setup**: Create account at [supabase.com](https://supabase.com)

### Option 4: Railway (PostgreSQL/MySQL)
- **Pros**: Simple setup, good free tier
- **Cons**: External service
- **Setup**: Create account at [railway.app](https://railway.app)

## 🔧 Database Schema Update

If using a different database provider, update your Prisma schema:

```prisma
// For PostgreSQL/MySQL
datasource db {
  provider = "postgresql" // or "mysql"
  url      = env("DATABASE_URL")
}

// For SQLite (not recommended for production)
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

## 🚀 Deployment Steps

### 1. Prepare Your Repository

Ensure your code is committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository

### 3. Configure Project Settings

#### Environment Variables
Set these in the Vercel dashboard:

```env
DATABASE_URL="your-production-database-url"
NODE_ENV="production"
```

#### Build Settings
- **Framework Preset**: Next.js
- **Build Command**: `pnpm build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

### 4. Deploy

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

# Run migrations
vercel env pull .env.production
pnpm prisma db push
```

## 📱 Post-Deployment

### 1. Test Your App
- Navigate to your Vercel URL
- Test all major functionality
- Check admin panel access
- Verify image uploads work

### 2. Set Up Custom Domain (Optional)
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### 3. Monitor Performance
- Use Vercel Analytics (free tier available)
- Monitor function execution times
- Check for any build errors

## 🐛 Troubleshooting

### Common Issues

#### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

#### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database is accessible from Vercel
- Ensure database schema is up to date

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
```

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files
- Use Vercel's environment variable system
- Rotate secrets regularly

### Database Security
- Use connection pooling
- Implement proper authentication
- Regular backups

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
- **Project Issues**: Use GitHub Issues in your repository

---

## 🎉 You're Ready to Deploy!

Your Herbal Grimoire app is now configured for Vercel deployment. Follow the steps above and you'll have a production-ready application running in minutes!

**Next Steps:**
1. Choose your database provider
2. Set up environment variables
3. Deploy to Vercel
4. Test thoroughly
5. Share your live app! 🌿✨
