# Deploy TreatAxis on AWS (Amplify) with Namecheap domain

This project is a Next.js App Router app with API routes and SSR, so AWS Amplify Hosting is the recommended path.

## 1) Pre-check in local

Run:

```bash
npm ci
npm run lint && npm run build
```

If this passes, push your latest code to GitHub.

## 2) Create Amplify app

1. AWS Console -> Amplify -> `Create new app`
2. Choose source: GitHub
3. Select repo and branch (for example `main`)
4. Amplify should detect Next.js automatically
5. Build settings: keep default or use `amplify.yml` from repo root
6. Create app and wait for first deploy

## 3) Add environment variables in Amplify

Amplify app -> App settings -> Environment variables

Copy from `.env.production.example`:

- `AWS_REGION`
- `AUTO_CREATE_DYNAMO_TABLES`
- `AWS_INQUIRIES_TABLE_NAME`
- `AWS_CHAT_TABLE_NAME`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- Optional integrations:
  - `RESEND_API_KEY`
  - `LEAD_EMAIL_FROM`
  - `LEAD_EMAIL_TO`
  - `HUBSPOT_PRIVATE_APP_TOKEN`
  - `LEAD_WEBHOOK_URL`
  - `WHATSAPP_WEBHOOK_URL`
  - `GOOGLE_SHEETS_WEBHOOK_URL`
  - `CRM_WEBHOOK_URL`

Redeploy after saving env vars.

## 4) IAM permissions for backend AWS access

Your API routes use DynamoDB. Ensure the Amplify hosting compute role has permissions to:

- `dynamodb:PutItem`
- `dynamodb:GetItem`
- `dynamodb:DescribeTable`
- `dynamodb:CreateTable` (only if `AUTO_CREATE_DYNAMO_TABLES=true`)

for:

- `AWS_INQUIRIES_TABLE_NAME`
- `AWS_CHAT_TABLE_NAME`

Best practice: create tables manually and set `AUTO_CREATE_DYNAMO_TABLES=false`.

## 5) Domain setup with Namecheap

### Option A (recommended): move DNS to Route 53

1. Route 53 -> Create hosted zone for `treataxis.com`
2. Copy 4 nameservers from Route 53
3. Namecheap -> Domain list -> Manage -> Nameservers -> `Custom DNS`
4. Paste Route 53 nameservers
5. Back in Amplify -> Domain management -> Add domain `treataxis.com`
6. Select root + `www` and enable redirect (`www` -> root or root -> www)

### Option B: keep Namecheap DNS

1. Amplify -> Domain management -> Add custom domain `treataxis.com`
2. Amplify shows required DNS records
3. Namecheap -> Advanced DNS -> add records exactly:
   - verification CNAME(s)
   - app CNAME/ALIAS targets
4. Wait for validation + SSL issuance

## 6) SSL and redirects

In Amplify domain settings:

- Enable HTTPS (ACM auto-managed)
- Force redirect HTTP -> HTTPS
- Configure preferred host (root or `www`)

## 7) Post-deploy checks

1. Open production URL and test main pages:
   - `/`
   - `/treatments`
   - `/treatments/orthopedic-surgery-abroad`
   - `/doctors`
   - `/africa`
   - `/africa/ghana`
   - `/destinations/india`
2. Verify API routes by submitting forms and TREA flows
3. Confirm robots/sitemap:
   - `/robots.txt`
   - `/sitemap.xml`

## 8) Search Console quick start (10-15 min)

1. Add domain property `treataxis.com`
2. Verify DNS TXT record in Namecheap/Route53
3. Submit sitemap: `https://www.treataxis.com/sitemap.xml`
4. Inspect and request indexing for priority URLs

## 9) Troubleshooting

- Build fails: check Amplify build logs for missing env vars
- API works locally but not prod: verify Amplify compute role permissions
- Domain pending validation: re-check DNS record host/value and TTL
- SSL pending: wait for DNS propagation, then retry validation

## 10) Recommended production defaults

- `AUTO_CREATE_DYNAMO_TABLES=false`
- Separate production DynamoDB tables
- Rotate API keys every 60-90 days
- Enable CloudWatch logs and alerts for API errors
