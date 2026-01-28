# Checkpoint: Permission Pass One-Click Subscribe

**Date:** 2026-01-28 08:56
**Status:** IN PROGRESS
**Branch:** feature/one-click-subscribe

## Objective

Enable one-click newsletter subscription from Attio permission pass emails, bypassing double opt-in for true single-click experience.

## Changes Made

**Modified Files:**

- [functions/api/subscribe.js](../../functions/api/subscribe.js) - Added GET handler for one-click subscribe

**Commits:**

- `fba818c` feat: Add one-click subscribe for permission pass emails

## Research Findings

**Attio Email Capabilities:**

- Basic text formatting only (bold, italic via highlight)
- No HTML buttons or custom styling
- Variables available via `{` key: First name, Last name, Company name, **Email address**, Phone, City, State, Country, Postcode
- Sends via connected Gmail/Outlook account
- Mass send limit: 10 (free) / 50 (paid) recipients

**Beehiiv Magic Links:**

- Require platform-specific merge tags (e.g., `{{email}}` for Mailchimp)
- Attio doesn't support these merge tags
- Magic links still show confirmation page (not truly one-click)

**Beehiiv API Create Subscription:**

- `double_opt_override: "off"` - skips confirmation email for true one-click
- `reactivate_existing: true` - allows re-subscribing if they previously unsubscribed
- `utm_source` - tracks subscription source

## Implementation

GET endpoint at `/api/subscribe?email=xxx`:

1. Accepts email as URL parameter
2. Calls Beehiiv API with `double_opt_override: "off"`
3. Updates Attio with `newsletter_source: "Permission Pass"`
4. Redirects to `/subscribe-success`

**Attio Email Link Format:**

```
https://cto4.ai/api/subscribe?email={Email address}
```

## Next Steps

1. Create PR to merge into main
2. Deploy to Cloudflare Pages
3. Test with a real Attio email
4. Verify Attio shows "Permission Pass" as source

## Notes

- Existing POST handler for website form unchanged
- GET without email param still redirects to homepage
- Error redirects to `/?subscribe_error=1` (could add error page later)

## Sources

- [Attio Send Emails Help](https://attio.com/help/reference/email-calendar/send-emails-in-attio)
- [Attio PandaDoc Integration](https://attio.com/help/apps/other-apps/pandadoc-app) - confirms Email address variable available
- [Beehiiv Create Subscription API](https://developers.beehiiv.com/api-reference/subscriptions/create)
- [Beehiiv Magic Links](https://www.beehiiv.com/features/magic-links)
