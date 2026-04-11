# Clave Pro Services — Website

Professional bilingual (English/Spanish) website for Clave Pro Services, a multiservices business in Houston, TX.

## Files

| File | Description |
|------|-------------|
| `index.html` | Home page — hero, services preview, why choose us, testimonials |
| `services.html` | Full services & pricing page with document requirements |
| `documents.html` | Standalone document requirements page (What to Bring) |
| `about.html` | About Angela Gala — bio, credentials, mission |
| `contact.html` | Contact info, form with Airtable integration, WhatsApp link |
| `legal.html` | Legal disclaimers & privacy policy |
| `styles.css` | Shared stylesheet |
| `main.js` | Language toggle, hamburger menu, document selector, form handler |

## How to Preview Locally

1. Open `index.html` in any browser, or
2. Use a local server:
   ```bash
   # Python
   python -m http.server 8000

   # Node.js (npx)
   npx serve .
   ```
3. Visit `http://localhost:8000`

## Language Toggle

- Default language: **Spanish**
- Click the flag button in the navbar to switch
- Preference is saved in `localStorage`

## Airtable CRM Integration

The contact form submits leads to an Airtable base ("Clave Pro CRM"). Fields:
- **Name** — Client's full name
- **E-mail** — Client's email
- **Phone** — Client's phone number
- **Type of Service** — Selected service (English name)
- **Notes** — Client's message
- **Status** — Auto-set to "New"

### Setting Up Airtable Email Automation

To automatically send clients a document checklist email when they submit the contact form:

1. **Open Airtable** → Go to the "Clave Pro CRM" base
2. **Click "Automations"** tab (top bar)
3. **Create a new automation:**
   - **Trigger:** "When a record is created" in the CRM table
   - **Condition:** Status = "New"
4. **Add action:** "Send email"
   - **To:** `{E-mail}` (use the record's email field)
   - **From name:** Clave Pro Services
   - **Subject:** `Clave Pro Services — Documents for your appointment / Documentos para su cita`
   - **Body:** Create a bilingual email body that includes:
     - The document checklist for the selected service (from `{Type of Service}` field)
     - Use the document lists from `documents.html` / `main.js` as reference
     - End with: *"We will contact you within 1 hour to confirm your appointment. / Le contactaremos en menos de 1 hora para confirmar su cita."*
     - Signature: **Angela Gala | Clave Pro Services | (281) 935-7568 | clavepros.com**
5. **Enable the automation**

> **Note:** Airtable's free plan includes 100 automation runs/month. For higher volume, consider upgrading to Airtable Pro or using a service like Zapier/Make.com to send emails via a dedicated provider (SendGrid, Resend, etc.).

### Pipeline Stages

`New` → `Contacted` → `Quote Sent` → `Waiting for Acceptance` → `Quote Signed` → `Paid` → `Closed`

## Deploying to clavepros.com

### Option A — Namecheap Hosting (Recommended)

1. Log in to your Namecheap account.
2. Go to **Hosting List** → select your plan → **cPanel**.
3. Open **File Manager** → navigate to `public_html`.
4. Upload all files to `public_html`.
5. Your site should be live at `https://clavepros.com`.

### Option B — Namecheap + GitHub Pages

1. Push this folder to a GitHub repository (e.g., `clave-pro-services`).
2. In the repo, go to **Settings** → **Pages** → set source to `main` branch, root folder.
3. GitHub will publish to `https://yourusername.github.io/clave-pro-services/`.
4. In Namecheap DNS, add a **CNAME** record:
   - Host: `www`
   - Value: `yourusername.github.io`
5. Add an **A** record pointing to GitHub's IPs:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
6. In GitHub Pages settings, enter `clavepros.com` as your custom domain and enable HTTPS.

## Customization

- **Colors:** Edit the CSS variables at the top of `styles.css` (Navy #003366, Gold #C9A84C).
- **Contact form:** Uses Airtable API. Token is in `main.js`.
