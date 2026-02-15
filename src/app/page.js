import DemoClient from './DemoClient';

export const metadata = {
  title: "Live Demo - Digital Store | AeroCart",
  description: "Experience the checkout flow, secure file delivery, and cart interactions. Try the demo store.",
  alternates: {
    canonical: "/demo",
  },
};

export default function DemoPage() {
  return <DemoClient />;
}
