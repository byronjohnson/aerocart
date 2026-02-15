import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/inventory';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const product = getProduct(id);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Return product without exposing download URL
    const { downloadUrl, ...safeProduct } = product;
    
    return NextResponse.json(safeProduct);
  } catch (error) {
    console.error('Product API error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
