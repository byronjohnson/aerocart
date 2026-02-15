import Stripe from 'stripe';

// Singleton pattern - only initialize Stripe once
let stripeInstance = null;

export function getStripe(apiKey) {
  // If a specific key is provided, always return a new instance for that key
  if (apiKey) {
    return new Stripe(apiKey);
  }

  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeInstance;
}
