import type { Metadata } from 'next';
import './globals.css';
import SiteFooter from './components/SiteFooter';
import SiteHeader from './components/SiteHeader';
import WhatsAppButton from './components/WhatsAppButton';

export const metadata: Metadata = {
  title: {
    default: 'Hisah Tech | Repair resources',
    template: '%s | Hisah Tech',
  },
  description: 'Practical repair resources, schematics, BIOS files, repair guides, and a focused community.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content" className="site-main">{children}</main>
        <SiteFooter />
        <WhatsAppButton />
      </body>
    </html>
  );
}
