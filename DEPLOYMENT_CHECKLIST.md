# ✅ Vercel Deployment Checklist

## 🚀 Pre-Deployment Checklist

- [ ] **Code is ready**: All features implemented and tested
- [ ] **Build passes**: `pnpm build` runs without errors
- [ ] **Tests pass**: `pnpm test` runs successfully
- [ ] **Environment variables**: `.env.example` created
- [ ] **Git repository**: Code committed and pushed to GitHub
- [ ] **PostgreSQL database**: Production database selected and configured

## 🗄️ PostgreSQL Database Setup

- [ ] **Choose database provider**:
  - [ ] Vercel Postgres (recommended)
  - [ ] Supabase (PostgreSQL)
  - [ ] Neon (PostgreSQL)
  - [ ] Railway (PostgreSQL)
  - [ ] PlanetScale (MySQL - requires schema change)
- [ ] **Create database instance** with your chosen provider
- [ ] **Get connection string** from database provider
- [ ] **Test connection** locally if possible
- [ ] **Note**: Connection string should include `?schema=public`

## 🔧 Vercel Configuration

- [ ] **Create Vercel account** at [vercel.com](https://vercel.com)
- [ ] **Connect GitHub repository** to Vercel
- [ ] **Set environment variables**:
  - [ ] `DATABASE_URL` = your PostgreSQL connection string
  - [ ] `NODE_ENV` = "production"
- [ ] **Configure build settings**:
  - [ ] Framework: Next.js
  - [ ] Build Command: `pnpm build`
  - [ ] Install Command: `pnpm install`
  - [ ] Output Directory: `.next`

## 🚀 Deploy

- [ ] **Click Deploy** in Vercel dashboard
- [ ] **Wait for build** to complete
- [ ] **Check deployment logs** for any errors
- [ ] **Test live application**:
  - [ ] Home page loads
  - [ ] Herb browsing works
  - [ ] Search functionality
  - [ ] Admin panel access
  - [ ] Image uploads (if applicable)

## 📱 Post-Deployment

- [ ] **Run database migrations**:
  ```bash
  npm i -g vercel
  vercel login
  vercel env pull .env.production
  pnpm prisma db push
  pnpm prisma generate
  ```
- [ ] **Test all functionality** on live site
- [ ] **Set up custom domain** (optional)
- [ ] **Configure monitoring** and analytics
- [ ] **Share your live app**! 🌿✨

## 🔍 Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify all dependencies in `package.json`
- Check Node.js version compatibility

### Database Connection Issues
- Verify `DATABASE_URL` is correct and includes `?schema=public`
- Check database is accessible from Vercel
- Ensure database schema is up to date
- Verify SSL requirements (add `?sslmode=require` if needed)

### Prisma Issues
- Run `pnpm prisma generate` after schema changes
- Check Prisma logs for connection errors
- Verify database permissions

### Runtime Errors
- Check Vercel function logs
- Verify environment variables are set
- Test API endpoints individually

## 📊 PostgreSQL-Specific Benefits

- [ ] **Connection pooling** (automatic with Vercel Postgres)
- [ ] **Better performance** for complex queries
- [ ] **Full-text search** capabilities
- [ ] **JSON support** for flexible data
- [ ] **Advanced indexing** options
- [ ] **Materialized views** for optimization

## 📞 Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **Project Issues**: Use GitHub Issues in your repository

---

**🎉 You're ready to deploy with PostgreSQL! Follow this checklist and your Herbal Grimoire will be live on the web with a robust database in no time!**
