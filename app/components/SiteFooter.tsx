import Link from 'next/link';
import { ArrowUpRight, Wrench } from 'lucide-react';

const productLinks = [
  { href: '/bios-files', label: 'BIOS library' },
  { href: '/schematics', label: 'Schematics' },
  { href: '/repair-guides', label: 'Repair guides' },
  { href: '/forum', label: 'Forum' },
  { href: '/pricing', label: 'Membership' },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="site-footer__intro">
          <div className="brand brand--footer">
            <span className="brand__mark" aria-hidden="true"><Wrench size={18} strokeWidth={2.5} /></span>
            <span className="brand__copy">
              <span className="brand__name">Hisah<span>Tech</span></span>
              <span className="brand__tagline">Repair intelligence</span>
            </span>
          </div>
          <p>A calmer, clearer home for technical repair resources and practical diagnostics.</p>
          <Link href="/contact" className="footer-contact">Talk to support <ArrowUpRight size={15} /></Link>
        </div>
        <div>
          <h2>Explore</h2>
          <ul>
            {productLinks.map((link) => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2>Account</h2>
          <ul>
            <li><Link href="/?auth=signup">Create account</Link></li>
            <li><Link href="/?auth=login">Sign in</Link></li>
            <li><Link href="/forgot-password">Password help</Link></li>
            <li><Link href="/contact">Contact us</Link></li>
          </ul>
        </div>
      </div>
      <div className="site-footer__bottom">
        <p>© {new Date().getFullYear()} Hisah Tech. Built for practical repair work.</p>
        <p>Clear resources. Better fixes.</p>
      </div>
    </footer>
  );
}
