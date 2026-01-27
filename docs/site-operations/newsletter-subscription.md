# Newsletter Subscription System

The site uses a Cloudflare Pages Function to handle newsletter subscriptions, integrating with two external services:

1. **Beehiiv** - Newsletter platform (primary)
2. **Attio** - CRM for subscriber tracking

## Architecture

```
User submits form → /api/subscribe (Cloudflare Function)
                         ↓
                    Beehiiv API (create subscription)
                         ↓ (if successful)
                    Attio API (create/update person record)
                         ↓
                    Redirect to /subscribe-success
```

## Function Location

`functions/api/subscribe.js`

## Environment Variables

Set in Cloudflare Pages → Settings → Environment variables:

| Variable          | Description                |
| ----------------- | -------------------------- |
| `BEEHIIV_API_KEY` | Beehiiv API key (64 chars) |
| `ATTIO_API_KEY`   | Attio API key              |

## API Integrations

### Beehiiv

**Endpoint**: `POST https://api.beehiiv.com/v2/publications/{pub_id}/subscriptions`

**Publication ID**: `pub_03d62407-3f9e-4c6f-8d95-d7da8f9e80fe`

**Request Body**:

```json
{
  "email": "user@example.com",
  "reactivate_existing": false,
  "send_welcome_email": true
}
```

**Success Response**: HTTP 201 with subscription data

### Attio

**Endpoint**: `PUT https://api.attio.com/v2/objects/people/records?matching_attribute=email_addresses`

Uses PUT to "assert" (create or update) a person record.

**Request Body**:

```json
{
  "data": {
    "values": {
      "email_addresses": [{ "email_address": "user@example.com" }],
      "newsletter_status": "Subscribed",
      "newsletter_source": "Website"
    }
  }
}
```

**Important**: Select field values must exactly match existing options in Attio:

| Field               | Valid Options                                              |
| ------------------- | ---------------------------------------------------------- |
| `newsletter_status` | Not Subscribed, Subscribed, Unsubscribed, Bounced, Pending |
| `newsletter_source` | Website, Permission..., Event, Import, API                 |

**Success Response**: HTTP 200 with person record data

## Debugging

### Where to Find Logs

| Service        | Log Location                             | What's Logged                                                            |
| -------------- | ---------------------------------------- | ------------------------------------------------------------------------ |
| **Cloudflare** | Deployments → Functions → Real-time Logs | Full request/response, your console.log output, errors                   |
| **Beehiiv**    | Dashboard → Audience → Subscribers       | Subscription status, but not API call history                            |
| **Attio**      | No native API logs                       | Record changes visible on individual records, but no API request history |

**Note**: Attio does not have an audit log or API request viewer for general API token usage. Their Developer Dashboard logs (build.attio.com) only work for apps built with their SDK, not direct API calls. For debugging API issues, Cloudflare logs are your primary tool.

### Accessing Cloudflare Logs

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select the `cto4ai` Pages project
3. Click **Deployments** in left sidebar
4. Click **Functions** tab
5. Click **Real-time Logs** button
6. Click **Begin log stream**
7. Submit a test subscription to trigger logs

### Reading Log Output

The function logs key information at each step:

```
Email submitted: user@example.com
API Key exists: true
API Key length: 64
Beehiiv API response status: 201
Beehiiv API response: {...}
Updating Attio for: user@example.com
Attio response status: 200
Attio response: {...}
```

### Common Errors

#### Beehiiv 400/401

- Check `BEEHIIV_API_KEY` is set correctly
- Verify publication ID is correct

#### Attio 400 - "Cannot find select option"

- The select field value doesn't match an existing option
- Check Attio workspace for valid options
- Update code to use exact option title

Example error:

```json
{
  "status_code": 400,
  "errors": [
    {
      "message": "Cannot find select option with title \"Invalid Option\"."
    }
  ]
}
```

**Fix**: Update the value in `subscribe.js` to match an existing Attio option.

#### Attio 401

- Check `ATTIO_API_KEY` is set correctly
- Verify API token has write permissions for People object

### Error Handling

- Beehiiv errors: Function returns HTTP 500 with error message
- Attio errors: Logged but don't fail the subscription (user still gets subscribed to newsletter)

## Testing

1. Start Cloudflare real-time log stream
2. Submit test email via the homepage form
3. Check logs for success/error status
4. Verify in Beehiiv dashboard: Audience → Subscribers
5. Verify in Attio: Search for email in People

## Maintenance

### Adding New Attio Fields

1. Create the attribute in Attio workspace
2. Note the exact slug (lowercase with underscores)
3. Add to the request body in `subscribe.js`
4. For select fields, use exact option titles

### Updating Select Options

If you rename or add options in Attio:

1. Update the corresponding value in `subscribe.js`
2. Deploy to Cloudflare
3. Test with real-time logs
