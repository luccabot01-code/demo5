# 🚀 Quick Start - Deploy to Vercel

## Step 1: Prepare Your Project

Make sure all files are ready:
```bash
npm install
npm run build
```

## Step 2: Push to GitHub

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/couple-hq.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Vercel Dashboard (Easiest)

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Select your `couple-hq` repository
5. Click "Deploy" (no configuration needed!)

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## Step 4: Access Your Demo

Your demo will be live at:
```
https://your-project.vercel.app/c/maryjohn
```

## 🎯 Demo Account

The demo account (`maryjohn`) is pre-configured with:
- Sample tasks, goals, memories
- Read-only mode (shows purchase modal on edits)
- All features visible
- Perfect for showcasing to customers

## 🔗 Share Your Demo

Share this link with potential customers:
```
https://your-domain.vercel.app/c/maryjohn
```

## ⚙️ Optional: Custom Domain

1. In Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `couplehq.app`)
3. Update DNS records as instructed
4. Demo will be at: `https://couplehq.app/c/maryjohn`

## 🔄 Automatic Updates

Every time you push to GitHub `main` branch:
- Vercel automatically rebuilds
- New version goes live in ~1 minute
- Zero downtime deployment

## 📊 Monitor Your Deployment

Vercel Dashboard shows:
- Build logs
- Deployment status
- Analytics
- Error tracking

## 🛠️ Troubleshooting

### Build fails?
- Check Node version: `node -v` (should be 18+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

### Demo not working?
- Check URL: `/c/maryjohn` (lowercase)
- Verify `seedData.js` has demo data
- Check browser console for errors

### Need help?
- Email: sahinturkzehra@gmail.com
- Check Vercel logs in dashboard

## 🎉 You're Done!

Your Couple HQ is now live and ready to share with customers on Etsy!
