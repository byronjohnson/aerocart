import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import styles from "./layout.module.css";
import { CartProvider } from "@/components/CartContext";
import FloatingCart from "@/components/FloatingCart";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://aerocartshop.com'),
  title: {
    default: "AeroCart — Sell Digital Products with Next.js & Stripe",
    template: "%s | AeroCart"
  },
  description: "The easiest way to sell digital products with Next.js and Stripe. Start free — 1 product, secure file delivery, Stripe Checkout, and zero monthly fees. Upgrade to Pro for unlimited products.",
  keywords: [
    "Next.js digital store",
    "Stripe checkout starter kit",
    "sell digital products",
    "React ecommerce",
    "digital downloads",
    "Stripe payment integration",
    "secure file delivery",
    "self-hosted Gumroad alternative",
    "Next.js Stripe integration",
    "sell files online",
    "digital product checkout",
    "developer e-commerce kit",
    "Next.js store template",
    "sell ebooks online",
    "Node.js digital store",
    "license key system",
  ],
  authors: [{ name: "AeroCart", url: "https://aerocartshop.com" }],
  creator: "AeroCart",
  publisher: "AeroCart",
  alternates: {
    canonical: "https://aerocartshop.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aerocartshop.com",
    title: "AeroCart — Sell Digital Products with Next.js & Stripe",
    description: "Start free. A complete Stripe checkout with secure file delivery for digital products. No monthly fees, no platform cuts.",
    siteName: "AeroCart",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AeroCart — Sell Digital Products with Next.js & Stripe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AeroCart — Sell Digital Products with Next.js & Stripe",
    description: "Start free. A complete Stripe checkout with secure file delivery for digital products.",
    images: ["/og-image.jpg"],
    creator: "@aerocart",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/branding/aerocart-logo-white.png',
  },
  other: {
    'ai-content': 'https://aerocartshop.com/ai.txt',
    'llms': 'https://aerocartshop.com/llms.txt',
    'llms-full': 'https://aerocartshop.com/llms-full.txt',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "name": "AeroCart",
      "url": "https://aerocartshop.com",
      "description": "The easiest way to sell digital products with Next.js and Stripe.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://aerocartshop.com/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "name": "AeroCart",
      "url": "https://aerocartshop.com",
      "logo": "https://aerocartshop.com/branding/aerocart-logo-white.png",
      "sameAs": [
        "https://twitter.com/aerocart",
        "https://github.com/aerocart"
      ]
    },
    {
      "@type": "SoftwareApplication",
      "name": "AeroCart",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Web, Node.js",
      "description": "Production-ready Next.js starter kit for selling digital products with Stripe. Secure file delivery, universal cart system, and license key management.",
      "url": "https://aerocartshop.com",
      "offers": [
        {
          "@type": "Offer",
          "name": "Free",
          "price": "0.00",
          "priceCurrency": "USD",
          "description": "Sell 1 product — free forever. Full source code access."
        },
        {
          "@type": "Offer",
          "name": "Pro",
          "price": "50.00",
          "priceCurrency": "USD",
          "priceValidUntil": "2027-12-31",
          "description": "Unlimited products — $50/year. Includes updates and support."
        }
      ],
      "featureList": [
        "Stripe Checkout integration",
        "Secure file delivery via server proxy",
        "Universal React cart system",
        "Interactive setup wizard",
        "Ed25519 license key validation",
        "Zero monthly platform fees",
        "Full source code access",
        "Deploy anywhere (Vercel, Netlify, Railway)"
      ],
      "softwareRequirements": "Node.js 18+, Stripe account",
      "programmingLanguage": ["JavaScript", "React", "Next.js"],
    },
    {
      "@type": "SoftwareSourceCode",
      "name": "AeroCart Checkout Kit",
      "description": "Next.js starter kit source code for selling digital products with Stripe Checkout and secure file delivery.",
      "programmingLanguage": {
        "@type": "ComputerLanguage",
        "name": "JavaScript"
      },
      "runtimePlatform": "Node.js 18+",
      "targetProduct": {
        "@type": "SoftwareApplication",
        "name": "AeroCart"
      },
      "codeRepository": "https://github.com/aerocart",
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="author" href="https://aerocartshop.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${styles.body}`}
      >
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CartProvider>
          <Navigation />
          {children}
          <FloatingCart />
        </CartProvider>
        
        {/* Fathom - beautiful, simple website analytics */}
        <Script src="https://cdn.usefathom.com/script.js" data-site="NFNBLHPD" strategy="afterInteractive" />
      </body>
    </html>
  );
}
