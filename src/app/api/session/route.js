import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getProduct } from '@/lib/inventory';
import { generateLicense } from '@/lib/license';

/**
 * GET /api/session?session_id=xxx
 * Returns the purchased products for a given session ID.
 * If the purchase includes 'aerocart-license', generates an Ed25519-signed
 * license key using the customer's email from Stripe.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Get the product IDs from metadata
    const productIds = (session.metadata?.productIds || '').split(',').filter(Boolean);
    
    // Enrich with product details
    const purchasedProducts = productIds.map(id => {
      const product = getProduct(id);
      return product ? { id, name: product.name, type: product.type } : { id, name: id, type: 'file' };
    });

    // Generate license key if the purchase includes the AeroCart license
    let licenseKey = null;

    if (productIds.includes('aerocart-license') && session.payment_status === 'paid') {
      const customerEmail = session.customer_details?.email || 'unknown';
      
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year validity

      licenseKey = generateLicense({
        email: customerEmail,
        expiry: expiryDate,
      });
    }

    return NextResponse.json({
      status: session.payment_status,
      products: purchasedProducts,
      licenseKey,
      customerEmail: session.customer_details?.email,
    });
  } catch (error) {
    console.error('Session fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}
