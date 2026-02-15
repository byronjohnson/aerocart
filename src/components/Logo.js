import React from 'react';
import Image from 'next/image';

export default function Logo({ size = 32, className = '' }) {
  return (
    <Image 
      src="/branding/aerocart-logo-white.png" 
      alt="AeroCart"
      width={size}
      height={size}
      className={className}
      priority
      style={{ objectFit: 'contain' }}
    />
  );
}
