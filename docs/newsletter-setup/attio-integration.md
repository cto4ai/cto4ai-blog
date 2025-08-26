# Attio CRM Integration Setup

## Overview
This document describes how to configure Attio CRM to work with the CTO4.AI newsletter subscription system.

## Required Custom Attributes

Before the integration will work properly, you need to create the following custom attributes in your Attio workspace:

### 1. Newsletter Status
- **Display Name**: Newsletter status
- **Slug (API ID)**: `newsletter_status`
- **Type**: Single Select
- **Options**:
  - `Targeted` - Contact identified for newsletter but not yet subscribed
  - `Confirmed` - Active newsletter subscriber
  - `Unsubscribed` - Opted out of newsletter
  - `Bounced` - Email delivery failed

### 2. Newsletter Source
- **Display Name**: Newsletter source  
- **Slug (API ID)**: `newsletter_source`
- **Type**: Single Select
- **Options**:
  - `Website Signup` - Subscribed via website forms
  - `Seed List` - Initial import from existing contacts
  - `Permission Pass` - Opted in via permission pass campaign
  - `Other` - Other sources

**Note**: The API uses the slug format (lowercase with underscores) while the UI shows the display name (with spaces and capitalization).

## How to Add Custom Attributes in Attio

1. Go to your Attio workspace
2. Navigate to **Settings** → **Objects** → **People**
3. Click **Add attribute**
4. Configure each attribute as described above
5. Save changes

## API Configuration

### Required API Permissions
Your Attio API key needs the following scopes:
- `record_permission:read-write` - To create and update person records
- `object_configuration:read` - To read attribute configurations

### How to Generate API Key
1. Go to **Workspace Settings** (you must be an admin)
2. Click the **Developers** tab
3. Click **+ New access token**
4. Name it: "CTO4.AI Newsletter Integration"
5. Set the required scopes (see above)
6. Copy the token and add it to Cloudflare Pages environment variables as `ATTIO_API_KEY`

## Integration Flow

### Website Subscription
When someone subscribes via the website:
1. Email is added to Beehiiv newsletter platform
2. Person record is created/updated in Attio with:
   - Email address
   - `newsletter_status: "Confirmed"`
   - `newsletter_source: "Website Signup"`

### Future Webhook Integration
The webhook handler (to be implemented) will update Attio when:
- Someone unsubscribes → `newsletter_status: "Unsubscribed"`
- Email bounces → `newsletter_status: "Bounced"`

## Testing the Integration

1. Add `ATTIO_API_KEY` to Cloudflare Pages environment variables
2. Subscribe with a test email on the website
3. Check Cloudflare Function logs for Attio response
4. Verify the person record is created/updated in Attio with correct attributes

## Troubleshooting

### Common Issues

**"Cannot find attribute with slug/ID" error**
- Make sure the attribute slugs are lowercase with underscores (e.g., `newsletter_status` not `Newsletter status`)
- The API requires the slug format, not the display name

**"Unrecognized key(s) in object: 'original_email_address'" error**
- Only use `email_address` in the email_addresses array
- Do not include `original_email_address` field

**Attio update fails with 401**
- API key (access token) is invalid or missing required permissions
- Ensure the token has `record_permission:read-write` scope

**Person not created in Attio**
- Check Cloudflare Function logs for error messages
- Verify the ATTIO_API_KEY is correctly set in environment variables
- Confirm the custom attributes exist in Attio with the correct slugs

## Notes

- Attio updates are non-blocking - if Attio fails, the newsletter subscription still succeeds
- Email addresses are used as the unique identifier for matching existing persons
- The integration uses PUT (assert) method to create or update records