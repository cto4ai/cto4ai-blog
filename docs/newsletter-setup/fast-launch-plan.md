# CTO4.AI Fast Launch Plan

> **Target**: Launch within 3-5 days  
> **Focus**: Get cto4.ai live with content, redirects, and basic newsletter signup  
> **Repository**: https://github.com/jack4git/cto4ai-blog

## Launch Strategy: Soft Launch → Hard Launch

**Soft Launch (Day 1-4)**: Site goes live but isn't promoted. You're testing in production.
**Hard Launch (Day 5)**: Public announcement, social media, email to contacts.

This approach lets you fix issues with real-world usage before driving traffic.

## Launch Requirements

### Must Have for Launch ✅
1. **100% content migrated** and site fully functional with hosting ✅ **COMPLETE** - All content migrated to unified structure
2. **Redirects** from craftycto.com/blog → cto4.ai
3. **URL preservation** for existing blog posts
4. **Working newsletter signup** (can collect emails) - `/subscribe` page exists, needs Beehiiv integration

### Can Wait Until Post-Launch ⏳
- Automated Beehiiv → Astro content flow
- Beehiiv ↔ Attio integrations  
- Sending actual newsletters
- Complex email authentication (DMARC, etc.)
- Permission pass campaign

---

## Phase 1: LAUNCH (Days 1-3)

### Day 1: Final Content & Deploy

#### Morning: Final QA & Verification
- [x] ✅ **COMPLETE** - All blog posts migrated to unified `/src/data/content/[slug]/index.mdx` structure
- [x] ✅ **IMPLEMENTED** - Draft posts show in dev mode, hidden in production (via `import.meta.env.DEV`)
- [ ] Test production build locally: `npm run build && npm run preview`
- [ ] Check all images are loading correctly from new `/src/assets/images/content/[slug]/` structure
- [ ] Test internal links between posts
- [ ] Verify RSS feeds are generating:
  - `/rss.xml` (main feed with all posts)
- [ ] Test search functionality
- [ ] Check mobile responsiveness

#### Afternoon: Cloudflare Pages Deployment

**Deployment Strategy**: Use Cloudflare Pages direct integration (same as Hugo site) for fastest setup. GitHub Actions will continue to run CI tests, while Cloudflare Pages handles deployment.

**Go-Live Decision**: 
- **Option A: Stay Live** (Recommended) - Once deployed and tested, leave the site live at cto4.ai. This is a "soft launch" - the site is live but not promoted yet.
  - ✅ Start getting indexed by search engines
  - ✅ Can share with select people for feedback
  - ✅ Can start publishing new content immediately
  - ✅ No need to coordinate a second "launch"
  
- **Option B: Take Down** - Restrict access after testing until official launch
  - Use Cloudflare Access to password-protect
  - Or use a "coming soon" page
  - ❌ Adds complexity and delays indexing
  - ❌ Requires coordinating actual launch date

**Recommendation**: Stay live after Day 1. You're not announcing it yet, just making it available. Days 2-4 are for polishing while live.

- [ ] Push final code to GitHub main branch
- [ ] Create Cloudflare Pages project:
  1. Go to Cloudflare Pages dashboard
  2. Click "Create a project" → "Connect to Git"
  3. Select GitHub account and authorize if needed
  4. Choose `jack4git/cto4ai-blog` repository
  5. Configure build settings:
     ```
     Project name: cto4ai-blog
     Production branch: main
     Build command: npm run build
     Build output directory: dist
     Root directory: / (leave blank)
     Environment variables:
       NODE_VERSION: 20
     Optional environment variables:
       PUBLIC_SHOW_DRAFTS_IN_PREVIEW: true  # To show drafts in preview deployments
     ```
  6. Click "Save and Deploy"

- [ ] Wait for initial build to complete (~2-3 minutes)
- [ ] Verify preview URL works (e.g., `cto4ai-blog.pages.dev`)
- [ ] Add custom domain in Cloudflare Pages:
  - Go to project settings → Custom domains
  - Add `cto4.ai` (apex domain)
  - Add `www.cto4.ai` (will redirect to apex)
  - Cloudflare automatically handles DNS if domain is on Cloudflare
- [ ] Wait for SSL certificate provisioning (~5-10 minutes)
- [ ] Test production site thoroughly:
  - Check both cto4.ai and www.cto4.ai resolve
  - Verify SSL certificate is active (padlock icon)
  - Test a few blog posts load correctly

**Note**: Branch deployments will automatically create preview URLs for testing:
- Main branch → cto4.ai (production)
- Other branches → `[branch-name].cto4ai-blog.pages.dev` (preview)
- GitHub Actions will still run tests on PRs (quality gate)

### Day 2: Newsletter Signup

#### Understanding Email Sending with Beehiiv

**Key Point**: Beehiiv always sends the emails from their infrastructure. You're just choosing the "from" address.

| Option | From Address | Setup Time | When to Use |
|--------|-------------|------------|-------------|
| **Beehiiv Default** (Day 1-7) | jack@mail.beehiiv.com | 0 minutes | Fast launch, testing |
| **Your Subdomain** (Week 2+) | newsletter@news.cto4.ai | 30 minutes | Production, professional |

**Fast Launch Strategy**: Start with Beehiiv's default sender to get live immediately. Upgrade to custom subdomain after launch when you have time for DNS setup.

#### Quick Newsletter Solution
**Option A: Beehiiv Embedded Form** (Recommended - Fastest)
- [ ] Create Beehiiv account (free tier)
- [ ] Skip complex email authentication for now (use Beehiiv's default sender)
- [ ] Create embedded signup form in Beehiiv
- [ ] Add Beehiiv form script to Astro:
  ```html
  <!-- In Layout.astro or Newsletter component -->
  <script async src="https://embeds.beehiiv.com/attribution.js"></script>
  <div id="newsletter-form">
    <!-- Beehiiv embed code here -->
  </div>
  ```
- [ ] Style form to match site theme
- [ ] Test signup flow

**Option B: Simple Cloudflare Worker + KV** (If Beehiiv not ready)
- [ ] Create Worker to collect emails:
  ```javascript
  // Stores emails in KV until newsletter platform ready
  export default {
    async fetch(request, env) {
      if (request.method === 'POST') {
        const data = await request.formData();
        const email = data.get('email');
        const timestamp = new Date().toISOString();
        
        await env.SIGNUPS.put(email, JSON.stringify({
          email,
          timestamp,
          source: 'website'
        }));
        
        return new Response('Success!', { status: 200 });
      }
    }
  };
  ```
- [ ] Deploy Worker and connect KV namespace
- [ ] Add simple form to Astro site
- [ ] Export emails to newsletter platform later

#### Newsletter Modal/Forms Placement
- [ ] Modal popup (after 30 seconds or scroll 50%)
- [ ] Sidebar widget on blog posts
- [ ] Footer signup section
- [x] ✅ Dedicated `/subscribe` page already exists - needs Beehiiv integration

### Day 3: Redirects & Cutover

#### Morning: Redirect Setup on craftycto.com

**Hugo Site Updates** (craftycto.com):
- [ ] Update navigation menu - change "Blog" link to:
  ```html
  <a href="https://cto4.ai" target="_blank" rel="noopener">
    Blog <icon-external-link />
  </a>
  ```

**Cloudflare Pages Redirects** (_redirects file for craftycto.com):
```
# All blog posts now live at /p/[slug] on cto4.ai
# Old Hugo routes → New Astro routes

# Blog posts
/blog/*           https://cto4.ai/p/:splat             301
/micro/*          https://cto4.ai/p/:splat             301  
/elsewhere/*      https://cto4.ai/p/:splat             301

# Section indexes (all go to main page since no sections)
/blog             https://cto4.ai/                     301
/micro            https://cto4.ai/                     301
/elsewhere        https://cto4.ai/                     301

# RSS feeds  
/blog/index.xml   https://cto4.ai/rss.xml             301
/micro/index.xml  https://cto4.ai/rss.xml             301
/index.xml        https://cto4.ai/rss.xml             301
```

**Note**: All content types (blog, micro, elsewhere) now render at `/p/[slug]` on cto4.ai - a simpler, unified structure.

- [ ] Deploy _redirects file to craftycto.com Cloudflare Pages
- [ ] Test several blog post redirects
- [ ] Verify RSS feed redirects

#### Afternoon: Cross-linking
- [ ] Add "Services" link in cto4.ai header → craftycto.com/services
- [ ] Add "About" link in cto4.ai → craftycto.com/about  
- [ ] Update cto4.ai footer with company info
- [ ] Add "Powered by Crafty CTO" or similar attribution

---

## Phase 1.5: VERIFICATION (Day 3-4)

### Pre-Launch Checklist
- [ ] **Content**: All posts migrated and rendering correctly
- [ ] **Images**: All images loading, no broken links
- [ ] **Navigation**: Menu works, categories/tags functional
- [ ] **Search**: Returns relevant results
- [ ] **Mobile**: Responsive on phone/tablet
- [ ] **Newsletter**: Signup form captures emails successfully
- [ ] **Redirects**: Old blog URLs redirect properly
- [ ] **RSS**: Feeds validate and contain recent posts
- [ ] **Performance**: PageSpeed score >90
- [ ] **SEO**: Meta tags, OG images, sitemap.xml present

### Soft Launch Testing
- [ ] Share with 2-3 trusted colleagues for feedback
- [ ] Test newsletter signup with different email addresses
- [ ] Verify redirects from various old blog posts
- [ ] Check Google Search Console for any errors
- [ ] Monitor Cloudflare Analytics for 404s

---

## Phase 2: POST-LAUNCH (Week 2+)

### Newsletter Infrastructure (Can Wait)

#### Week 2: Email Sending Upgrade
- [ ] Configure `news.cto4.ai` subdomain in Cloudflare
- [ ] Add Beehiiv DKIM records (they'll provide these)
- [ ] Update SPF record to include Beehiiv
- [ ] Set up DMARC monitoring (p=none initially)
- [ ] Switch from jack@mail.beehiiv.com → newsletter@news.cto4.ai
- [ ] Send test emails to verify deliverability

#### Week 3+: Full Newsletter Operations  
- [ ] Configure Beehiiv ↔ Attio webhook integration
- [ ] Design newsletter templates
- [ ] Plan permission pass campaign
- [ ] Set up automated RSS-to-email digest
- [ ] Begin regular newsletter sends

### Content & Growth
- Publish first new post on cto4.ai
- Announce launch on social media
- Update email signatures to point to cto4.ai
- Begin regular publishing schedule

### Technical Debt
- Optimize images with Astro Image component
- Implement view transitions
- Add commenting system (if desired)
- Set up proper analytics (Plausible/Fathom)
- Configure CDN/caching rules

---

## Deployment Architecture

### CI/CD Pipeline
```
GitHub Push/PR → GitHub Actions (CI) → Tests Pass → Cloudflare Pages (CD) → Live Site
                  ├── Run build test                    ├── Auto-deploy main → cto4.ai
                  ├── Check code quality                 └── Preview deploys → *.pages.dev
                  └── Matrix testing (Node 20,22)
```

### Why This Approach
- **GitHub Actions**: Runs quality checks (CI) without blocking deployment
- **Cloudflare Pages**: Handles deployment (CD) with automatic preview URLs
- **Benefit**: Simple setup like Hugo site, but with test coverage
- **Migration Path**: Can switch to GitHub Actions deployment later if needed

### Build Configuration Details
| Setting | Value | Notes |
|---------|-------|-------|
| Build Command | `npm run build` | Runs Astro build |
| Output Directory | `dist` | Astro's default |
| Node Version | `20.11.0` | Set via environment variable (matches .nvmrc) |
| Install Command | `npm ci` | Auto-detected by Cloudflare |
| Preview Branches | All | Every branch gets preview URL |

---

## Emergency Fallback Plans

### If Cloudflare Pages has issues:
- **Backup**: Deploy to Netlify (already has netlify.toml)
- **Process**: Push to GitHub, Netlify auto-deploys
- **DNS**: Update cto4.ai DNS to point to Netlify

### If newsletter signup breaks:
- **Backup**: Google Form embedded in iframe
- **Process**: Collect emails, manually import later
- **Simple**: Just display email address: "Email jack@craftycto.com to subscribe"

### If redirects don't work:
- **Backup**: Keep old blog content live temporarily
- **Add notice**: "We've moved! Visit cto4.ai for new content"
- **Fix forward**: Implement redirects via Cloudflare Workers

---

## Day-by-Day Summary

**Day 1**: 
- Morning: Final content QA
- Afternoon: Deploy to Cloudflare Pages

**Day 2**:
- Morning: Set up newsletter signup (Beehiiv or Worker)
- Afternoon: Test everything on production

**Day 3**:
- Morning: Configure redirects on craftycto.com
- Afternoon: Cross-linking and final checks

**Day 4**: 
- Soft launch to friendlies
- Monitor and fix any issues

**Day 5**: 
- Public announcement
- First new post on cto4.ai

---

## Quick Reference Commands

### Deploy to Cloudflare Pages
```bash
# First time setup
npm install
npm run build

# In Cloudflare Pages:
# - Connect GitHub repo
# - Set build command: npm run build
# - Set output directory: dist
```

### Test Redirects
```bash
# Test redirect chains
curl -I https://craftycto.com/blog/some-post
# Should return 301 with Location: https://cto4.ai/p/some-post

# Test different content types all go to /p/
curl -I https://craftycto.com/micro/quick-note
# Should return 301 with Location: https://cto4.ai/p/quick-note
```

### Monitor After Launch
```bash
# Check for 404s in Cloudflare Analytics
# Monitor Web Analytics → Pages → Status Codes

# Verify RSS feeds
curl https://cto4.ai/rss.xml | head -20
```

---

## Success Metrics (Day 5)

### Launch Success
- ✅ **READY** - Content migration complete (unified structure)
- ✅ **READY** - Draft handling implemented (show in dev, hide in prod)
- ✅ Site live at cto4.ai
- ✅ All content accessible
- ✅ Newsletter signups working
- ✅ No broken links/images
- ✅ Redirects functioning
- ✅ <2 second load time

### Bonus Goals
- 10+ newsletter signups in first week
- First new post published
- Social media announcement
- 100+ visitors in first week

---

*Focus: Ship now, perfect later.*
