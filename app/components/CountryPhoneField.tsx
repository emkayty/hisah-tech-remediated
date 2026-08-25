'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { COUNTRY_OPTIONS, findCountry } from '@/lib/countries';

type CountryPhoneFieldProps = {
  countryName?: string;
  phoneName?: string;
  defaultCountry?: string;
  defaultPhone?: string;
  required?: boolean;
  detectCountry?: boolean;
};

function splitPhone(value: string, dialCode: string) {
  const normalized = value.trim().replace(/[\s()-]/g, '');
  if (!normalized) return '';
  if (normalized.startsWith(dialCode)) return normalized.slice(dialCode.length).replace(/^0/, '');
  if (normalized.startsWith('+')) return normalized.replace(/^\+\d{1,4}/, '').replace(/^0/, '');
  return normalized.replace(/^0/, '');
}

export default function CountryPhoneField({ countryName = 'country', phoneName = 'whatsapp_number', defaultCountry = '', defaultPhone = '', required = true, detectCountry = false }: CountryPhoneFieldProps) {
  const initialCountry = findCountry(defaultCountry)?.code || '';
  const [countryCode, setCountryCode] = useState(initialCountry);
  const [localNumber, setLocalNumber] = useState(() => splitPhone(defaultPhone, findCountry(initialCountry)?.dialCode || ''));
  const [detected, setDetected] = useState(false);
  const manuallySelected = useRef(Boolean(initialCountry));
  const selectedCountry = useMemo(() => COUNTRY_OPTIONS.find((country) => country.code === countryCode), [countryCode]);

  useEffect(() => {
    setLocalNumber((current) => splitPhone(current, selectedCountry?.dialCode || ''));
  }, [selectedCountry?.dialCode]);

  useEffect(() => {
    if (!detectCountry || manuallySelected.current || countryCode) return;
    let active = true;
    fetch('/api/geo/country', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((data: { countryCode?: string | null } | null) => {
        if (!active || manuallySelected.current || !data?.countryCode || !findCountry(data.countryCode)) return;
        setCountryCode(data.countryCode);
        setDetected(true);
      })
      .catch(() => {
        // Detection is an enhancement. Registration remains fully usable without it.
      });
    return () => { active = false; };
  }, [countryCode, detectCountry]);

  const internationalNumber = selectedCountry && localNumber ? `${selectedCountry.dialCode}${localNumber.replace(/\D/g, '')}` : '';

  return (
    <div className="country-phone-field">
      <label><span className="form-label">Country</span><select className="form-control" name={countryName} value={countryCode} onChange={(event) => { manuallySelected.current = true; setDetected(false); setCountryCode(event.target.value); }} required={required}><option value="">Select your country</option>{COUNTRY_OPTIONS.map((country) => <option key={country.code} value={country.code}>{country.name} ({country.dialCode})</option>)}</select>{detected && <small className="form-hint form-hint--success">Suggested from your connection. You can change it anytime.</small>}</label>
      <label><span className="form-label">Mobile number</span><span className="phone-input"><span className="phone-input__prefix" aria-hidden="true">{selectedCountry?.dialCode || '+'}</span><input className="form-control" name={`${phoneName}_local`} type="tel" inputMode="tel" autoComplete="tel-national" value={localNumber} onChange={(event) => setLocalNumber(event.target.value)} placeholder={selectedCountry ? '80 1234 5678' : 'Select a country first'} disabled={!selectedCountry} required={required} /><input type="hidden" name={phoneName} value={internationalNumber} /></span><small className="form-hint">Your number will be saved with the {selectedCountry?.dialCode || 'selected country’s'} international code.</small></label>
    </div>
  );
}
