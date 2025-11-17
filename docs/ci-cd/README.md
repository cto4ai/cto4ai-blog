# CI/CD Documentation

This directory contains documentation for the cto4ai-blog CI/CD pipeline.

## Quick Start

**First time setup:**

1. Install the Prettier VSCode extension
2. Format-on-save is already enabled in project settings
3. Run `npm install` to set up pre-push hooks

**Before every push:**

```bash
# Run checks locally
npm run check

# Auto-fix formatting
npm run fix:prettier

# Test the build
npm run build
```

**If push is blocked:**

```bash
# Read the error message
# Fix the issues
# Run checks again
npm run check
```

## Documentation Files

### [prettier-auto-formatting.md](./prettier-auto-formatting.md)

How to set up automatic code formatting to avoid CI failures.

**Topics:**

- VSCode format-on-save setup (recommended)
- Manual formatting commands
- Pre-commit hooks for auto-formatting
- Troubleshooting formatting issues

**When to read:** Before you start working on the project, or when you get Prettier errors.

### [pre-push-hooks.md](./pre-push-hooks.md)

What validation runs before your code can be pushed to GitHub.

**Topics:**

- What runs in pre-push hooks
- Common failure causes and fixes
- Manual testing commands
- How to interpret error messages

**When to read:** When your push is blocked, or to understand what checks run locally.

### [ci-cd-pipeline.md](./ci-cd-pipeline.md)

The complete CI/CD pipeline from local development to production deployment.

**Topics:**

- Pipeline stages (local → GitHub → Cloudflare)
- Cloudflare Pages build and deployment
- Preview vs production deployments
- Troubleshooting deployment failures
- Monitoring and rollback procedures

**When to read:** To understand the full deployment process, or when deployments fail.

## Pipeline Overview

```
┌─────────────────────────────────────────────────────────────┐
│ 1. LOCAL: Your Machine                                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  You run: git push                                           │
│       ↓                                                      │
│  Pre-push hook runs:                                         │
│    • npm run check (Astro, ESLint, Prettier)                │
│    • npm run build                                           │
│       ↓                                                      │
│  If passes: Push to GitHub                                   │
│  If fails: Push blocked, fix issues                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. GITHUB: Version Control                                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Code pushed to GitHub repository                            │
│  Branch: main (or feature branch)                            │
│       ↓                                                      │
│  GitHub Actions (if configured):                             │
│    • Additional CI checks                                    │
│    • Tests, security scans, etc.                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. CLOUDFLARE PAGES: Build & Deploy                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Cloudflare detects push to main                             │
│       ↓                                                      │
│  Build process:                                              │
│    • npm install                                             │
│    • npm run build                                           │
│       ↓                                                      │
│  If branch = main:                                           │
│    → Deploy to production (cto4.ai)                          │
│  If branch ≠ main:                                           │
│    → Create preview deployment                               │
│                                                              │
│  Result: Live site on Cloudflare's global CDN               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Common Workflows

### Normal Development Workflow

```bash
# 1. Make changes to code
# 2. Files auto-format on save (if VSCode configured)
# 3. Test locally
npm run dev

# 4. Check everything passes
npm run check

# 5. Push (pre-push hooks run automatically)
git add .
git commit -m "Your commit message"
git push

# 6. Cloudflare builds and deploys automatically
```

### Fixing a Blocked Push

```bash
# Push fails with error
git push

# Read error message - example: Prettier formatting issue

# Fix it
npm run fix:prettier

# Verify fix
npm run check

# Try again
git push
```

### Testing Before Merging to Main

```bash
# Create feature branch
git checkout -b feature/my-change

# Make changes, commit
git add .
git commit -m "Implement feature"

# Push to feature branch
git push -u origin feature/my-change

# Cloudflare creates preview deployment
# Test preview URL before merging

# If good, merge to main
git checkout main
git merge feature/my-change
git push  # Deploys to production
```

## Quick Reference

### Commands

```bash
# Check everything
npm run check

# Individual checks
npm run check:astro
npm run check:eslint
npm run check:prettier

# Fix formatting
npm run fix:prettier

# Build for production
npm run build

# Development server
npm run dev

# Preview production build
npm run preview
```

### File Locations

- **VSCode settings:** `.vscode/settings.json`
- **Prettier config:** `.prettierrc.cjs`
- **ESLint config:** `eslint.config.js`
- **Astro config:** `astro.config.ts`
- **Git hooks:** `.git/hooks/pre-push`
- **Build output:** `dist/`

### URLs

- **Production:** https://cto4.ai
- **Preview deployments:** `https://<commit-hash>.cto4ai-blog.pages.dev`
- **Cloudflare dashboard:** https://dash.cloudflare.com

## Getting Help

**If pre-push hooks fail:**

1. Read the error message - it tells you exactly what's wrong
2. Check [pre-push-hooks.md](./pre-push-hooks.md) for common issues
3. Run `npm run check` to see all failures
4. Fix issues and try again

**If Cloudflare build fails:**

1. Check build logs in Cloudflare Pages dashboard
2. Read [ci-cd-pipeline.md](./ci-cd-pipeline.md) troubleshooting section
3. Compare error with local `npm run build`

**If formatting issues keep happening:**

1. Set up format-on-save: [prettier-auto-formatting.md](./prettier-auto-formatting.md)
2. Install Prettier VSCode extension
3. Enable in VSCode settings

## Related Documentation

- [CLAUDE.md](../../CLAUDE.md) - Main project guide
- [docs/deployment/](../deployment/) - Deployment configuration
- [docs/README.md](../README.md) - Documentation overview
