# CTO4.AI Newsletter Launch Strategy

> **Last Updated**: 2025-08-22  
> **Status**: Pre-launch - Blog 95% complete, newsletter infrastructure pending  
> **Domain**: cto4.ai (purchased via Cloudflare)  
> **Blog Platform**: Astro (AstroWind theme)  
> **Repository**: https://github.com/jack4git/cto4ai-blog

## Executive Summary

Launch a click-to-send newsletter for cto4.ai that leverages existing Attio CRM contacts, establishes proper email infrastructure, and integrates seamlessly with the new Astro blog. The strategy maintains brand separation between craftycto.com (consulting) and cto4.ai (AI-focused content).

## Current Status ✅

- **Domain**: cto4.ai purchased and configured on Cloudflare
- **Blog Platform**: Astro blog ~95% complete, running locally
- **Branding**: Logo designed via Looka
- **Email Domain**: Google Workspace licensed for @craftycto.com
- **CRM**: Attio in use as contact database
- **Strategy**: Hybrid approach - craftycto.com for consulting, cto4.ai for blog/newsletter

## Architecture Overview

```text
Astro Blog (cto4.ai) → Cloudflare Pages → RSS feeds
                              │
                              ▼
                    Newsletter Platform (Beehiiv/Kit)
                    └── Webhook Integration → Attio CRM
                              │
                              ▼
                    Email events & subscriber sync
```

## Phase 1: Email Infrastructure Setup (Week 1)

### 1.1 Newsletter Platform Selection

**Decision Required**: Choose between Beehiiv and Kit (formerly ConvertKit)

| Feature | Beehiiv | Kit |
|---------|---------|-----|
| Pricing | Free up to 2,500 subs | Free up to 1,000 subs |
| RSS-to-email | ✅ Native | ✅ Via broadcast API |
| Webhook support | ✅ | ✅ |
| Custom domains | ✅ | ✅ |
| GDPR/compliance | ✅ | ✅ |
| API for automation | Limited | Extensive |

**Recommendation**: Start with **Beehiiv** for better free tier and native RSS support.

### 1.2 Email Authentication Setup

- [ ] Choose newsletter sender domain: **news.cto4.ai** (isolates reputation from main domain)
- [ ] Configure SPF for cto4.ai domain in Cloudflare DNS
- [ ] Add Beehiiv DKIM records once account created
- [ ] Set up DMARC policy starting with `p=none` for monitoring
- [ ] Verify Google Workspace SPF is properly configured for craftycto.com

### 1.3 Newsletter Account Setup

- [ ] Create Beehiiv account and complete KYC verification
- [ ] Configure publication settings:
  - Publication name: CTO4.AI
  - Sender name: Jack Ivers / CTO4.AI
  - Sender domain: news.cto4.ai
  - Reply-to: jack@craftycto.com (Google Workspace)
- [ ] Set up DNS records as provided by Beehiiv
- [ ] Verify domain authentication

## Phase 2: Attio Integration (Week 1-2)

### 2.1 Contact Preparation

- [ ] Add custom attribute in Attio: **Newsletter Status**
  - Values: `Targeted`, `Confirmed`, `Unsubscribed`, `Bounced`
- [ ] Add custom attribute: **Newsletter Source**
  - Values: `Seed List`, `Website Signup`, `Permission Pass`, `Other`
- [ ] Review and segment existing contacts:
  - Active clients
  - Past clients
  - Prospects
  - Professional network
- [ ] Tag seed contacts with `Newsletter Status: Assumed`
- [ ] Export seed list CSV with fields:
  - email
  - first_name
  - last_name
  - company
  - newsletter_status

### 2.2 Webhook Integration

- [ ] Deploy Cloudflare Worker for webhook handling:
  - Endpoint: `/webhooks/newsletter`
  - Handle: subscribe, unsubscribe, bounce events
  - Update Attio contact records via API
- [ ] Configure webhook URL in Beehiiv
- [ ] Set up webhook authentication/verification
- [ ] Test webhook with sample events

## Phase 3: Blog Integration (Week 2)

### 3.1 Subscription Forms

- [ ] Add newsletter signup component to Astro blog:
  - Sidebar widget
  - Post footer CTA
  - Dedicated `/subscribe` page
- [ ] Implement Cloudflare Turnstile for bot protection
- [ ] Style forms to match blog theme
- [ ] Add success/error handling and feedback

### 3.2 RSS Feed Configuration

- [ ] Verify RSS feeds are working:
  - `/rss.xml` (main feed)
  - `/blog/rss.xml` (blog posts)
  - `/micro/rss.xml` (micro posts)
- [ ] Test feed ingestion in Beehiiv
- [ ] Configure RSS-to-email template in Beehiiv
- [ ] Set digest frequency (weekly recommended initially)

### 3.3 Navigation Updates

- [ ] Add "Newsletter" link to blog navigation
- [ ] Update craftycto.com to link to cto4.ai blog
- [ ] Add "Services" link on cto4.ai pointing back to craftycto.com
- [ ] Implement 301 redirects from craftycto.com/blog/* to cto4.ai/*

## Phase 4: Permission Pass Campaign (Week 2-3)

### 4.1 Email Content

Create permission pass email with:
- Clear value proposition for the newsletter
- What content to expect (AI insights for CTOs)
- Frequency (weekly digest)
- Easy unsubscribe option
- Personal note explaining the transition

**Template Structure**:
```
Subject: Quick update about my new AI-focused newsletter

Hi [First Name],

You're receiving this because we've connected professionally through 
Crafty CTO. I'm launching a focused newsletter about AI for technology 
leaders at my new site, CTO4.AI.

What you'll get:
- Weekly insights on AI implementation
- Analysis of new AI tools and frameworks
- Strategic guidance for CTOs navigating AI adoption

If you'd like to receive these insights, no action needed - you're 
already on the list. If not, just click unsubscribe below.

Best,
Jack
```

### 4.2 Send Strategy

- [ ] Import seed list to Beehiiv (≤500 contacts for initial warm-up)
- [ ] Tag imports as "Permission Pass" campaign
- [ ] Schedule send for Tuesday/Wednesday 10am CT
- [ ] Monitor initial engagement metrics
- [ ] Process unsubscribes promptly
- [ ] Update Attio records based on engagement

## Phase 5: Production Deployment (Week 3)

### 5.1 Cloudflare Pages Setup

- [ ] Create Cloudflare Pages project for cto4ai-blog
- [ ] Configure build settings:
  - Build command: `npm run build`
  - Build output: `dist`
  - Node version: 20
- [ ] Set environment variables if needed
- [ ] Configure custom domain (cto4.ai)
- [ ] Enable automatic deployments from main branch

### 5.2 Pre-Launch Checklist

- [ ] Test all newsletter signup forms
- [ ] Verify webhook integration with test events
- [ ] Confirm RSS feeds are accessible
- [ ] Check email authentication (SPF, DKIM, DMARC)
- [ ] Review and test unsubscribe flow
- [ ] Prepare 3-5 blog posts for launch
- [ ] Test permission pass email with personal account

## Phase 6: Launch & Monitor (Week 4)

### 6.1 Launch Tasks

- [ ] Send permission pass campaign
- [ ] Announce newsletter on social media
- [ ] Add newsletter signup prompt to craftycto.com
- [ ] Monitor email deliverability metrics
- [ ] Track signup conversion rates

### 6.2 Success Metrics

**Week 1 targets**:
- Permission pass sent: 100-500 contacts
- Unsubscribe rate: <10%
- Bounce rate: <2%
- New signups: 10-20

**Month 1 targets**:
- Active subscribers: 200+
- Open rate: >40%
- Click rate: >7%
- Website signup conversion: >2%

## Ongoing Operations

### Weekly Workflow

1. **Content Creation** (Monday-Tuesday)
   - Write 2-3 blog posts
   - Prepare newsletter introduction

2. **Newsletter Preparation** (Wednesday)
   - Review RSS digest content
   - Write custom intro/outro
   - Preview and test

3. **Send & Monitor** (Thursday)
   - Send newsletter at 10am CT
   - Monitor initial metrics
   - Address any deliverability issues

### Monthly Tasks

- Review subscriber growth and engagement
- Clean bounced/unengaged contacts
- Update Attio segments
- Analyze content performance
- Plan next month's content calendar

## Technical Specifications

### API Integrations

**Attio API**:
- Endpoint: `https://api.attio.com/v2`
- Auth: Bearer token
- Update contact attributes on email events

**Beehiiv Webhooks**:
- Subscribe: Update Attio with `Newsletter Status: Confirmed`
- Unsubscribe: Update Attio with `Newsletter Status: Unsubscribed`
- Bounce: Update Attio with `Newsletter Status: Bounced`

### Cloudflare Worker Example

```javascript
export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const payload = await request.json();
    
    // Verify webhook signature
    if (!verifyWebhookSignature(request, payload, env.WEBHOOK_SECRET)) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Process event
    switch (payload.event_type) {
      case 'subscriber.created':
        await updateAttioContact(payload.email, 'Confirmed', env);
        break;
      case 'subscriber.deleted':
        await updateAttioContact(payload.email, 'Unsubscribed', env);
        break;
      case 'email.bounced':
        await updateAttioContact(payload.email, 'Bounced', env);
        break;
    }

    return new Response('OK', { status: 200 });
  }
};
```

## Risk Mitigation

### Deliverability Risks
- Start with small batches (<500)
- Monitor complaint rates via Google Postmaster
- Use double opt-in for new signups
- Maintain list hygiene (remove bounces/unengaged)

### Technical Risks
- Test all integrations in staging
- Have manual CSV export/import as backup
- Document all API endpoints and webhooks
- Keep local backups of subscriber lists

### Compliance
- Include unsubscribe link in all emails
- Honor unsubscribes immediately
- Document consent source for all contacts
- Prepare GDPR/CCPA compliance if needed

## Next Steps Priority

1. **Immediate** (This week):
   - [ ] Decide on newsletter platform (Beehiiv vs Kit)
   - [ ] Create account and complete setup
   - [ ] Configure email authentication

2. **Next Week**:
   - [ ] Set up Attio integration
   - [ ] Deploy blog to Cloudflare Pages
   - [ ] Add subscription forms

3. **Week 3**:
   - [ ] Send permission pass campaign
   - [ ] Monitor and optimize

## Resources

- [Beehiiv Documentation](https://docs.beehiiv.com)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages)
- [Attio API Reference](https://developers.attio.com)
- [Email Authentication Guide](https://www.cloudflare.com/learning/email-security/dmarc-dkim-spf/)

## Questions to Resolve

1. Newsletter frequency: Weekly vs bi-weekly?
2. Content mix: 100% original vs include curated links?
3. Paywall strategy: Free forever vs paid tier later?
4. Segment strategy: Single list vs role-based segments?
5. Automation level: Manual send vs fully automated?

---

*Document maintained by: Jack Ivers*  
*Last review: 2025-08-22*
