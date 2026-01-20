# Demo5 - Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   - Commit and push the `demo5` folder to your GitHub repository

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - **Important Settings:**
     - **Root Directory:** `demo5`
     - **Framework Preset:** Vite
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
     - **Install Command:** `npm install`

3. **Environment Variables (Optional)**
   - Skip this if you don't need Supabase sync
   - If needed, add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

5. **Add Custom Domain**
   - Go to Project Settings → Domains
   - Add `demo5.flormontana.site`
   - Follow DNS configuration instructions

### Option 2: Deploy via Vercel CLI

```bash
cd demo5
npm install -g vercel
vercel login
vercel --prod
```

## What's Included

✅ Optimized Vite build configuration
✅ SPA routing with rewrites
✅ Security headers
✅ PWA support
✅ Code splitting and minification
✅ IndexedDB for offline storage
✅ Demo data pre-loaded (maryjohn couple)

## Post-Deployment

After deployment, your app will be available at:
- Vercel URL: `https://your-project.vercel.app`
- Custom domain: `https://demo5.flormontana.site` (after DNS setup)

The app works completely offline and doesn't require Supabase for the demo.

## Troubleshooting

**White screen after deploy?**
- Check browser console for errors
- Verify build completed successfully in Vercel logs
- Ensure root directory is set to `demo5`

**404 on refresh?**
- Already handled by `vercel.json` rewrites
- All routes redirect to `index.html`

**Custom domain not working?**
- Wait for DNS propagation (can take up to 48 hours)
- Verify DNS records in your domain provider
- Check Vercel domain settings
