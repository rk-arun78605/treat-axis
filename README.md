## TreatAxis

TreatAxis is a Next.js medical tourism platform homepage built around SEO, trust, and patient inquiry conversion.

## Local Development

Install dependencies and start the app:

```bash
npm ci
npm run dev
```

Open http://localhost:3000.

## Validation

Use the same checks as CI:

```bash
npm run lint
npm run build
```

## Inquiry Flow

The homepage lead form posts to `app/api/inquiries/route.ts`.

Lead channels supported by environment variable:

- `LEAD_WEBHOOK_URL` for generic automation/webhook
- `WHATSAPP_WEBHOOK_URL` for WhatsApp workflow bridge
- `GOOGLE_SHEETS_WEBHOOK_URL` for Apps Script or no-code sheet logging
- `CRM_WEBHOOK_URL` for custom CRM ingestion endpoint
- `RESEND_API_KEY` + `LEAD_EMAIL_FROM` + `LEAD_EMAIL_TO` for email delivery
- `HUBSPOT_PRIVATE_APP_TOKEN` for HubSpot contact creation

If multiple channels are configured, the API dispatches to all of them.

## GitHub CI/CD

Three GitHub Actions workflows are included:

- `.github/workflows/ci.yml` runs lint and production build on pushes and pull requests.
- `.github/workflows/deploy-vercel.yml` deploys to Vercel when the required secrets are configured.
- `.github/workflows/backup-artifact.yml` stores a source-code backup artifact for each main branch push.

Add these GitHub repository secrets before enabling deployment:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## GitHub Backup

To back the code up to GitHub itself, create a GitHub repository and push this project:

```bash
git init
git add .
git commit -m "Initial TreatAxis website"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

Once that is done, GitHub becomes the primary source backup, and the workflow artifacts give you an additional restorable snapshot on each main push.
