export type Lang = 'en' | 'ar' | 'fr'

export const SUPPORTED_LANGS: Lang[] = ['en', 'ar', 'fr']
export const DEFAULT_LANG: Lang = 'en'

// Language display info
export const LANG_META: Record<Lang, { label: string; dir: 'ltr' | 'rtl'; locale: string }> = {
  en: { label: 'EN', dir: 'ltr', locale: 'en_GB' },
  ar: { label: 'AR', dir: 'rtl', locale: 'ar_MA' },
  fr: { label: 'FR', dir: 'ltr', locale: 'fr_FR' },
}

// Arabic-speaking countries → /ar
export const ARABIC_COUNTRIES = new Set([
  'MA', // Morocco ← primary audience
  'DZ', // Algeria
  'TN', // Tunisia
  'LY', // Libya
  'EG', // Egypt
  'SA', // Saudi Arabia
  'AE', // UAE
  'IQ', // Iraq
  'KW', // Kuwait
  'QA', // Qatar
  'BH', // Bahrain
  'OM', // Oman
  'YE', // Yemen
  'JO', // Jordan
  'LB', // Lebanon
  'SY', // Syria
  'SD', // Sudan
  'MR', // Mauritania
  'SO', // Somalia
  'KM', // Comoros
  'DJ', // Djibouti
  'PS', // Palestine
])

// French-speaking countries → /fr
export const FRENCH_COUNTRIES = new Set([
  'FR', // France
  'BE', // Belgium
  'CH', // Switzerland
  'LU', // Luxembourg
  'MC', // Monaco
  'CI', // Côte d'Ivoire
  'SN', // Senegal
  'ML', // Mali
  'BF', // Burkina Faso
  'NE', // Niger
  'TG', // Togo
  'BJ', // Benin
  'GA', // Gabon
  'CG', // Congo
  'CD', // DR Congo
  'CM', // Cameroon
  'MG', // Madagascar
  'RW', // Rwanda
  'BI', // Burundi
  'SC', // Seychelles
  'MU', // Mauritius
  'HT', // Haiti
  'CA', // Canada (Quebec)
])

// Detect language from country code
export function detectLangFromCountry(country: string | null): Lang {
  if (!country) return DEFAULT_LANG
  if (ARABIC_COUNTRIES.has(country)) return 'ar'
  if (FRENCH_COUNTRIES.has(country)) return 'fr'
  return 'en'
}

// Cookie name for language override
export const LANG_COOKIE = 'atlas-lang'
export const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year
