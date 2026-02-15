# Contributing to AeroCart

Thank you for your interest in contributing to AeroCart! We welcome bug reports, documentation improvements, and bug-fix pull requests from the community.

## How to Contribute

### Reporting Bugs

1. **Search existing issues** to check if the bug has already been reported.
2. If not, [open a new issue](https://github.com/aerocart/aerocart/issues/new?template=bug_report.md) with:
   - A clear, descriptive title
   - Steps to reproduce the issue
   - Expected behavior vs actual behavior
   - Your environment (Node version, OS, browser)

### Suggesting Features

We track feature ideas via [GitHub Issues](https://github.com/aerocart/aerocart/issues/new?template=feature_request.md). Please describe the use case and why it would be valuable.

### Submitting a Pull Request

1. **Fork** the repository and create a new branch from `main`.
2. Make your changes. Keep commits focused and descriptive.
3. Test your changes locally:
   ```bash
   npm install
   npm run dev
   ```
4. Ensure `npm run lint` passes.
5. Open a pull request against `main` with a clear description of the change.

### What We Accept

- **Bug fixes** — always welcome.
- **Documentation improvements** — typo fixes, clarifications, better examples.
- **Small enhancements** — quality-of-life improvements that don't change the core architecture.

### What We Don't Accept

- **Large feature additions** — AeroCart's feature roadmap is managed internally. If you have an idea, open an issue first to discuss it.
- **Breaking changes** — changes that would break existing user setups.

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/aerocart.git
cd aerocart

# Install dependencies
npm install

# Run the setup wizard
npm run setup

# Start the dev server
npm run dev
```

## Code Style

- We use ESLint with the Next.js config. Run `npm run lint` before submitting.
- Keep files simple and readable. AeroCart is designed to be easy to understand and modify.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
