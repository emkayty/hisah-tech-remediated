import Link from 'next/link';
import { ArrowRight, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';

const whatsappHref = 'https://wa.me/2348031233064?text=Hello%21%20I%20need%20help%20with%20Hisah%20Tech.';

export default function ContactPage() {
  return (
    <div className="page-shell">
      <section className="contact-hero">
        <span className="eyebrow"><ShieldCheck size={14} /> Direct, practical support</span>
        <h1>Tell us what you are working on.</h1>
        <p>Need a specific repair resource, have a question, or want to suggest an addition to the library? Choose the fastest channel for you.</p>
      </section>

      <div className="contact-grid">
        <article className="contact-card contact-card--primary">
          <span className="contact-card__icon"><MessageCircle size={23} /></span>
          <span className="eyebrow">Fastest response</span>
          <h2>Message us on WhatsApp.</h2>
          <p>Send the device model, board detail, or resource you need. A short, clear request helps us respond quickly.</p>
          <a href={whatsappHref} target="_blank" rel="noreferrer" className="button button--primary">Open WhatsApp <ArrowRight size={16} /></a>
        </article>

        <article className="contact-card">
          <span className="contact-card__icon"><Mail size={22} /></span>
          <h2>Email support</h2>
          <p>For detailed questions or resource requests, email the team with as much device information as you have.</p>
          <a className="contact-link" href="mailto:hisahtechltd@gmail.com">hisahtechltd@gmail.com <ArrowRight size={15} /></a>
        </article>

        <article className="contact-card">
          <span className="contact-card__icon"><Phone size={22} /></span>
          <h2>Call the team</h2>
          <p>Prefer a direct conversation? Reach the Hisah Tech team by phone during normal business hours.</p>
          <a className="contact-link" href="tel:+2347030648418">+234 703 064 8418 <ArrowRight size={15} /></a>
        </article>
      </div>

      <section className="contact-location">
        <div>
          <span className="contact-location__icon"><MapPin size={22} /></span>
          <span className="eyebrow">Where to find us</span>
          <h2>Hisah Tech, Minna</h2>
          <p>Suite B23/B22, Peniel Albarka Plaza<br />Opposite Federal High Court<br />Minna, Niger State, Nigeria</p>
        </div>
        <div className="contact-location__note">
          <strong>For the best support request</strong>
          <p>Include the device brand and model, the board number where available, and a concise description of the issue.</p>
          <Link href="/bios-files" className="resource-card__link">Explore the resource library <ArrowRight size={15} /></Link>
        </div>
      </section>
    </div>
  );
}
