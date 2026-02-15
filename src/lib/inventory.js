/**
 * INVENTORY CONFIGURATION
 * ========================
 * This is the single source of truth for all your products.
 */

import { getProductLimit } from './license.js';

export const products = {
  'ebook-react': {
    id: 'ebook-react',
    name: 'Advanced React Patterns Ebook',
    description: 'Master React with this comprehensive guide.',
    price: 3900,
    currency: 'usd',
    type: 'pdf',
    image: 'https://placehold.co/600x400/db2777/white?text=React+Ebook',
    downloadUrl: 'https://github.com/stripe/stripe-node/raw/master/README.md', // Example URL
  },
  'preset-bundle': {
    id: 'preset-bundle',
    name: 'Pro Photography Presets',
    description: '10 professional presets for Lightroom.',
    price: 1900,
    currency: 'usd',
    type: 'zip',
    image: 'https://placehold.co/600x400/16a34a/white?text=Presets',
    downloadUrl: 'https://github.com/stripe/stripe-node/raw/master/README.md', // Example URL
  }
};

export function getAllProducts() {
  const all = Object.values(products);
  const limit = getProductLimit();
  if (all.length > limit) return all.slice(0, limit);
  return all;
}
export function getAllProductsUnfiltered() { return Object.values(products); }
export function getProduct(productId) {
  const product = products[productId];
  if (!product) return null;
  const allowed = getAllProducts();
  return allowed.some(p => p.id === productId) ? product : null;
}
export function getDownloadUrl(productId) {
  const product = products[productId];
  if (!product) return null;
  if (typeof product.downloadUrl === 'function') return product.downloadUrl();
  return product.downloadUrl;
}
export function getFileExtension(productId) {
  const typeToExtension = { pdf: '.pdf', zip: '.zip', mp3: '.mp3', mp4: '.mp4', png: '.png', jpg: '.jpg' };
  const product = products[productId];
  return typeToExtension[product?.type] || '';
}
