#!/usr/bin/env node

/**
 * AeroCart Setup Wizard
 * =====================
 * Interactive setup script that gets you from zero to running in under 2 minutes.
 *
 * Usage:
 *   node setup.mjs          # Interactive mode
 *   node setup.mjs --skip   # Skip prompts, just copy .env.example
 *   node setup.mjs --auto   # Same as --skip (used by postinstall)
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Colors (no dependencies) ─────────────────────────────────────────
const color = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

const log = {
  info: (msg) => console.log(`${color.cyan}ℹ${color.reset} ${msg}`),
  success: (msg) => console.log(`${color.green}✔${color.reset} ${msg}`),
  warn: (msg) => console.log(`${color.yellow}⚠${color.reset} ${msg}`),
  error: (msg) => console.log(`${color.red}✖${color.reset} ${msg}`),
  step: (n, msg) => console.log(`\n${color.blue}[${n}]${color.reset} ${color.bold}${msg}${color.reset}`),
};

// ── Helpers ──────────────────────────────────────────────────────────
function ask(rl, question, fallback = '') {
  return new Promise((resolve) => {
    const suffix = fallback ? ` ${color.dim}(${fallback})${color.reset}` : '';
    rl.question(`  → ${question}${suffix}: `, (answer) => {
      resolve(answer.trim() || fallback);
    });
  });
}

function banner() {
  console.log(`
${color.bold}${color.cyan}
    ╔═══════════════════════════════════════════╗
    ║         ✈  AeroCart Setup Wizard          ║
    ╚═══════════════════════════════════════════╝
${color.reset}${color.dim}  Sell digital products with Next.js & Stripe
  Zero monthly fees · You own the code${color.reset}
  `);
}

// ── Main ─────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const skipPrompts = args.includes('--skip') || args.includes('--auto');

  const envPath = path.join(__dirname, '.env.local');
  const envExamplePath = path.join(__dirname, '.env.example');

  // If --auto (postinstall) and .env.local already exists, exit silently
  if (args.includes('--auto') && fs.existsSync(envPath)) {
    return;
  }

  banner();

  // ── Step 1: Check .env.local ──────────────────────────────────────
  log.step(1, 'Environment Configuration');

  if (fs.existsSync(envPath)) {
    log.success('.env.local already exists');
    const content = fs.readFileSync(envPath, 'utf8');

    // Quick validation
    const hasSecret = /STRIPE_SECRET_KEY=sk_(test|live)_\S+/.test(content);
    const hasPub = /NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_(test|live)_\S+/.test(content);

    if (hasSecret && hasPub) {
      log.success('Stripe keys detected');
    } else {
      log.warn('Stripe keys appear incomplete — edit .env.local to add them');
      log.info(`Get keys at: ${color.cyan}https://dashboard.stripe.com/test/apikeys${color.reset}`);
    }
  } else if (skipPrompts) {
    // Copy .env.example → .env.local without prompting
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      log.success('Created .env.local from .env.example');
      log.warn('Remember to add your Stripe keys to .env.local');
    } else {
      log.error('.env.example not found — creating minimal .env.local');
      fs.writeFileSync(envPath, [
        '# Stripe Keys — get yours at https://dashboard.stripe.com/test/apikeys',
        'STRIPE_SECRET_KEY=sk_test_your_key_here',
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here',
        '',
        '# Base URL (change in production)',
        'NEXT_PUBLIC_BASE_URL=http://localhost:3000',
        '',
      ].join('\n'));
      log.success('Created .env.local with placeholder keys');
    }
  } else {
    // Interactive mode
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    log.info(`You need Stripe API keys. Get them at:`);
    log.info(`${color.cyan}https://dashboard.stripe.com/test/apikeys${color.reset}\n`);

    const secretKey = await ask(rl, 'Stripe Secret Key (sk_test_...)', 'sk_test_your_key_here');
    const pubKey = await ask(rl, 'Stripe Publishable Key (pk_test_...)', 'pk_test_your_key_here');
    const baseUrl = await ask(rl, 'Base URL', 'http://localhost:3000');

    const envContent = [
      '# ─── Stripe API Keys ─────────────────────────────────────────────',
      '# Get these from https://dashboard.stripe.com/test/apikeys',
      '# Use sk_test_ / pk_test_ keys for development',
      `STRIPE_SECRET_KEY=${secretKey}`,
      `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${pubKey}`,
      '',
      '# ─── App Configuration ───────────────────────────────────────────',
      `NEXT_PUBLIC_BASE_URL=${baseUrl}`,
      '',
      '# ─── Download URLs ───────────────────────────────────────────────',
      '# Add secure URLs for your product files (S3, R2, etc.)',
      '# Example:',
      '# EBOOK_DOWNLOAD_URL=https://my-bucket.s3.amazonaws.com/ebook.pdf',
      '',
    ].join('\n');

    fs.writeFileSync(envPath, envContent);
    log.success('Created .env.local with your keys');
    rl.close();
  }

  // ── Step 2: Validate inventory ────────────────────────────────────
  log.step(2, 'Product Inventory');
  const inventoryPath = path.join(__dirname, 'src', 'lib', 'inventory.js');
  if (fs.existsSync(inventoryPath)) {
    const content = fs.readFileSync(inventoryPath, 'utf8');
    const productCount = (content.match(/['"][\w-]+['"]:\s*\{/g) || []).length;
    log.success(`Found ${productCount} product(s) in inventory.js`);

    if (content.includes('placehold.co') || content.includes('TODO')) {
      log.warn('Some products still use placeholder images or TODO markers');
      log.info(`Edit ${color.cyan}src/lib/inventory.js${color.reset} to add your real products`);
    }
  } else {
    log.error('inventory.js not found — this is required!');
  }

  // ── Step 3: License Key (Optional) ────────────────────────────────
  log.step(3, 'License Key (Optional)');

  const currentEnv = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const hasLicense = /AEROCART_LICENSE_KEY=AC-PRO-/.test(currentEnv);

  if (hasLicense) {
    log.success('Pro license key detected — unlimited products');
  } else if (skipPrompts) {
    log.info(`Free tier active — 1 product limit`);
    log.info(`Add AEROCART_LICENSE_KEY to .env.local for unlimited products`);
  } else {
    log.info(`${color.bold}Free tier:${color.reset} Sell 1 product (no key needed)`);
    log.info(`${color.bold}Pro tier:${color.reset}  Sell unlimited products (requires license key)`);
    log.info(`Get a license at: ${color.cyan}https://aerocartshop.com/pricing${color.reset}\n`);

    const rl2 = readline.createInterface({ input: process.stdin, output: process.stdout });
    const licenseKey = await ask(rl2, 'License Key (leave empty for Free tier)', '');
    rl2.close();

    if (licenseKey && licenseKey.startsWith('AC-PRO-')) {
      // Append to .env.local
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf8');
        if (envContent.includes('AEROCART_LICENSE_KEY=')) {
          envContent = envContent.replace(/AEROCART_LICENSE_KEY=.*/, `AEROCART_LICENSE_KEY=${licenseKey}`);
        } else {
          envContent += `\n# AeroCart License\nAEROCART_LICENSE_KEY=${licenseKey}\n`;
        }
        fs.writeFileSync(envPath, envContent);
      }
      log.success('Pro license key saved to .env.local');
    } else if (licenseKey) {
      log.warn('Invalid key format (should start with AC-PRO-). Skipping.');
      log.info('You can add it later to .env.local');
    } else {
      log.info('Running in Free tier — 1 product');
    }
  }

  // ── Step 4: Check Node version ────────────────────────────────────
  log.step(4, 'System Check');
  const nodeVersion = parseInt(process.version.slice(1), 10);
  if (nodeVersion >= 18) {
    log.success(`Node.js ${process.version} ✓`);
  } else {
    log.error(`Node.js ${process.version} detected — AeroCart requires Node 18+`);
  }

  // ── Done ──────────────────────────────────────────────────────────
  console.log(`
${color.green}${color.bold}  ✈  Setup complete!${color.reset}

  ${color.bold}Next steps:${color.reset}

    ${color.cyan}1.${color.reset} Start the dev server:
       ${color.dim}$ ${color.reset}${color.bold}npm run dev${color.reset}

    ${color.cyan}2.${color.reset} Open in your browser:
       ${color.dim}→ ${color.reset}${color.cyan}http://localhost:3000${color.reset}

    ${color.cyan}3.${color.reset} Add your products:
       ${color.dim}→ ${color.reset}Edit ${color.cyan}src/lib/inventory.js${color.reset}

    ${color.cyan}4.${color.reset} Test a purchase:
       ${color.dim}→ ${color.reset}Card: ${color.bold}4242 4242 4242 4242${color.reset}
       ${color.dim}→ ${color.reset}Expiry: any future date, CVC: any 3 digits

  ${color.dim}Documentation: README.md | TROUBLESHOOTING.md${color.reset}
  `);
}

main().catch((err) => {
  log.error(`Setup failed: ${err.message}`);
  process.exit(1);
});
