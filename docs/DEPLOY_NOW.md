# 🚀 Deploy Now - 5 Minute Guide

## Prerequisites
- GitHub account
- Vercel account (free)

## Step 1: Push to GitHub (2 minutes)

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for deployment"

# Create a new repository on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/couple-hq.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel (2 minutes)

1. Go to https://vercel.com
2. Click "Sign Up" and choose "Continue with GitHub"
3. Click "Add New" → "Project"
4. Find and select your `couple-hq` repository
5. Click "Deploy" (that's it!)

## Step 3: Test Your Demo (1 minute)

Vercel will give you a URL like:
```
https://couple-hq-abc123.vercel.app
```

Visit your demo at:
```
https://couple-hq-abc123.vercel.app/c/maryjohn
```

## ✅ Done!

Your Couple HQ is now live! 🎉

### What You Get:
- ✅ Live demo at `/c/maryjohn`
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Auto-deploy on git push
- ✅ Free hosting
- ✅ Custom domain support

### Share Your Demo:
```
Try Couple HQ: https://your-url.vercel.app/c/maryjohn
```

### Add to Etsy:
Update your product description with the demo link!

---

## Need Help?

### Build Failed?
```bash
# Test locally first
npm install
npm run build
npm run preview
```

### Demo Not Working?
- Check URL is `/c/maryjohn` (lowercase)
- Wait 1-2 minutes for deployment to complete
- Check Vercel deployment logs

### Want Custom Domain?
1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `couplehq.app`)
3. Update DNS as instructed
4. Done! Demo will be at `couplehq.app/c/maryjohn`

---

## Next Steps

### Automatic Updates
Every time you push to GitHub:
```bash
git add .
git commit -m "Update features"
git push
```
Vercel automatically rebuilds and deploys! 🚀

### Monitor Your Site
- Vercel Dashboard shows analytics
- View deployment logs
- Check performance metrics

### Share on Etsy
Add to your product description:
```
🎯 Try Live Demo: https://your-url.vercel.app/c/maryjohn

See all features in action before you buy!
No signup required.
```

---

## Quick Reference

### Useful Commands
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
vercel --prod
```

### Important Files
- `vercel.json` - Vercel configuration
- `package.json` - Dependencies and scripts
- `src/lib/seedData.js` - Demo data
- `src/contexts/CoupleContext.jsx` - Demo logic

### Demo Account
- URL: `/c/maryjohn`
- Couple: Mary & John
- Read-only mode
- All features visible
- Links to Etsy shop

---

## Support

Email: sahinturkzehra@gmail.com
Etsy: https://etsy.com/shop/FlorMontana

---

## 🎉 Congratulations!

Your Couple HQ is live and ready to showcase to customers!

**Demo URL**: https://your-url.vercel.app/c/maryjohn

Share it everywhere! 🚀
