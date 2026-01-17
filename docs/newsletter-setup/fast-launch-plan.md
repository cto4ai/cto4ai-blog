# cto4.ai Fast Launch Plan

> **Status**: 🚀 **LAUNCHED AND OPERATIONAL**  
> **Target**: ~~Launch within 3-5 days~~ ✅ **ACHIEVED**  
> **Focus**: ~~Get cto4.ai live with content, redirects, and basic newsletter signup~~ ✅ **COMPLETE**  
> **Repository**: https://github.com/cto4ai/cto4ai-blog

## Current Status Summary ✅

### Completed Items:

- ✅ **Beehiiv account created** - Free tier active
- ✅ **Full email setup** - Sending from `cto4ai@mail.cto4.ai` with SPF/DKIM/DMARC
- ✅ **Subscribe forms working** - All 3 locations (modal, sidebar, /subscribe page)
- ✅ **Cloudflare Functions** - `/api/subscribe` and `/api/unsubscribe` endpoints
- ✅ **Attio integration** - Contacts synced to CRM workspace
- ✅ **craftycto.com redirects** - All blog URLs redirect to cto4.ai
- ✅ **Privacy Policy** - Page created with proper content and footer links
- ✅ **Site is LIVE** - cto4.ai fully operational

---

## 🎯 WHAT'S NEXT: Getting Subscribers

**The Situation**: Everything works perfectly, but we have 0 subscribers!

### Week 1: Seed the Newsletter (Get First 25 Subscribers)

#### 1. Personal Outreach (Target: 10-15 subscribers)

- [ ] **Email signature** - Add "Check out my new blog: cto4.ai/subscribe"
- [ ] **Direct invites** - Send personal emails to 20-30 close contacts
  - Subject: "I'm launching a newsletter about [topic]"
  - Personal note + direct subscribe link
  - Be specific about what they'll get
- [ ] **LinkedIn post** - Announce the launch to your network
  - Share what you'll cover
  - Include subscribe link
  - Ask for shares

#### 2. Leverage Your Content ✅ **IN PROGRESS** (Target: 5-10 subscribers)

- ✅ **Already publishing** - New content going live on cto4.ai
- [ ] **Add newsletter CTAs** to existing posts
  - Add signup box mid-post
  - Add CTA at end of each post
  - Mention newsletter in intro
- [ ] **Share posts strategically**
  - Post key excerpts on LinkedIn
  - Share in relevant communities
  - Send to friends who'd find it valuable

#### 3. Permission Pass Campaign (Target: 5-10 subscribers)

- [ ] **Export contacts** from email/LinkedIn (those who'd be interested)
- [ ] **Send permission email**:

  ```
  Subject: May I add you to my new newsletter?

  Hi [Name],

  I've just launched a newsletter about [topic] at cto4.ai.

  I think you'd find it valuable because [specific reason].

  Can I add you to the list? You can unsubscribe anytime.

  [Subscribe Button]
  ```

### Week 2: First Newsletter Send (At 25+ subscribers)

#### Before Sending:

- [ ] **Design template** in Beehiiv (keep it simple)
- [ ] **Write welcome email** for new subscribers
- [ ] **Plan content calendar** - What are next 4 issues about?

#### First Newsletter:

- [ ] **Subject line** - Make it compelling and specific
- [ ] **Content** - One main idea, well-executed
- [ ] **CTA** - Ask readers to share with one person
- [ ] **Send Tuesday or Thursday** morning (best open rates)

### Week 3-4: Build Momentum

- [ ] **Publish weekly** - Consistency builds trust
- [ ] **Cross-promote** - Share snippets on LinkedIn/Twitter
- [ ] **Guest post** - Write for another publication with bio link
- [ ] **Add testimonials** - Ask happy readers for quotes

### Success Metrics

- **Week 1**: 25 subscribers
- **Week 2**: 50 subscribers
- **Month 1**: 100 subscribers
- **Month 3**: 250 subscribers

---

## Launch Strategy: Soft Launch → Hard Launch

**Soft Launch (Day 1-4)**: Site goes live but isn't promoted. You're testing in production.
**Hard Launch (Day 5)**: Public announcement, social media, email to contacts.

This approach lets you fix issues with real-world usage before driving traffic.

## Launch Requirements

### Must Have for Launch ✅

1. **100% content migrated** and site fully functional with hosting ✅ **COMPLETE** - All content migrated to unified structure
2. **Redirects** from craftycto.com/blog → cto4.ai ✅ **COMPLETE** - All redirects working
3. **URL preservation** for existing blog posts ✅ **COMPLETE** - All posts at /p/[slug]
4. **Working newsletter signup** (can collect emails) ✅ **COMPLETE** - Beehiiv + Attio integrated via Cloudflare Functions

### Can Wait Until Post-Launch ⏳

- Automated Beehiiv → Astro content flow
- ~~Beehiiv ↔ Attio integrations~~ ✅ **COMPLETE** - Integrated via Cloudflare Functions
- Sending actual newsletters
- ~~Complex email authentication (DMARC, etc.)~~ ✅ **COMPLETE** - Email from cto4ai@mail.cto4.ai
- Permission pass campaign

---

## Phase 1: LAUNCH (Days 1-3)

### Day 1: Final Content & Deploy ✅ **COMPLETE**

- ✅ All blog posts migrated to unified structure
- ✅ Draft handling implemented (show in dev, hide in production)
- ✅ Images loading correctly
- ✅ RSS feeds working at `/rss.xml`
- ✅ Search functionality operational
- ✅ Mobile responsive design verified

#### Afternoon: Cloudflare Pages Deployment ✅ **COMPLETE**

Site is live at cto4.ai with:

- ✅ Cloudflare Pages deployment configured
- ✅ Custom domain active (cto4.ai and www.cto4.ai)
- ✅ SSL certificates provisioned
- ✅ Automatic deployments on push to main
- ✅ Preview deployments for branches

### Day 2: Newsletter Signup ✅ **COMPLETE**

#### Email Configuration ✅ **COMPLETE**

- ✅ **Beehiiv Account Created** - Free tier active
- ✅ **Custom Domain Email** - Sending from `cto4ai@mail.cto4.ai`
- ✅ **Full DNS Setup** - SPF, DKIM, DMARC configured in Cloudflare
- ✅ **Email Authentication** - All records verified and active

#### Newsletter Integration ✅ **COMPLETE**

- ✅ **Cloudflare Functions** - API endpoints at `/api/subscribe` and `/api/unsubscribe`
- ✅ **Beehiiv API Integration** - Subscribers added to publication ID `pub_f37e6b5e-b0f2-482f-a61e-6cdc97d0347e`
- ✅ **Attio CRM Integration** - Contacts synced to Attio workspace `ws_4Kgn5DM5JU`
- ✅ **Error Handling** - Comprehensive logging and duplicate detection

#### Newsletter Forms ✅ **COMPLETE**

- ✅ **Modal popup** - Appears on first visit to homepage
- ✅ **Sidebar widget** - Newsletter signup in right column on homepage
- ✅ **Dedicated `/subscribe` page** - Full page signup with privacy policy link
- ✅ **Privacy Policy Links** - "Unsubscribe any time. Privacy Policy" on all forms

### Day 3: Redirects & Cutover ✅ **COMPLETE**

#### Redirect Setup on craftycto.com ✅ **COMPLETE**

**Hugo Site Updates** (craftycto.com):

- ✅ Navigation menu updated - "Blog" link points to cto4.ai

**Cloudflare Pages Redirects** (\_redirects file deployed):

```
# RSS feeds (must come before wildcards)
/blog/index.xml   https://cto4.ai/rss.xml             301
/micro/index.xml  https://cto4.ai/rss.xml             301
/index.xml        https://cto4.ai/rss.xml             301

# Section indexes
/blog             https://cto4.ai/                     301
/micro            https://cto4.ai/                     301
/elsewhere        https://cto4.ai/                     301

# Blog posts (wildcards last)
/blog/*           https://cto4.ai/p/:splat             301
/micro/*          https://cto4.ai/p/:splat             301
/elsewhere/*      https://cto4.ai/p/:splat             301
```

- ✅ **\_redirects file deployed** to craftycto.com
- ✅ **All redirects working** - Blog posts, sections, and RSS feeds
- ✅ **RSS feed issue fixed** - Reordered rules so specific paths come before wildcards

#### Afternoon: Cross-linking ✅ **COMPLETE**

- ✅ Add "Services" link in cto4.ai header → /services
- ✅ Add "About" link in cto4.ai header → /about
- ✅ Update cto4.ai footer with company info (Company section with links)
- ✅ Add "Powered by Crafty CTO" attribution (Copyright notice in footer)

---

## Phase 1.5: VERIFICATION (Day 3-4)

### Pre-Launch Checklist ✅ **COMPLETE**

- ✅ **Content**: All posts migrated and rendering correctly
- ✅ **Images**: All images loading, no broken links
- ✅ **Navigation**: Menu works, categories/tags functional
- ✅ **Search**: Returns relevant results
- ✅ **Mobile**: Responsive on phone/tablet
- ✅ **Newsletter**: Signup form captures emails successfully
- ✅ **Redirects**: Old blog URLs redirect properly
- ✅ **RSS**: Feeds validate and contain recent posts
- ✅ **Performance**: PageSpeed score >90
- ✅ **SEO**: Meta tags, OG images, sitemap.xml present

### Soft Launch Testing ✅ **COMPLETE**

- ✅ Share with 2-3 trusted colleagues for feedback
- ✅ Test newsletter signup with different email addresses
- ✅ Verify redirects from various old blog posts
- ✅ Check Google Search Console for any errors
- ✅ Monitor Cloudflare Analytics for 404s

---

## Phase 2: POST-LAUNCH (Week 2+)

### Newsletter Infrastructure ✅ **MOSTLY COMPLETE**

#### Email Sending Setup ✅ **COMPLETE**

- ✅ Configure subdomain in Cloudflare (using `mail.cto4.ai`)
- ✅ Add Beehiiv DKIM records
- ✅ Update SPF record to include Beehiiv
- ✅ Set up DMARC monitoring
- ✅ Switch to custom domain email (`cto4ai@mail.cto4.ai`)
- ✅ Send test emails to verify deliverability

#### Full Newsletter Operations

- ✅ **COMPLETE** - Configure Beehiiv ↔ Attio webhook integration (via Cloudflare Functions)
- [ ] Design newsletter templates
- [ ] Plan permission pass campaign (see detailed plan below)
- [ ] Set up automated RSS-to-email digest
- [ ] Begin regular newsletter sends

---

## 📧 Permission Pass Campaign Plan

### Understanding Permission Pass vs Cold Outreach

**Permission Pass**: Re-engaging existing professional contacts who know you

- ✅ People you've worked with, met at events, or connected with professionally
- ✅ Contacts from your CRM who've engaged with Crafty CTO content
- ❌ NOT cold contacts or purchased lists

### Step 1: Prepare Your Contact List

#### From Attio CRM:

1. Export contacts with these criteria:
   - Has valid email address
   - Relationship: Active client, Past client, Professional network
   - Exclude: Competitors, Unsubscribed, Bounced emails
   - Target: 100-300 contacts for initial campaign

#### List Preparation:

```csv
email,first_name,last_name,company,relationship_type,last_interaction
john@example.com,John,Doe,TechCorp,Past Client,2024-06
```

#### Clean Your List:

- [ ] Remove any emails that bounced recently
- [ ] Remove anyone who explicitly asked not to receive emails
- [ ] Verify emails for obvious typos (use email validation tool)
- [ ] Tag all with "Permission Pass 2025" in Attio

### Step 2: Beehiiv Import Strategy for Permission Pass

#### How Permission Pass Works in Beehiiv

**Key Concept**: Import contacts as "Non-subscribed" status, not as active subscribers

#### Beehiiv Contact Statuses:

1. **Active Subscribers** - Count against limit, receive newsletters
2. **Non-subscribed/Pending** - Can receive limited emails (permission pass)
3. **Unsubscribed** - Were subscribers, opted out
4. **Cold** - Special status for re-engagement (plan dependent)

#### Import Process:

1. ✅ Complete Stripe Identity Verification (already done - 10,000 limit)

2. [ ] **Prepare CSV with status column**:

   ```csv
   email,first_name,status,source
   john@example.com,John,pending,attio_seed
   jane@company.com,Jane,pending,attio_seed
   ```

3. [ ] **Import to Beehiiv**:
   - Go to Audience → Import
   - Upload CSV
   - **CRITICAL**: Don't mark as "subscribed"
   - Add tag: "permission_pass_pending"
   - These contacts DON'T count against subscriber limit

4. [ ] **Create Permission Broadcast**:
   - Create new "Broadcast" (not regular newsletter)
   - Select segment: tag = "permission_pass_pending"
   - Include clear Beehiiv subscribe button
   - Beehiiv automatically converts clickers to "Active"

5. [ ] **Post-Campaign Cleanup** (after 7-14 days):
   - Active subscribers stay (those who clicked subscribe)
   - Delete non-responders from system
   - Update Attio CRM with results

#### Important Beehiiv Settings to Check:

- [ ] **Account Settings → Compliance**: Consider enabling double opt-in
- [ ] **Broadcast Settings**: Allow sending to non-subscribed
- [ ] **Import Settings**: Confirm auto-subscribe is OFF

#### Cost Advantage:

- Non-subscribed contacts DON'T count against your 2,500 free limit
- Can import 5,000 "pending" contacts
- Only pay for those who actually subscribe

### Step 3: Email Campaign Content

#### ⚠️ IMPORTANT: Use "Assume No" Approach (Explicit Opt-In Required)

Based on legal requirements and best practices, **DO NOT** auto-subscribe contacts. Instead, require explicit opt-in action.

#### Recommended Template (Modified from Claude Opus recommendation)

```
Subject: Quick question about my new AI newsletter

Hi [First Name],

I'm launching a focused newsletter about AI for CTOs at cto4.ai,
separate from my consulting work at Crafty CTO.

Since we've connected professionally, I wanted to invite you first.

[BIG BUTTON: Yes, Add Me to cto4.ai]

If you're not interested, no action needed - I won't add you.
But I'd love to have you along for the journey.

Best,
Jack

P.S. - This is a one-time invitation. I won't ask again.
```

#### For Recent Active Clients

```
Subject: Continuing our AI conversations at cto4.ai

Hi [First Name],

Following up on our recent work together, I'm launching cto4.ai -
a weekly newsletter focused on practical AI guidance for CTOs.

Would you like me to include you?

[YES, INCLUDE ME] [NO THANKS]
```

#### Why "Assume No" is Critical:

- **Legal compliance**: GDPR, CASL require explicit consent
- **Beehiiv policy**: Could suspend account for non-consented imports
- **Deliverability**: ISPs favor confirmed opt-in lists
- **Quality**: 100 engaged subscribers > 500 unengaged

### Step 4: Send Strategy

#### Timing:

- **Day**: Tuesday or Thursday
- **Time**: 10am recipient's timezone (or 10am CT if unknown)
- **Avoid**: Mondays, Fridays, weekends

#### Batching:

1. [ ] **Test batch** (5-10 contacts): Send to friendly contacts first
2. [ ] **Batch 1** (50 contacts): Most engaged past clients
3. [ ] **Batch 2** (50 contacts): Professional network
4. [ ] **Batch 3** (100 contacts): Broader network
5. [ ] Monitor metrics between batches (wait 24-48 hours)

### Step 5: Monitor & Respond

#### Success Metrics:

- **Good**: <5% unsubscribe rate
- **Acceptable**: 5-10% unsubscribe rate
- **Problem**: >10% unsubscribe rate (stop campaign, revise approach)

#### Track in Beehiiv:

- Open rate (expect 40-60% for warm list)
- Click rate (expect 5-10%)
- Unsubscribe rate
- Bounce rate (<2% expected)

#### Update Attio:

- [ ] Mark unsubscribes as "Newsletter Status: Unsubscribed"
- [ ] Mark bounces as "Newsletter Status: Bounced"
- [ ] Tag engaged opens as "Newsletter Status: Engaged"

### Step 6: Follow-Up Strategy

#### For Non-Opens (After 1 week):

- [ ] Send ONE follow-up to non-openers with different subject line
- [ ] More casual tone: "Missed you on the newsletter launch"
- [ ] Clear one-click unsubscribe if not interested

#### For Engaged Subscribers:

- [ ] Send thank you note
- [ ] Ask what topics they'd like covered
- [ ] Request they forward to one person who'd benefit

### Legal/Compliance Notes

✅ **You CAN** email:

- People you have an existing business relationship with
- Professional contacts who've given you their business card
- Past clients and active prospects

❌ **You CANNOT** email:

- Scraped or purchased email lists
- People who've explicitly opted out
- Personal email addresses without permission

**CAN-SPAM Requirements**:

- Include your physical mailing address ✅ (Beehiiv handles this)
- Include unsubscribe link ✅ (Beehiiv handles this)
- Honor unsubscribes within 10 days ✅ (Beehiiv handles this)
- Don't use deceptive subject lines

### Content & Growth

- ✅ **Publishing new posts** on cto4.ai (already in progress)
- [ ] Announce launch on social media
- ✅ **Regular publishing schedule** established

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

| Setting          | Value           | Notes                                         |
| ---------------- | --------------- | --------------------------------------------- |
| Build Command    | `npm run build` | Runs Astro build                              |
| Output Directory | `dist`          | Astro's default                               |
| Node Version     | `20.11.0`       | Set via environment variable (matches .nvmrc) |
| Install Command  | `npm ci`        | Auto-detected by Cloudflare                   |
| Preview Branches | All             | Every branch gets preview URL                 |

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

### Launch Success ✅ **ACHIEVED**

- ✅ **COMPLETE** - Content migration complete (unified structure)
- ✅ **COMPLETE** - Draft handling implemented (show in dev, hide in prod)
- ✅ **COMPLETE** - Site live at cto4.ai
- ✅ **COMPLETE** - All content accessible
- ✅ **COMPLETE** - Newsletter signups working (Beehiiv + Attio integrated)
- ✅ **COMPLETE** - No broken links/images
- ✅ **COMPLETE** - Redirects functioning (all craftycto.com/blog URLs redirect)
- ✅ **COMPLETE** - <2 second load time

### Bonus Goals

- 10+ newsletter signups in first week
- First new post published
- Social media announcement
- 100+ visitors in first week

---

_Focus: Ship now, perfect later._
