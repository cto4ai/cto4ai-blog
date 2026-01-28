# Checkpoint: Newsletter Operations Documentation

**Date:** 2026-01-28 08:09
**Status:** COMPLETED
**Branch:** main

## Objective

Document newsletter operations including subscription API, sending workflows, and Beehiiv integration. Debug and fix Attio API errors.

## Changes Made

**Created Files:**

- [docs/site-operations/README.md](../site-operations/README.md) - Index for site operations docs
- [docs/site-operations/newsletter-subscription.md](../site-operations/newsletter-subscription.md) - Technical docs for `/api/subscribe` endpoint, Beehiiv + Attio integration, debugging with Cloudflare logs
- [docs/site-operations/sending-newsletters.md](../site-operations/sending-newsletters.md) - How-to guide for Beehiiv: 5-tab flow, timing, best practices
- [docs/site-operations/newsletter-todo.md](../site-operations/newsletter-todo.md) - Checklist for launching newsletters

**Modified Files:**

- [functions/api/subscribe.js](../../functions/api/subscribe.js) - Fixed Attio field values

**Commits:**

- `d7400f3` - docs: Update newsletter docs with timing details and remove completed todo
- `0a08378` - docs: Add site-operations documentation for newsletter workflow
- `2c11e05` - fix: Update Attio newsletter_source to match existing option
- `0165d06` - fix: Update Attio newsletter_status to use existing option

## Key Findings

**Attio API Fixes:**

- Changed `newsletter_status: 'Confirmed'` → `'Subscribed'` (must match existing dropdown options)
- Changed `newsletter_source: 'Website Signup'` → `'Website'` (must match existing dropdown options)
- Attio has no native API logs; use Cloudflare real-time logs for debugging

**Beehiiv Clarifications:**

- Launch Plan (free tier): 482/2,500 subscribers, no RSS-to-Send
- Welcome email already configured
- Uses Beehiiv's corporate address (228 Park Ave S) for CAN-SPAM compliance
- Double opt-in is global setting, not import-specific

**Permission Pass Strategy:**

- Documented strategy is "Assume No" (explicit opt-in required)
- Beehiiv requires imported contacts to have "knowingly opted in"
- Options: (1) Enable double opt-in temporarily during import, (2) Send permission pass from outside Beehiiv with subscribe link, (3) Contact Beehiiv support

**Timing Recommendations:**

- Tuesday/Wednesday 10am CT best for B2B/CTO audience
- Beehiiv sends based on your timezone, not recipients'

## Notes

- Logo assets: `src/assets/images/logos/noBgWhite.svg` and `noBgColor.svg`
- Previous Claude advice about importing as "non-subscribed" could not be verified
- Beehiiv designed for permission-based newsletters, not cold outreach

---

**Reference Docs:**

- [Permission Pass Strategy](../newsletter-setup/permission-pass-email-strategy.md)
- [Fast Launch Plan](../newsletter-setup/fast-launch-plan.md)
