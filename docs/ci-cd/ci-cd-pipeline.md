# CI/CD Pipeline

This document describes the complete CI/CD pipeline for the cto4ai-blog project.

## Overview

The project uses a multi-stage pipeline:

1. **Local: Pre-Push Hooks** - Run before code leaves your machine
2. **GitHub: CI Checks** - Run when code reaches GitHub (if configured)
3. **Cloudflare Pages: Build & Deploy** - Automatically deploy to production

## Stage 1: Local Pre-Push Hooks

**When:** Every `git push`

**What runs:**

```bash
npm run check  # Astro check, ESLint, Prettier
npm run build  # Full production build
```

**Purpose:**

- Catch errors before they reach GitHub
- Validate code quality and formatting
- Ensure the site builds successfully

**Duration:** ~30-60 seconds

**Details:** See [pre-push-hooks.md](./pre-push-hooks.md)

## Stage 2: GitHub CI (Optional)

**When:** Push to any branch, or Pull Request

**What runs:** Depends on GitHub Actions configuration (if any)

**Typical checks:**

- Run tests
- Build validation
- Code quality checks
- Security scanning

**Status:** Check `.github/workflows/` directory for configured workflows

**Note:** As of this writing, the primary CI enforcement is through pre-push hooks. GitHub Actions may be configured for additional checks.

## Stage 3: Cloudflare Pages Deployment

**When:** Push to `main` branch

**What runs:**

1. **Clone Repository**
   - Cloudflare clones the latest `main` branch
   - Uses specific commit SHA

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Build Site**

   ```bash
   npm run build
   ```

   Runs:
   - Astro builds all pages
   - Generates static HTML/CSS/JS
   - Optimizes images
   - Creates Pagefind search index

4. **Deploy**
   - Uploads built files to Cloudflare's global CDN
   - Deploys to production domain: `cto4.ai`
   - Creates preview URL for this deployment

**Build Configuration:**

- **Build command:** `npm run build`
- **Build output directory:** `dist/`
- **Node version:** Specified in package.json engines or Cloudflare settings
- **Environment variables:** Configured in Cloudflare Pages dashboard

**Duration:** ~2-5 minutes (depending on site size and dependencies)

**Success indicators:**

- ✅ Build log shows "Build succeeded"
- ✅ Preview URL is accessible
- ✅ Production site updates at cto4.ai

**Failure causes:**

- Build errors (same as local `npm run build`)
- Missing environment variables
- Incompatible Node version
- Out of memory during build
- Invalid Astro configuration

## Preview Deployments

**When:** Push to any branch (not just main)

**What happens:**

- Cloudflare builds the branch
- Creates unique preview URL
- Does NOT deploy to production
- Useful for testing before merging

**Preview URL format:**

```
https://<commit-hash>.cto4ai-blog.pages.dev
```

## Production Deployment

**When:** Push to `main` branch

**What happens:**

- Builds and deploys to production
- Updates cto4.ai domain
- Previous deployment remains accessible via its unique URL
- Cloudflare caches globally

**Rollback:** If a deployment breaks production:

1. Go to Cloudflare Pages dashboard
2. Find previous successful deployment
3. Click "Rollback to this deployment"
4. Or: `git revert` the bad commit and push

## Environment Variables

**Where:** Cloudflare Pages Dashboard → Settings → Environment Variables

**Common variables:**

- `NODE_VERSION` - Node.js version for builds
- `SITE_URL` - Production URL (cto4.ai)
- API keys for integrations (if any)

**Note:** Environment variables are separate for Production and Preview environments.

## Deployment Timeline

**Full timeline from code to production:**

```
git push
  ↓
  ├─ Pre-push hooks (30-60s)
  ↓
  ├─ Push to GitHub (<5s)
  ↓
  ├─ Cloudflare detects push (<10s)
  ↓
  ├─ Cloudflare builds (2-5min)
  ↓
  └─ Deploy to CDN (<30s)

Total: ~3-7 minutes from push to live
```

## Monitoring Deployments

**Cloudflare Pages Dashboard:**

- View build logs
- See deployment history
- Monitor build time trends
- Check error rates

**Check deployment status:**

1. Visit Cloudflare Pages dashboard
2. Select cto4ai-blog project
3. View "Deployments" tab
4. See status: Building, Success, Failed

**Build notifications:**

- Cloudflare can send notifications on build success/failure
- Configure in Cloudflare Pages → Settings → Notifications

## Troubleshooting Failed Deployments

### Build Fails on Cloudflare but Works Locally

**Possible causes:**

1. **Environment variables missing**
   - Add them in Cloudflare dashboard

2. **Different Node version**
   - Check Node version locally: `node --version`
   - Set same version in Cloudflare or package.json

3. **Dependencies not installed**
   - Ensure package-lock.json is committed
   - Cloudflare uses `npm install` not `npm ci`

4. **Build output directory mismatch**
   - Verify build output is `dist/` in Cloudflare settings

### Build Succeeds but Site Broken

**Possible causes:**

1. **Paths incorrect for production**
   - Check base URL configuration
   - Verify asset paths are relative

2. **Environment-specific code**
   - Check if code assumes `NODE_ENV=development`

3. **Client-side JavaScript errors**
   - Check browser console on deployed site
   - Look for 404s on assets

### Preview Deployment Works but Production Fails

**Possible causes:**

1. **Different environment variables**
   - Production and Preview have separate env vars
   - Check both in Cloudflare dashboard

2. **Domain-specific issues**
   - DNS configuration
   - SSL certificate issues

## Best Practices

1. **Test locally first**
   - Always run `npm run build` before pushing
   - Pre-push hooks catch most issues

2. **Use preview deployments**
   - Push to feature branch first
   - Test preview URL
   - Merge to main only when ready

3. **Monitor build times**
   - If builds get slow, investigate why
   - Optimize images, dependencies, build process

4. **Keep dependencies updated**
   - But test updates in preview first
   - Don't update everything at once

5. **Check Cloudflare logs**
   - Always check build logs after deployment
   - Look for warnings even if build succeeds

## Related Documentation

- [Pre-Push Hooks](./pre-push-hooks.md) - Local validation before push
- [Prettier Auto-Formatting](./prettier-auto-formatting.md) - Avoid formatting failures
- [Deployment Environment Variables](../deployment/environment-variables.md) - Environment configuration
