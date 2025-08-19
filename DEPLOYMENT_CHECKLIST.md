# ✅ Vercel Deployment Checklist

## 🚀 Pre-Deployment Checklist

- [ ] **Code is ready**: All features implemented and tested
- [ ] **Build passes**: `pnpm build` runs without errors
- [ ] **Tests pass**: `pnpm test` runs successfully
- [ ] **Environment variables**: `.env.example` created
- [ ] **Git repository**: Code committed and pushed to GitHub
- [ ] **Database choice**: Production database selected and configured

## 🗄️ Database Setup

- [ ] **Choose database provider**:
  - [ ] Vercel Postgres (recommended)
  - [ ] PlanetScale (MySQL)
  - [ ] Supabase (PostgreSQL)
  - [ ] Railway (PostgreSQL/MySQL)
- [ ] **Get connection string** from database provider
- [ ] **Test connection** locally if possible

## 🔧 Vercel Configuration

- [ ] **Create Vercel account** at [vercel.com](https://vercel.com)
- [ ] **Connect GitHub repository** to Vercel
- [ ] **Set environment variables**:
  - [ ] `DATABASE_URL` = your production database URL
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
- Verify `DATABASE_URL` is correct
- Check database is accessible from Vercel
- Ensure database schema is up to date

### Runtime Errors
- Check Vercel function logs
- Verify environment variables are set
- Test API endpoints individually

## 📞 Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Project Issues**: Use GitHub Issues in your repository

---

**🎉 You're ready to deploy! Follow this checklist and your Herbal Grimoire will be live on the web in no time!**
