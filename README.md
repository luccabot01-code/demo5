# 🚀 Couple HQ Demo5 - Production Ready

A fully-featured couple life planner with 10 language support, offline functionality, and PWA capabilities.

## ✅ Latest Updates

- ✅ Mobile sidebar scroll fixed
- ✅ Hidden scrollbars (clean UI)
- ✅ Photo upload modal translations (all languages)
- ✅ Language persistence working
- ✅ Build optimized (726 KB)
- ✅ Ready for deployment

## ⚡ Quick Deploy to Vercel (5 Minutes)

### Step 1: Push to GitHub

```bash
# If not already in a git repo
git init
git add .
git commit -m "Demo5 ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. **IMPORTANT:** Set **Root Directory** to `demo5`
4. Framework: Vite (auto-detected)
5. Click "Deploy"

### Step 3: Add Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add: `demo5.flormontana.site`
3. Configure DNS CNAME record at your domain provider

**Done!** Your app is live 🎉

## 📋 Deployment Guides

- **[DEPLOY_READY.md](DEPLOY_READY.md)** - Complete deployment checklist
- **[VERCEL_SETUP.md](VERCEL_SETUP.md)** - Detailed Vercel guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Alternative deployment options

## ✨ Features

- 📱 **10 Languages** - Auto-detect browser language
- 💾 **Offline First** - Works without internet (IndexedDB)
- 🎨 **Dark/Light Theme** - User preference
- 📸 **Photo Upload** - Couple and partner photos
- 📊 **Full Dashboard** - Tasks, Budget, Goals, Calendar, etc.
- 🔒 **No Backend Required** - Runs entirely in browser
- ⚡ **PWA** - Installable as native app
- 🚀 **Fast** - Code splitting, lazy loading, optimized

## 🎭 Demo Account

Pre-configured demo at root URL:
- **Couple:** Mary & John
- **Data:** Sample tasks, goals, memories, etc.
- **Mode:** Read-only (shows modal on edit attempts)
- **Languages:** All 10 languages supported

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 What's Included

```
demo5/
├── src/
│   ├── components/      # React components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilities (i18n, db, etc.)
│   ├── pages/           # Page components
│   ├── store/           # Zustand store
│   └── main.jsx         # Entry point
├── public/              # Static assets
├── docs/                # Documentation
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── vercel.json          # Vercel deployment config
├── tailwind.config.js   # Tailwind CSS config
└── index.html           # HTML entry point
```

## 🌍 Supported Languages

1. 🇹🇷 Turkish (Türkçe)
2. 🇬🇧 English
3. 🇪🇸 Spanish (Español)
4. 🇫🇷 French (Français)
5. 🇩🇪 German (Deutsch)
6. 🇮🇹 Italian (Italiano)
7. 🇵🇹 Portuguese (Português)
8. 🇷🇺 Russian (Русский)
9. 🇸🇦 Arabic (العربية)
10. 🇨🇳 Chinese (中文)

## 🎯 Production Checklist

- [x] Build test passed
- [x] All translations working
- [x] Photo upload modal translations
- [x] Language persistence
- [x] Demo data loads correctly
- [x] Routing configured
- [x] SPA rewrites configured
- [x] PWA configured
- [x] Offline functionality
- [x] No console errors
- [x] Performance optimized

## 🚀 After Deployment

Test these features:
1. ✅ Root URL loads dashboard
2. ✅ All routes work (no 404 on refresh)
3. ✅ Language switching persists
4. ✅ Photo upload modal in correct language
5. ✅ Offline mode works
6. ✅ PWA installable

## 📞 Support

- **Email:** sahinturkzehra@gmail.com
- **Etsy:** https://etsy.com/shop/FlorMontana

## 📄 License

All rights reserved - Couple HQ v1.0.0

---

**Ready to deploy?** See [DEPLOY_READY.md](DEPLOY_READY.md) for complete guide.
