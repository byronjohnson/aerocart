# Troubleshooting

Quick solutions to the most common issues.

---

## ❌ "STRIPE_SECRET_KEY is missing"

**Cause:** The `.env.local` file doesn't exist or is missing the Stripe key.

**Fix:**
```bash
npm run setup
```
Or manually create `.env.local` in the project root:
```env
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

Get keys at → [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)

---

## ❌ "STRIPE_SECRET_KEY starts with pk_"

**Cause:** You accidentally put the publishable key in the secret key field.

**Fix:** In `.env.local`, make sure:
- `STRIPE_SECRET_KEY` starts with `sk_test_` or `sk_live_`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` starts with `pk_test_` or `pk_live_`

---

## ❌ Products Not Showing Up

**Cause:** The product isn't defined in `src/lib/inventory.js`.

**Fix:**
1. Open `src/lib/inventory.js`
2. Add your product to the `products` object (see the examples in the file)
3. Refresh the page

Each product needs at minimum: `id`, `name`, `price`, `currency`, and `type`.

---

## ❌ Download Fails After Purchase

**Cause:** The `downloadUrl` in your product definition is incorrect or unreachable.

**Fix:**
1. Check the `downloadUrl` in `src/lib/inventory.js` — is it a valid, accessible URL?
2. Test the URL directly: `curl -I YOUR_DOWNLOAD_URL` (should return 200)
3. If using environment variables, make sure they're set in `.env.local`
4. After changing `.env.local`, **restart the dev server**

---

## ❌ CORS Errors (Cross-Domain Integration)

**Cause:** You're calling the AeroCart API from a different domain.

**Fix:** Add CORS headers to your API routes. In `src/app/api/checkout/route.js`, add:
```javascript
// Add at the top of your POST handler response:
const headers = {
  'Access-Control-Allow-Origin': 'https://your-main-site.com',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Add OPTIONS handler for preflight requests:
export async function OPTIONS() {
  return new Response(null, { status: 204, headers });
}
```

---

## ❌ Build Fails

**Cause:** Usually a Node.js version issue or missing dependencies.

**Fix:**
1. Check Node version: `node -v` (must be 18+)
2. Delete and reinstall: `rm -rf node_modules && npm install`
3. Clear Next.js cache: `rm -rf .next`
4. Try again: `npm run build`

---

## ❌ "Checkout failed: Unknown error"

**Cause:** The Stripe API rejected the request.

**Fix:**
1. Check the terminal/server logs for the full error message
2. Make sure you're using **test mode** keys (starting with `sk_test_` and `pk_test_`)
3. Verify your Stripe account is active at [dashboard.stripe.com](https://dashboard.stripe.com)
4. Check that the product `price` in `inventory.js` is in **cents** (2900 = $29.00)

---

## 💡 Still Stuck?

1. Check server logs in the terminal where `npm run dev` is running
2. Check the browser console (F12 → Console tab)
3. Try Stripe's test cards: `4242 4242 4242 4242`, any future expiry, any CVC
4. Refer to [Stripe's documentation](https://stripe.com/docs) for API-specific issues
