# Clave Pro Services — Website

Professional bilingual (English/Spanish) website for Clave Pro Services, a multiservices business in Houston, TX.

## Files

| File | Description |
|------|-------------|
| `index.html` | Home page — hero, services preview, why choose us, testimonials |
| `services.html` | Full services & pricing page |
| `about.html` | About Angela Gala — bio, credentials, mission |
| `contact.html` | Contact info, form, WhatsApp link |
| `styles.css` | Shared stylesheet |
| `main.js` | Language toggle, hamburger menu, form handler |

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
- Click the 🇺🇸 EN / 🇲🇽 ES button in the navbar to switch
- Preference is saved in `localStorage`

## Deploying to clavepros.com

### Option A — Namecheap Hosting (Recommended)

1. Log in to your Namecheap account.
2. Go to **Hosting List** → select your plan → **cPanel**.
3. Open **File Manager** → navigate to `public_html`.
4. Upload all 6 files (`index.html`, `services.html`, `about.html`, `contact.html`, `styles.css`, `main.js`) to `public_html`.
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

### Option C — Google Sites (Limited)

Google Sites does not support uploading custom HTML. You would need to:
1. Recreate the design manually in Google Sites' editor.
2. Point `clavepros.com` to Google Sites via DNS CNAME.

> **Recommendation:** Option A (direct cPanel upload) or Option B (GitHub Pages) are the best choices for this static site.

## Customization

- **Photo:** Replace the placeholder on `about.html` with an `<img>` tag pointing to your photo.
- **Colors:** Edit the CSS variables at the top of `styles.css`.
- **Contact form:** Currently uses `mailto:`. To receive submissions to a real inbox without a backend, consider [Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com) — just change the form's `action` attribute.
