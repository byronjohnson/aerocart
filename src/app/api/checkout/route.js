import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getProduct } from '@/lib/inventory';
import { generateLicense } from '@/lib/license';

export async function POST(request) {
  try {
    const { items } = await request.json();

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Build line items from server-side inventory (prevents price tampering)
    const line_items = items.map((item) => {
      const product = getProduct(item.id);
      
      if (!product) {
        throw new Error(`Product "${item.id}" not found`);
      }

      return {
        product, // Keep reference for mode check
        data: {
          price_data: {
            currency: product.currency,
            product_data: {
              name: product.name,
              description: product.description,
              images: product.image ? [product.image] : [],
            },
            unit_amount: product.price,
          },
          quantity: item.quantity || 1,
        }
      };
    });

    // Check if we are in Live Mode (if any product is marked as live)
    const isLiveMode = line_items.some(item => item.product.metadata?.mode === 'live');
    
    // Check for mixed mode (cannot share cart with test and live items)
    const allSameMode = line_items.every(item => 
      (item.product.metadata?.mode === 'live') === isLiveMode
    );

    if (!allSameMode) {
      return NextResponse.json({ error: 'Cannot mix Demo products with Real products in the same cart.' }, { status: 400 });
    }

    // Determine correct API Key
    let stripeKey;
    if (isLiveMode) {
      stripeKey = process.env.STRIPE_LIVE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
    } else {
      stripeKey = process.env.STRIPE_TEST_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
    }

    const stripe = getStripe(stripeKey);

    // Store product IDs in metadata for fulfillment
    const productIds = items.map(i => i.id).join(',');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items.map(i => i.data),
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/`,
      metadata: { productIds },
      invoice_creation: { enabled: true },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
