# CTO4.AI Content Routes Plan

## Overview
CTO4.AI will be a newsletter-first blog site focused on AI and technology leadership, with Beehiiv integration for newsletter management. The site will maintain a simple, clean URL structure inspired by successful newsletter platforms like Substack.

## URL Structure

### Primary Content Routes

#### 1. Posts (All Content Types)
- **Pattern**: `/p/[slug]`
- **Examples**:
  - `/p/early-gpt-5-impressions` (blog post)
  - `/p/weekly-ai-roundup-aug-2025` (micro post)
  - `/p/must-read-ml-paper` (elsewhere link)
  - `/p/sam-altman-on-agi` (quote)
- **Rationale**: Follows Substack's proven pattern. Simple, clean, content-type agnostic.

#### 2. Homepage
- **Route**: `/`
- **Features**:
  - Newsletter signup hero/modal (prominent CTA)
  - Latest posts feed (newest first)
  - Featured/pinned post at top
  - Simple pagination

#### 3. Archive
- **Route**: `/archive`
- **Features**:
  - Chronological list of all posts
  - Filter by year/month
  - Search functionality
  - Content type indicators (icon/badge)

#### 4. Services
- **Route**: `/services`
- **Purpose**: CTO consulting services overview
- **Features**:
  - Service descriptions
  - Clear CTAs linking to craftycto.com
  - "For detailed information and booking, visit [CraftyCTO.com](https://craftycto.com)"

#### 5. About
- **Route**: `/about`
- **Features**:
  - Author bio
  - Newsletter description
  - Contact information
  - Social links

### Secondary Routes

#### 6. Newsletter Subscribe
- **Route**: `/subscribe`
- **Purpose**: Dedicated signup page with value proposition
- **Integration**: Beehiiv embed or API

#### 7. Welcome/Confirmation
- **Route**: `/welcome`
- **Purpose**: Post-subscription confirmation and onboarding

#### 8. Search
- **Route**: `/search`
- **Features**: Full-text search using Pagefind

### Technical Implementation

#### URL Generation Logic
Update `/src/utils/permalinks.ts`:
```typescript
// Line 76-78 modification
case 'post':
  permalink = createPath('p', trimSlash(slug));
  break;
```

#### Config Updates
Update `/src/config.yaml`:
```yaml
apps:
  blog:
    post:
      permalink: '/p/%slug%'  # Substack-style URLs
```

### Navigation Structure

**Primary Navigation:**
1. Home (logo/brand)
2. Archive
3. Services
4. About
5. Subscribe (CTA button)

**Footer Navigation:**
- Archive
- Services
- About
- RSS Feed
- Contact
- Privacy/Terms (if needed)
- Powered by CTO4.AI

### Content Organization

#### Content Collections (unchanged)
- `posts` - Long-form articles
- `micro` - Short updates
- `elsewhere` - Curated links
- `quote` - Notable quotes

All content types share the same URL pattern (`/p/[slug]`) but can be visually differentiated in listings with:
- Icons (📝 Article, 🔗 Link, 💭 Quote, 📌 Note)
- Badges or tags
- Different card styles

### Newsletter Integration

#### Homepage Newsletter Signup
- **Position**: Above the fold
- **Style**: Either:
  - Hero section with email input
  - Modal popup (with appropriate timing/triggers)
- **Copy**: Focus on value proposition
  - "AI insights for technology leaders"
  - "Weekly analysis of AI's impact on software development"

#### Beehiiv Integration Points
1. Subscribe forms (homepage, /subscribe)
2. Past issues archive (potentially)
3. Subscriber-only content (future consideration)

### SEO & Social Optimization

#### Meta Tags Strategy
- Open Graph optimized for social sharing
- Twitter Cards for all posts
- Canonical URLs: `https://cto4.ai/p/[slug]`
- Newsletter-specific meta tags

#### Sitemap
- All `/p/*` posts
- Static pages (/services, /about, /archive)
- RSS feed at `/rss.xml`

### Migration Considerations

#### Content Migration from CraftyCTO
1. Map existing URLs to new structure:
   - `/blog/[slug]` → `/p/[slug]`
   - `/micro/[slug]` → `/p/[slug]`
   - `/elsewhere/[slug]` → `/p/[slug]`
   - `/quote/[slug]` → `/p/[slug]`

2. Maintain slug consistency for SEO

3. Set up redirects on CraftyCTO for migrated content

### Performance & UX

#### Key Features
- Fast page loads (static generation)
- Smooth navigation
- Mobile-first responsive design
- Accessible search
- Newsletter signup shouldn't block content
- Clear reading experience

### Analytics & Tracking

- Google Analytics 4
- Newsletter signup conversion tracking
- Popular content tracking
- Read time estimates on posts

## Implementation Priority

### Phase 1: Core Routes
1. Update permalink structure to `/p/[slug]`
2. Create Services page
3. Update homepage with newsletter focus
4. Implement Archive page

### Phase 2: Newsletter Integration
1. Beehiiv integration
2. Subscribe/Welcome pages
3. Newsletter signup components

### Phase 3: Enhancement
1. Search improvements
2. Related posts
3. Content filtering in Archive
4. Social sharing optimization

## Success Metrics

- Newsletter signup conversion rate
- Content engagement (time on page)
- Return visitor rate
- Services page → CraftyCTO clicks
- Social sharing metrics

## Notes

- Simple is better - avoid over-categorization
- Newsletter signup should be prominent but not intrusive
- Services page bridges to corporate site
- Content quality over complex taxonomy
- Mobile experience is critical