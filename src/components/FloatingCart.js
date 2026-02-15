'use client';

import { usePathname } from 'next/navigation';
import { useCart } from './CartContext';
import { ShoppingCart, X, Trash2, Plus, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './floatingcart.module.css';

export default function FloatingCart() {
  const pathname = usePathname();
  const { cart, removeFromCart, addToCart, count, total, isOpen, toggleCart } = useCart();
  const [loading, setLoading] = useState(false);

  // Only show on demo page
  

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

  // Hide button if cart is empty and closed
  if (!isOpen && count === 0) return null;

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={toggleCart}
        className={styles.floatingButton}
        aria-label="Open cart"
      >
        <ShoppingCart size={24} />
        {count > 0 && (
          <span className={styles.floatingBadge}>
            {count}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      {isOpen && (
        <div className={styles.overlay}>
          {/* Backdrop */}
          <div 
            className={styles.backdrop}
            onClick={toggleCart}
          />
          
          {/* Drawer */}
          <div className={styles.drawer}>
            {/* Header */}
            <div className={styles.header}>
              <h2 className={styles.headerTitle}>Cart ({count})</h2>
              <button onClick={toggleCart} className={styles.closeButton} aria-label="Close cart">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className={styles.itemsContainer}>
              {cart.length === 0 ? (
                <p className={styles.emptyMessage}>Your cart is empty.</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className={styles.cartItem}>
                    {/* Image */}
                    <div className={styles.itemImage}>
                      {item.image && (
                        <img src={item.image} alt={item.name} />
                      )}
                    </div>
                    
                    {/* Details */}
                    <div className={styles.itemDetails}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <p className={styles.itemPrice}>${(item.price / 100).toFixed(2)}</p>
                      
                      {/* Quantity Controls */}
                      <div className={styles.quantityControls}>
                        <button 
                          onClick={() => decrementQuantity(item)}
                          className={styles.quantityButton}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className={styles.quantityValue}>{item.quantity}</span>
                        <button 
                          onClick={() => addToCart(item)}
                          className={styles.quantityButton}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Remove */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className={styles.removeButton}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.totalRow}>
                  <span>Total</span>
                  <span>${(total / 100).toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className={styles.checkoutButton}
                >
                  {loading ? 'Redirecting to Stripe...' : 'Checkout'}
                </button>
                <p className={styles.secureNote}>
                  Secure checkout powered by Stripe
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
