import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getDownloadUrl, getProduct, getFileExtension } from '@/lib/inventory';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');
  const productId = searchParams.get('product_id');

  if (!sessionId || !productId) {
    return NextResponse.json({ error: 'Missing session_id or product_id' }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    
    // 1. Verify the Stripe session is paid
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session || session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not confirmed' }, { status: 403 });
    }

    // 2. Verify this product was purchased in this session
    const purchasedIds = (session.metadata?.productIds || '').split(',');
    
    if (!purchasedIds.includes(productId)) {
      return NextResponse.json({ error: 'Product not purchased in this session' }, { status: 403 });
    }

    // 3. Get the secure download URL (never exposed to client)
    const sourceUrl = getDownloadUrl(productId);
    
    if (!sourceUrl) {
      return NextResponse.json({ error: 'Download not configured for this product' }, { status: 404 });
    }

    // 4. Fetch and stream the file
    const fileResponse = await fetch(sourceUrl);

    if (!fileResponse.ok) {
      console.error(`Failed to fetch from source: ${fileResponse.status}`);
      return NextResponse.json({ error: 'Failed to fetch file' }, { status: 502 });
    }

    // 5. Determine content type and filename
    const product = getProduct(productId);
    const extension = getFileExtension(productId);
    const filename = `${product?.name || productId}${extension}`.replace(/[^a-zA-Z0-9.-]/g, '_');
    const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream';

    const fileBuffer = await fileResponse.arrayBuffer();

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
