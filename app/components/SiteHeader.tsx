'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, ChevronDown, FileCode2, Files, Menu, Wrench, X } from 'lucide-react';
import { useState } from 'react';

const primaryLinks = [
  { href: '/bios-files', label: 'BIOS library', icon: Files },
  { href: '/schematics', label: 'Schematics', icon: FileCode2 },
  { href: '/repair-guides', label: 'Repair guides', icon: BookOpen },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand" onClick={closeMenu} aria-label="Hisah Tech home">
          <span className="brand__mark" aria-hidden="true"><Wrench size={18} strokeWidth={2.5} /></span>
          <span className="brand__copy">
            <span className="brand__name">Hisah<span>Tech</span></span>
            <span className="brand__tagline">Repair intelligence</span>
          </span>
        </Link>

        <nav className="site-nav site-nav--desktop" aria-label="Primary navigation">
          {primaryLinks.map(({ href, label }) => (
            <Link key={href} href={href} className={isActive(href) ? 'site-nav__link site-nav__link--active' : 'site-nav__link'}>
              {label}
            </Link>
          ))}
          <Link href="/contact" className={isActive('/contact') ? 'site-nav__link site-nav__link--active' : 'site-nav__link'}>Contact</Link>
        </nav>

        <div className="site-header__actions">
          <Link href="/?auth=login" className="button button--quiet">Sign in</Link>
          <Link href="/?auth=signup" className="button button--primary">Create account</Link>
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={21} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu" aria-label="Mobile navigation">
          <nav className="mobile-menu__links">
            <Link href="/" onClick={closeMenu}>Home</Link>
            {primaryLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={closeMenu}><Icon size={18} /> {label}</Link>
            ))}
            <Link href="/contact" onClick={closeMenu}>Contact &amp; support</Link>
          </nav>
          <div className="mobile-menu__actions">
            <Link href="/?auth=login" className="button button--secondary" onClick={closeMenu}>Sign in</Link>
            <Link href="/?auth=signup" className="button button--primary" onClick={closeMenu}>Create an account</Link>
          </div>
          <p className="mobile-menu__note"><ChevronDown size={15} /> Find the right repair resource in a few taps.</p>
        </div>
      )}
    </header>
  );
}
