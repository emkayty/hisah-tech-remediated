import { getCountries, getCountryCallingCode, type CountryCode } from 'libphonenumber-js';

export type CountryOption = { code: CountryCode; name: string; dialCode: string };

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

export const COUNTRY_OPTIONS: CountryOption[] = getCountries()
  .map((code) => ({
    code,
    name: regionNames.of(code) || code,
    dialCode: `+${getCountryCallingCode(code)}`,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function findCountry(value?: string | null) {
  const normalized = value?.trim().toLowerCase();
  return COUNTRY_OPTIONS.find((country) => country.code.toLowerCase() === normalized || country.name.toLowerCase() === normalized);
}
