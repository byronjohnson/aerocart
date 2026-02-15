'use client';

import { getProduct } from '@/lib/inventory';
import { useEffect, useState } from 'react';

export default function BuyPage({ params }) {
  const [product, setProduct] = useState(null);
  const [productId, setProductId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Unwrap params (they're a Promise in Next.js 15)
    Promise.resolve(params).then(p => {
      setProductId(p.productId);
    });
  }, [params]);

  useEffect(() => {
    if (productId) {
      // Fetch product from API
      fetch(`/api/products/${productId}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setProduct(data);
          }
        });
    }
  }, [productId]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ id: product.id, quantity: 1 }]
        })
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Checkout failed: ' + (data.error || 'Unknown error'));
        setLoading(false);
      }
    } catch (error) {
      alert('Checkout failed: ' + error.message);
      setLoading(false);
    }
  };

  if (!product) {
    if (productId === null) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600">The product "{productId}" doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Product Image */}
        <div className="h-48 bg-gray-200">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Product Details */}
        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded uppercase">
              {product.type}
            </span>
          </div>
          
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <div className="flex items-center justify-between mb-6">
            <span className="text-3xl font-bold text-gray-900">
              ${(product.price / 100).toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">{product.currency.toUpperCase()}</span>
          </div>

          {/* Checkout Button */}
          <button 
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Redirecting to Checkout...' : 'Buy Now'}
          </button>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            Secure checkout powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
