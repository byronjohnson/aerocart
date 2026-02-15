<p align="center">
  <img src="public/branding/aerocart-logo-transparent.png" alt="AeroCart" width="80" />
</p>

<h1 align="center">AeroCart</h1>

<p align="center">
  <strong>Sell digital products with Next.js and Stripe.</strong><br />
  Zero monthly fees. Zero platform taxes. You own every line of code.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/aerocart"><img src="https://img.shields.io/npm/v/aerocart.svg" alt="npm version" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
  <a href="https://github.com/aerocart/aerocart/stargazers"><img src="https://img.shields.io/github/stars/aerocart/aerocart.svg" alt="GitHub stars" /></a>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> &nbsp;&bull;&nbsp;
  <a href="#what-you-get">Features</a> &nbsp;&bull;&nbsp;
  <a href="#adding-your-products">Add Products</a> &nbsp;&bull;&nbsp;
  <a href="#api-reference">API</a> &nbsp;&bull;&nbsp;
  <a href="#free-vs-pro">Free vs Pro</a>
</p>

---

## Why AeroCart?

Most platforms for selling digital products take a cut of every sale, lock you into their ecosystem, and charge monthly fees whether you sell anything or not.

AeroCart is different. It's a self-hosted Next.js app that connects directly to **your** Stripe account. You deploy it, you own it, and Stripe's ~2.9% processing fee is the only cost. No middleman.

- **5-minute setup** -- interactive wizard configures everything
- **One file to edit** -- add products in `src/lib/inventory.js` and you're selling
- **Secure by default** -- server-side pricing, proxied downloads, session-verified access
- **Deploy anywhere** -- Vercel, Netlify, Railway, or any Node.js host

---

## Quick Start

```bash
npx create-aerocart-app my-store
cd my-store
npm run dev
```

Or clone manually:

```bash
git clone https://github.com/aerocart/aerocart.git my-store
cd my-store
npm install
npm run setup
npm run dev
```

Open **http://localhost:3000** -- your store is running.

> Test purchase: card `4242 4242 4242 4242`, any future expiry, any CVC.

---

## What You Get

| | |
|---|---|
| **Stripe Checkout** | Server-side sessions with validated pricing. Customers never see raw amounts. |
| **Secure Downloads** | Files proxied through your server. Source URLs are never exposed to the browser. |
| **Universal Cart** | React Context + localStorage. Works across pages, persists on refresh. |
| **Responsive UI** | Clean storefront with product cards, cart drawer, and direct-buy pages. |
| **Setup Wizard** | Interactive CLI that writes your `.env.local` in 60 seconds. |
| **External Integration** | Use from any website via direct links or the checkout API. |

---

## Adding Your Products

Edit **`src/lib/inventory.js`** -- this is the only file you need to touch:

```javascript
export const products = {
  'my-ebook': {
    id: 'my-ebook',
    name: 'My Digital Product',
    description: 'A short, compelling pitch.',
    price: 2900,                          // $29.00 in cents
    currency: 'usd',
    type: 'pdf',                          // pdf, zip, mp3, mp4, etc.
    image: '/images/product.jpg',         // place in public/images/
    downloadUrl: process.env.EBOOK_URL,   // secure URL (use env vars)
  },
};
```

Add the download URL to `.env.local`:

```env
EBOOK_URL=https://my-bucket.s3.amazonaws.com/ebook.pdf
```

Refresh the page. Your product appears.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── checkout/route.js         Creates Stripe checkout sessions
│   │   ├── secure-download/route.js  Streams purchased files (server-side proxy)
│   │   ├── session/route.js          Verifies payment status
│   │   └── products/route.js         Public product listing API
│   ├── buy/[productId]/page.js       Direct-purchase page
│   ├── cart/page.js                  Full cart page
│   ├── success/page.js               Post-payment download page
│   └── page.js                       Store homepage
├── components/
│   ├── CartContext.js                 Cart state (React Context + localStorage)
│   └── FloatingCart.js               Slide-out cart drawer
└── lib/
    ├── inventory.js                  YOUR PRODUCTS GO HERE
    ├── license.js                    Free/Pro tier enforcement
    └── stripe.js                     Stripe client singleton
```

---

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/checkout` | POST | Create a Stripe checkout session |
| `/api/session?session_id=X` | GET | Verify purchase and list bought products |
| `/api/secure-download?session_id=X&product_id=Y` | GET | Stream a purchased file |
| `/api/products` | GET | List all products (no download URLs exposed) |
| `/api/products/[id]` | GET | Get a single product's details |

**Example:**

```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"items": [{"id": "my-ebook", "quantity": 1}]}'
```

Returns: `{ "url": "https://checkout.stripe.com/c/pay/..." }`

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `STRIPE_SECRET_KEY` | Yes | Stripe server-side key (`sk_test_...` or `sk_live_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe client-side key (`pk_test_...` or `pk_live_...`) |
| `NEXT_PUBLIC_APP_URL` | Recommended | Your deployed URL (defaults to `http://localhost:3000`) |
| `AEROCART_LICENSE_KEY` | No | Pro license key. Omit for free tier. |

Get your Stripe keys at [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys).

---

## Deployment

### Vercel (recommended)

1. Push this repo to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in the dashboard
4. Deploy

### Any Node.js host

```bash
npm run build
npm start
```

Works on Vercel, Netlify, Railway, Render, AWS, DigitalOcean, or any platform with Node 18+.

---

## External Integration

Use AeroCart as a checkout backend for **any** website -- static HTML, WordPress, Webflow, anything.

**Direct link:**

```html
<a href="https://your-store.com/buy/my-ebook">Buy Now - $29</a>
```

**API call:**

```javascript
const res = await fetch('https://your-store.com/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ items: [{ id: 'my-ebook', quantity: 1 }] }),
});
const { url } = await res.json();
window.location.href = url;
```

---

## Security

- **Server-side pricing** -- amounts come from `inventory.js`, not the client
- **Proxied downloads** -- files stream through your server; source URLs never reach the browser
- **Session verification** -- Stripe session ID + product ID validated before every download
- **No shareable links** -- download URLs are single-use and tied to a verified session

---

## Free vs Pro

AeroCart is **free and open-source**. The free tier is fully functional with a 1-product limit. Upgrade to Pro to sell unlimited products.

| | Free | Pro |
|---|:---:|:---:|
| Full source code | Yes | Yes |
| Stripe Checkout | Yes | Yes |
| Secure file downloads | Yes | Yes |
| Cart and product pages | Yes | Yes |
| Deploy anywhere | Yes | Yes |
| **Products** | **1** | **Unlimited** |
| Priority support | -- | Yes |
| Automatic updates | -- | Yes |
| | | |
| **Price** | **$0** | **$50/year** |

**[Get a Pro license](https://aerocart.dev/pricing)**

---

## Test Cards

| Card | Number |
|------|--------|
| Success | `4242 4242 4242 4242` |
| Declined | `4000 0000 0000 0002` |
| 3D Secure | `4000 0025 0000 3155` |

Use any future expiry and any 3-digit CVC.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run setup` | Interactive setup wizard |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues.

**Quick fixes:**
- `STRIPE_SECRET_KEY is missing` -- run `npm run setup` or edit `.env.local`
- Products not showing -- check `src/lib/inventory.js`
- Download fails -- verify `downloadUrl` is accessible from your server

---

## Contributing

Bug fixes and documentation improvements are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

MIT -- see [LICENSE](./LICENSE).
