import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/inventory';

export async function GET() {
  try {
    const products = getAllProducts();
    
    // Return products without exposing download URLs
    const safeProducts = products.map(({ downloadUrl, ...product }) => product);
    
    return NextResponse.json({ products: safeProducts });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
