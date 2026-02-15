'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from './CartContext';
import styles from './navigation.module.css';
import Logo from './Logo';

export default function Navigation() {
  const pathname = usePathname();
  const { count } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/docs', label: 'Documentation' },
  ];

  const isActive = (href) => pathname.startsWith(href);

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logoLink}>
            <Logo size={32} />
            <span className={styles.logoName}>AeroCart</span>
          </Link>

          <div className={styles.desktopNav}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${isActive(link.href) ? styles.navLinkActive : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className={styles.rightSide}>
            <Link href="/cart" className={styles.cartButton} aria-label="View cart">
              <ShoppingCart size={22} className={styles.cartIcon} />
              {count > 0 && <span className={styles.cartBadge}>{count}</span>}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={styles.mobileMenuButton}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} className={styles.menuIcon} /> : <Menu size={22} className={styles.menuIcon} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={styles.mobileNav}>
            <div className={styles.mobileNavList}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${styles.mobileNavLink} ${isActive(link.href) ? styles.mobileNavLinkActive : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
