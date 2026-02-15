'use client';

import { useCart } from '@/components/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import styles from './cart.module.css';

export default function CartPage() {
  const { cart, removeFromCart, addToCart, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }),
      });
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Checkout failed: ' + (data.error || 'Unknown error'));
        setLoading(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('An error occurred during checkout');
      setLoading(false);
    }
  };

  const decrementQuantity = (item) => {
    if (item.quantity > 1) {
      addToCart({ ...item, quantity: -1, _decrement: true });
    } else {
      removeFromCart(item.id);
    }
  };

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <ShoppingBag size={64} strokeWidth={1} />
          </div>
          <h1 className={styles.emptyTitle}>Your cart is empty</h1>
          <p className={styles.emptyText}>
            Looks like you haven't added anything yet.
          </p>
          <Link href="/" className={styles.continueShopping}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={18} />
          Continue Shopping
        </Link>
        <h1 className={styles.title}>Your Cart</h1>
      </div>

      <div className={styles.content}>
        {/* Cart Items */}
        <div className={styles.itemsSection}>
          <div className={styles.itemsList}>
            {cart.map((item) => (
              <div key={item.id} className={styles.item}>
                {/* Image */}
                <div className={styles.itemImage}>
                  {item.image && (
                    <img src={item.image} alt={item.name} />
                  )}
                </div>

                {/* Details */}
                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemType}>{item.type?.toUpperCase()}</p>
                  <p className={styles.itemPrice}>${(item.price / 100).toFixed(2)}</p>
                </div>

                {/* Quantity Controls */}
                <div className={styles.quantityControls}>
                  <button 
                    onClick={() => decrementQuantity(item)}
                    className={styles.quantityButton}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button 
                    onClick={() => addToCart(item)}
                    className={styles.quantityButton}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Item Total */}
                <div className={styles.itemTotal}>
                  ${((item.price * item.quantity) / 100).toFixed(2)}
                </div>

                {/* Remove */}
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className={styles.removeButton}
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <button onClick={clearCart} className={styles.clearCart}>
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          
          <div className={styles.summaryRows}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${(total / 100).toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Processing</span>
              <span className={styles.free}>Free</span>
            </div>
          </div>

          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>${(total / 100).toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className={styles.checkoutButton}
          >
            {loading ? 'Redirecting...' : 'Proceed to Checkout'}
          </button>

          <p className={styles.secureNote}>
            🔒 Secure checkout powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
