'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense, useRef } from 'react';
import Link from 'next/link';
import { CheckCircle, Download, ArrowRight, AlertTriangle, Loader2 } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import styles from '../styles/success.module.css';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('loading');
  const [products, setProducts] = useState([]);
  const [licenseKey, setLicenseKey] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const { clearCart } = useCart();
  const hasCleared = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    // Clear cart only once
    if (!hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }

    // Fetch the purchased products from the session
    async function fetchSession() {
      try {
        const res = await fetch(`/api/session?session_id=${sessionId}`);
        const data = await res.json();
        
        if (data.status === 'paid') {
          setProducts(data.products || []);
          setLicenseKey(data.licenseKey);
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (err) {
        console.error('Failed to fetch session:', err);
        setStatus('error');
      }
    }

    fetchSession();
  }, [sessionId, clearCart]);

  const handleDownload = (productId) => {
    setDownloading(productId);
    // Browser will handle the download automatically
    window.location.href = `/api/secure-download?session_id=${sessionId}&product_id=${productId}`;
    // Reset after a short delay
    setTimeout(() => setDownloading(null), 2000);
  };

  if (status === 'loading') {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 size={48} className={styles.spinner} />
        <p className={styles.loadingText}>Verifying your purchase...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>
          <AlertTriangle size={48} />
        </div>
        <h1 className={styles.errorTitle}>Something went wrong</h1>
        <p className={styles.errorText}>We couldn't verify your payment session.</p>
        <Link href="/" className={styles.errorButton}>
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.successContainer}>
      <div className={styles.successIcon}>
        <CheckCircle size={48} />
      </div>
      
      <h1 className={styles.successTitle}>Payment Successful!</h1>
      <p className={styles.successSubtitle}>
        Thank you for your purchase. Your files are ready to download.
      </p>

      <div className={styles.downloadsBox}>
        {status === 'success' && products.some(p => p.id === 'aerocart-license') && licenseKey && (
            <div className={styles.licenseBox}>
                <h3 className={styles.downloadsTitle}>Your License Key</h3>
                <p className={styles.downloadsNote} style={{ marginTop: 0 }}>
                    Save this key. Add it to your <code>.env.local</code> to unlock unlimited products:
                </p>
                <div className={styles.licenseKeyWrapper}>
                    <code className={styles.licenseKey}>AEROCART_LICENSE_KEY={licenseKey}</code>
                    <button 
                        onClick={() => {
                            navigator.clipboard.writeText(`AEROCART_LICENSE_KEY=${licenseKey}`);
                            const btn = document.activeElement;
                            btn.textContent = 'Copied!';
                            setTimeout(() => { btn.textContent = 'Copy to Clipboard'; }, 2000);
                        }}
                        className={styles.copyButton}
                    >
                        Copy to Clipboard
                    </button>
                </div>
            </div>
        )}

        <h3 className={styles.downloadsTitle}>Your Downloads</h3>
        
        <div className={styles.downloadsList}>
          {products.map((product) => (
            <button 
              key={product.id}
              onClick={() => handleDownload(product.id)}
              disabled={downloading === product.id}
              className={styles.downloadButton}
            >
              <span className={styles.downloadButtonInner}>
                {downloading === product.id ? (
                  <Loader2 size={20} className={styles.spinner} />
                ) : (
                  <Download size={20} />
                )}
                {product.name}
              </span>
              <span className={styles.downloadType}>.{product.type}</span>
            </button>
          ))}
        </div>
        
        <p className={styles.downloadsNote}>
          Downloads are verified against your Stripe session for security.
        </p>
      </div>

      <div className={styles.footerLinks}>
        <Link href="/" className={styles.footerLink}>
          Back to Store
        </Link>
        <Link href="/docs" className={`${styles.footerLink} ${styles.footerLinkAccent}`}>
          Documentation <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className={styles.container}>
      <Suspense fallback={
        <div className={styles.loadingContainer}>
          <Loader2 size={48} className={styles.spinner} />
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
