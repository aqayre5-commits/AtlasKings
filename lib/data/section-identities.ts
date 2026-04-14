/**
 * Section identity config for branded banners + sticky subnavs.
 *
 * Each major section gets a dark identity strip above its subnav.
 * The subnav tabs are defined in each section's layout.tsx.
 */

export interface SectionIdentity {
  flag: string
  name: string
  tagline: { en: string; ar: string; fr: string }
  accentColor: string
}

export const SECTION_IDENTITIES: Record<string, SectionIdentity> = {
  morocco: {
    flag: '\uD83C\uDDF2\uD83C\uDDE6',
    name: 'MOROCCO \u00B7 ATLAS LIONS',
    tagline: {
      en: 'Home of the Atlas Lions',
      ar: '\u0628\u064A\u062A \u0623\u0633\u0648\u062F \u0627\u0644\u0623\u0637\u0644\u0633',
      fr: 'La maison des Lions de l\'Atlas',
    },
    accentColor: '#C1121F',
  },
  'botola-pro': {
    flag: '\uD83C\uDDF2\uD83C\uDDE6',
    name: 'BOTOLA PRO \u00B7 INWI',
    tagline: {
      en: 'Morocco\'s Premier Division',
      ar: '\u0627\u0644\u062F\u0648\u0631\u064A \u0627\u0644\u0627\u062D\u062A\u0631\u0627\u0641\u064A \u0627\u0644\u0645\u063A\u0631\u0628\u064A',
      fr: 'La premiere division marocaine',
    },
    accentColor: '#006233',
  },
  'wc-2026': {
    flag: '\uD83C\uDFC6',
    name: 'FIFA WORLD CUP 2026',
    tagline: {
      en: 'Morocco in the USA \u00B7 Jun 15 \u2013 Jul 19',
      ar: '\u0627\u0644\u0645\u063A\u0631\u0628 \u0641\u064A \u0643\u0623\u0633 \u0627\u0644\u0639\u0627\u0644\u0645 2026',
      fr: 'Le Maroc a la Coupe du Monde 2026',
    },
    accentColor: '#B8820A',
  },
  'wc-2030': {
    flag: '\uD83C\uDFC6',
    name: 'FIFA WORLD CUP 2030',
    tagline: {
      en: 'Morocco co-hosts the centenary World Cup',
      ar: '\u0627\u0644\u0645\u063A\u0631\u0628 \u064A\u0633\u062A\u0636\u064A\u0641 \u0643\u0623\u0633 \u0627\u0644\u0639\u0627\u0644\u0645 2030',
      fr: 'Le Maroc co-organise la Coupe du Monde 2030',
    },
    accentColor: '#B8820A',
  },
}
