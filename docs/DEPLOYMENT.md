# Couple HQ - Deployment Guide

## Vercel Deployment

### Prerequisites
1. GitHub account
2. Vercel account (sign up at https://vercel.com)
3. Git installed on your computer

### Step 1: Push to GitHub

1. Create a new repository on GitHub (e.g., `couple-hq`)

2. Initialize git in your project (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

3. Add GitHub remote and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/couple-hq.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click "Deploy"

#### Option B: Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

### Step 3: Environment Variables (Optional)

If using Supabase, add these environment variables in Vercel Dashboard:

1. Go to Project Settings → Environment Variables
2. Add:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

### Step 4: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Demo URL

After deployment, your demo will be available at:
- Production: `https://your-project.vercel.app/c/maryjohn`
- Custom domain: `https://yourdomain.com/c/maryjohn`

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies are in `package.json`
- Check build logs in Vercel dashboard

### Routes Not Working
- Ensure `vercel.json` has correct rewrites configuration
- Check that all routes are defined in React Router

### Environment Variables Not Working
- Prefix all env vars with `VITE_`
- Redeploy after adding environment variables

## GitHub Actions (Optional)

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) for automated deployments.

To use it:
1. Get your Vercel token from https://vercel.com/account/tokens
2. Add these secrets to your GitHub repository:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

## Support

For issues:
- Email: sahinturkzehra@gmail.com
- Etsy: https://etsy.com/shop/FlorMontana
