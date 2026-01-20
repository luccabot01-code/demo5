# ⚡ Quick Deploy - 3 Commands

## Prerequisites
- GitHub account
- Vercel account (free at https://vercel.com)

## Deploy Now (5 Minutes)

### 1. Push to GitHub (2 min)

```bash
# You are in: deployment-package/

git init
git add .
git commit -m "Couple HQ - Ready for deployment"

# Create repo on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/couple-hq.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel (2 min)

**Option A: Dashboard (Easiest)**
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your repository
4. Click "Deploy"

**Option B: CLI**
```bash
npm install -g vercel
vercel login
vercel --prod
```

### 3. Test Demo (1 min)

Visit:
```
https://your-project.vercel.app/c/maryjohn
```

## ✅ Done!

Your Couple HQ is live! 🎉

### Share Your Demo
```
Try Couple HQ: https://your-url.vercel.app/c/maryjohn
```

### Add to Etsy
Update your product description with the demo link!

---

## Need Help?

- Read: [docs/START_HERE.md](docs/START_HERE.md)
- Email: sahinturkzehra@gmail.com

## What's Next?

Every time you push to GitHub:
```bash
git add .
git commit -m "Update"
git push
```

Vercel automatically rebuilds and deploys! 🚀
