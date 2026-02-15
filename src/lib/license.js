/**
 * AEROCART LICENSE VALIDATION
 * ===========================
 * Validates license keys and enforces the free/pro product limit.
 *
 * Free tier: No key required. Limited to 1 product.
 * Pro tier:  Set AEROCART_LICENSE_KEY in .env.local. Unlimited products.
 *
 * Get a license at https://aerocart.dev/pricing
 */

const FREE_PRODUCT_LIMIT = 1;
const PRO_PRODUCT_LIMIT = Infinity;

/**
 * Validate a license key format and expiry.
 *
 * @param {string} licenseKey
 * @returns {{ valid: boolean, details?: object, error?: string }}
 */
export function validateLicense(licenseKey) {
  if (!licenseKey || !licenseKey.startsWith('AC-PRO-')) {
    return { valid: false, error: 'Invalid format' };
  }

  try {
    const keyBody = licenseKey.slice(7);
    const dotIndex = keyBody.lastIndexOf('.');
    if (dotIndex === -1) return { valid: false, error: 'Malformed key' };

    const payloadB64 = keyBody.slice(0, dotIndex);
    const payloadBuffer = Buffer.from(payloadB64, 'base64url');
    const details = JSON.parse(payloadBuffer.toString('utf8'));

    if (details.x && details.x < Math.floor(Date.now() / 1000)) {
      return { valid: false, error: 'License expired', details };
    }

    return { valid: true, details };
  } catch (e) {
    return { valid: false, error: 'Corrupt payload' };
  }
}

/**
 * Check if the current environment has a valid Pro license.
 */
export function isProLicense() {
  const key = process.env.AEROCART_LICENSE_KEY;
  if (!key) return false;
  return validateLicense(key).valid;
}

/**
 * Get license details for the current environment.
 */
export function getLicenseInfo() {
  const key = process.env.AEROCART_LICENSE_KEY;
  if (!key) return { tier: 'free', valid: false };
  const result = validateLicense(key);
  return { tier: result.valid ? 'pro' : 'free', valid: result.valid, details: result.details };
}

/**
 * Get the product limit for the current license tier.
 * @returns {number} 1 for free, Infinity for pro
 */
export function getProductLimit() {
  const isPro = isProLicense();

  if (isPro) {
    console.log('\u2708 AeroCart Pro \u2014 Unlimited products');
  } else {
    console.log('\u2708 AeroCart Free \u2014 ' + FREE_PRODUCT_LIMIT + ' product limit. Upgrade at https://aerocart.dev/pricing');
  }

  return isPro ? PRO_PRODUCT_LIMIT : FREE_PRODUCT_LIMIT;
}
