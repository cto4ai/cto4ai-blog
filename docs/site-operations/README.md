# Site Operations

Documentation for cto4.ai backend operations, APIs, and debugging procedures.

## Newsletter Operations

| Document                                                | Description                                                       |
| ------------------------------------------------------- | ----------------------------------------------------------------- |
| [Newsletter Todo](./newsletter-todo.md)                 | Checklist for launching and maintaining newsletters               |
| [Sending Newsletters](./sending-newsletters.md)         | How to create and send newsletters in Beehiiv                     |
| [Newsletter Subscription](./newsletter-subscription.md) | Technical: `/api/subscribe` endpoint, Beehiiv + Attio integration |

## Cloudflare Pages Functions

The site uses Cloudflare Pages Functions for serverless backend functionality.

| Function         | Path                                 | Description                                                 |
| ---------------- | ------------------------------------ | ----------------------------------------------------------- |
| `/api/subscribe` | [Docs](./newsletter-subscription.md) | Handles form submissions, integrates with Beehiiv and Attio |

## Environment Variables

All secrets are stored in Cloudflare Pages environment variables (not in the repository):

- `BEEHIIV_API_KEY` - Newsletter platform API key
- `ATTIO_API_KEY` - CRM API key

## Accessing Cloudflare Dashboard

1. [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select **cto4ai** Pages project
3. Key sections:
   - **Deployments** → View deploy history and function logs
   - **Settings** → Environment variables
   - **Analytics** → Traffic and performance data

## Debugging Workflow

1. **Reproduce the issue** - Trigger the problematic action
2. **Check real-time logs** - Deployments → Functions → Real-time Logs
3. **Identify the error** - Look for HTTP status codes and error messages
4. **Fix and deploy** - Update code, push to main, Cloudflare auto-deploys
5. **Verify** - Test again with logs streaming
