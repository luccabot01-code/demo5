# 📋 Deployment Checklist

## Pre-Deployment

- [ ] All features tested locally
- [ ] Demo account (maryjohn) working correctly
- [ ] No console errors
- [ ] Build succeeds: `npm run build`
- [ ] Preview build locally: `npm run preview`
- [ ] All environment variables documented
- [ ] .gitignore includes sensitive files
- [ ] README.md updated
- [ ] Version number updated in package.json

## GitHub Setup

- [ ] Repository created on GitHub
- [ ] All files committed
- [ ] Pushed to main branch
- [ ] Repository is public (or private with proper access)
- [ ] .gitignore working (no node_modules, .env, etc.)

## Vercel Deployment

- [ ] Vercel account created
- [ ] GitHub connected to Vercel
- [ ] Project imported from GitHub
- [ ] Build settings configured:
  - Framework: Vite
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`
- [ ] Environment variables added (if any)
- [ ] First deployment successful
- [ ] Demo URL working: `/c/maryjohn`

## Post-Deployment Testing

- [ ] Homepage loads correctly
- [ ] Demo account accessible
- [ ] All routes working
- [ ] Dark/Light theme working
- [ ] Language switching working
- [ ] Demo modal appears on edit attempts
- [ ] Mobile responsive
- [ ] PWA installable
- [ ] No 404 errors
- [ ] All images loading
- [ ] Performance acceptable (Lighthouse score)

## Demo Account Verification

- [ ] URL: `https://your-domain.vercel.app/c/maryjohn`
- [ ] Demo badge visible
- [ ] Sample data loaded (tasks, goals, memories, etc.)
- [ ] All pages accessible
- [ ] Edit attempts show demo modal
- [ ] Modal links to Etsy shop
- [ ] Language can be changed
- [ ] Theme can be changed
- [ ] No data can be modified

## SEO & Meta Tags

- [ ] Page title correct
- [ ] Meta description set
- [ ] Favicon visible
- [ ] Open Graph tags (for social sharing)
- [ ] Manifest.json configured

## Security

- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Security headers configured
- [ ] No sensitive data in code
- [ ] API keys in environment variables (not in code)
- [ ] CORS configured properly (if using API)

## Performance

- [ ] Images optimized
- [ ] Code splitting working
- [ ] Lazy loading implemented
- [ ] Bundle size acceptable
- [ ] First load fast (<3s)
- [ ] Lighthouse score >90

## Monitoring

- [ ] Vercel Analytics enabled
- [ ] Error tracking setup (optional)
- [ ] Uptime monitoring (optional)

## Documentation

- [ ] README.md complete
- [ ] DEPLOYMENT.md available
- [ ] QUICK_START.md available
- [ ] Demo URL documented
- [ ] Support email included

## Etsy Integration

- [ ] Demo URL ready to share
- [ ] Product description includes demo link
- [ ] Screenshots updated
- [ ] Demo account showcases all features
- [ ] Purchase flow clear

## Final Checks

- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Test on tablet
- [ ] Share demo link with test users
- [ ] Verify Etsy shop link works
- [ ] Verify support email works

## Automatic Deployments

- [ ] GitHub Actions workflow working (optional)
- [ ] Auto-deploy on push to main
- [ ] Preview deployments for PRs
- [ ] Build notifications configured

## Backup & Recovery

- [ ] Code backed up on GitHub
- [ ] Deployment settings documented
- [ ] Environment variables documented
- [ ] Recovery plan documented

## Launch

- [ ] All checklist items completed
- [ ] Demo URL shared on Etsy
- [ ] Social media announcement (optional)
- [ ] Email to existing customers (optional)

---

## Quick Commands

```bash
# Test build locally
npm run build
npm run preview

# Deploy to Vercel
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console
3. Verify all files committed to GitHub
4. Contact: sahinturkzehra@gmail.com

## Success! 🎉

Once all items are checked, your Couple HQ is live and ready for customers!

Demo URL: `https://your-domain.vercel.app/c/maryjohn`
