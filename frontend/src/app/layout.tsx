import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CarbonLoop | Capture-train research',
  description: 'Simulation console for amine capture and compression research.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
