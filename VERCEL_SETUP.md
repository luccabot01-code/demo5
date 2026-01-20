# Vercel Deployment - Quick Setup

## ✅ Pre-Deployment Checklist

- [x] Build test passed (`npm run build`)
- [x] Vercel.json configured
- [x] SPA routing configured
- [x] Environment variables optional (demo works without Supabase)
- [x] .gitignore configured
- [x] Node version specified

## 🚀 Deploy Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare demo5 for Vercel deployment"
git push origin main
```

### 2. Import to Vercel

Go to [vercel.com/new](https://vercel.com/new)

**Project Settings:**
```
Root Directory: demo5
Framework: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node Version: 18.x or higher
```

**Environment Variables:** (Optional - skip for demo)
```
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
```

### 3. Deploy
Click "Deploy" and wait ~2 minutes

### 4. Add Custom Domain

After successful deployment:

1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter: `demo5.flormontana.site`
4. Vercel will show DNS records to add

**DNS Configuration (at your domain provider):**
```
Type: CNAME
Name: demo5
Value: cname.vercel-dns.com
```

Wait 5-60 minutes for DNS propagation.

## 🎯 Expected Result

- ✅ App loads at root URL (no /c/maryjohn in URL)
- ✅ Demo data (maryjohn couple) pre-loaded
- ✅ All routes work (refresh on any page works)
- ✅ PWA installable
- ✅ Works offline
- ✅ No Supabase required

## 🔍 Verify Deployment

After deploy, test these URLs:
- `https://your-project.vercel.app/` → Dashboard
- `https://your-project.vercel.app/tasks` → Tasks page
- `https://your-project.vercel.app/budget` → Budget page
- Refresh any page → Should not 404

## 🐛 Troubleshooting

**Build fails?**
- Check Vercel build logs
- Verify root directory is `demo5`
- Ensure Node version is 18+

**White screen?**
- Open browser console (F12)
- Check for JavaScript errors
- Verify all assets loaded (Network tab)

**404 on routes?**
- Already fixed in vercel.json
- If still happening, check Vercel rewrites configuration

**Domain not working?**
- DNS can take up to 48 hours
- Verify CNAME record at domain provider
- Use `nslookup demo5.flormontana.site` to check DNS

## 📱 Post-Deployment

Your app is now live! Features:
- 📊 Full dashboard with demo data
- 💾 Offline-first (IndexedDB)
- 📱 PWA installable
- 🔒 No backend required
- 🚀 Fast global CDN
