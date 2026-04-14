import type { Metadata } from 'next'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'

const SITE_URL = 'https://atlaskings.com'
const SITE_NAME = 'Atlas Kings'

/**
 * Build a fully localised URL for a given path and lang.
 * EN uses clean URLs (/path), AR/FR use prefix (/ar/path, /fr/path).
 */
function localUrl(path: string, lang: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  return lang === 'en' ? `${SITE_URL}${clean}` : `${SITE_URL}/${lang}${clean}`
}

/**
 * Generate alternates.languages map for EN/AR/FR versions of a path.
 */
function alternateLanguages(path: string): Record<string, string> {
  const clean = path.startsWith('/') ? path : `/${path}`
  return {
    'en': `${SITE_URL}${clean}`,
    'ar': `${SITE_URL}/ar${clean}`,
    'fr': `${SITE_URL}/fr${clean}`,
    'x-default': `${SITE_URL}${clean}`,
  }
}

interface PageMeta {
  /** Page path WITHOUT lang prefix, e.g. "/morocco" or "/premier-league/scores" */
  path: string
  /** Title key from meta translations, or a literal string */
  titleKey: string
  /** Description key from meta translations, or a literal string */
  descKey?: string
}

// ─── Metadata translation map ───
// Keys map to localised title + description per lang.
// This keeps all page metadata in one place.
const META: Record<string, { en: { t: string; d: string }; ar: { t: string; d: string }; fr: { t: string; d: string } }> = {
  home: {
    en: { t: 'Atlas Kings — The Home of Moroccan Football', d: 'Live scores, fixtures, standings and news covering Botola Pro, the Atlas Lions, Champions League, Premier League and the 2030 World Cup.' },
    ar: { t: 'أطلس كينغز — موطن كرة القدم المغربية', d: 'نتائج مباشرة، مباريات، ترتيب وأخبار تغطي البطولة المحترفة، أسود الأطلس، دوري الأبطال، الدوري الإنجليزي وكأس العالم 2030.' },
    fr: { t: 'Atlas Kings — La Maison du Football Marocain', d: 'Scores en direct, calendrier, classements et actualités de la Botola Pro, les Lions de l\'Atlas, la Ligue des Champions, la Premier League et la Coupe du Monde 2030.' },
  },
  morocco: {
    en: { t: 'Morocco — Atlas Lions — Atlas Kings', d: 'Morocco national football team — news, scores, fixtures, squad and World Cup coverage.' },
    ar: { t: 'المغرب — أسود الأطلس — أطلس كينغز', d: 'المنتخب الوطني المغربي — أخبار، نتائج، مباريات، تشكيلة وتغطية كأس العالم.' },
    fr: { t: 'Maroc — Lions de l\'Atlas — Atlas Kings', d: 'Équipe nationale du Maroc — actualités, scores, calendrier, effectif et couverture de la Coupe du Monde.' },
  },
  'morocco/key-players': {
    en: { t: 'WC 2026 Squad — Morocco — Atlas Kings', d: 'Morocco\'s predicted 26-man World Cup 2026 squad — status, stats, and editorial analysis for every player.' },
    ar: { t: 'تشكيلة مونديال 2026 — المغرب — أطلس كينغز', d: 'التشكيلة المتوقعة للمغرب المكونة من 26 لاعبًا لكأس العالم 2026 — الحالة والتحليل لكل لاعب.' },
    fr: { t: 'Effectif CM 2026 — Maroc — Atlas Kings', d: 'L\'effectif prevu de 26 joueurs du Maroc pour la Coupe du Monde 2026 — statut et analyse editoriale.' },
  },
  'morocco/news': {
    en: { t: 'Morocco News — Atlas Kings', d: 'Latest news about the Morocco national football team.' },
    ar: { t: 'أخبار المغرب — أطلس كينغز', d: 'آخر أخبار المنتخب الوطني المغربي لكرة القدم.' },
    fr: { t: 'Actualités Maroc — Atlas Kings', d: 'Les dernières nouvelles de l\'équipe nationale du Maroc.' },
  },
  'morocco/qualification': {
    en: { t: 'Morocco Qualification — World Cup 2026 — Atlas Kings', d: 'Morocco\'s World Cup 2026 qualification — group standings, fixtures and results.' },
    ar: { t: 'تأهل المغرب — مونديال 2026 — أطلس كينغز', d: 'تأهل المغرب لكأس العالم 2026 — ترتيب المجموعة، المباريات والنتائج.' },
    fr: { t: 'Qualification Maroc — CM 2026 — Atlas Kings', d: 'Qualification du Maroc pour la Coupe du Monde 2026 — classement du groupe, calendrier et résultats.' },
  },
  'morocco/fixtures': {
    en: { t: 'Scores & Fixtures — Morocco — Atlas Kings', d: 'Morocco national team scores, results and upcoming fixtures.' },
    ar: { t: 'النتائج والمباريات — المغرب — أطلس كينغز', d: 'نتائج ومباريات المنتخب الوطني المغربي.' },
    fr: { t: 'Scores & Calendrier — Maroc — Atlas Kings', d: 'Scores, résultats et calendrier de l\'équipe du Maroc.' },
  },
  'morocco/top-scorers': {
    en: { t: 'All-Time Top Scorers — Morocco — Atlas Kings', d: 'Morocco national team all-time top scorers, World Cup and AFCON scoring records, and today\'s active scorers.' },
    ar: { t: 'هدافو المنتخب عبر التاريخ — المغرب — أطلس كينغز', d: 'هدافو المنتخب الوطني المغربي عبر التاريخ، وأرقام كأس العالم وكأس أفريقيا، والهدافون الحاليون.' },
    fr: { t: 'Meilleurs buteurs de l\'histoire — Maroc — Atlas Kings', d: 'Les meilleurs buteurs de l\'histoire du Maroc, les records en Coupe du Monde et en CAN, et les buteurs en activité.' },
  },
  'morocco/squad': {
    en: { t: 'Morocco National Team Squad — Player Pool — Atlas Kings', d: 'The full Morocco national team squad and federation-registered player pool, grouped by position — every Atlas Lion currently eligible for the senior team.' },
    ar: { t: 'تشكيلة المنتخب المغربي — مجموع اللاعبين — أطلس كينغز', d: 'التشكيلة الكاملة للمنتخب الوطني المغربي ومجموع اللاعبين المسجّلين لدى الجامعة، مرتّبين حسب المراكز — كل لاعب أسود الأطلس مؤهّل حالياً للمنتخب الأول.' },
    fr: { t: "Effectif de l'équipe nationale du Maroc — Vivier — Atlas Kings", d: "L'effectif complet de l'équipe nationale du Maroc et le vivier de joueurs inscrits à la fédération, regroupés par poste — chaque Lion de l'Atlas actuellement éligible pour la sélection A." },
  },
  'botola-pro': {
    en: { t: 'Botola Pro — Atlas Kings', d: 'Moroccan top flight football — scores, standings and news.' },
    ar: { t: 'البطولة المحترفة — أطلس كينغز', d: 'الدوري المغربي — النتائج، الترتيب والأخبار.' },
    fr: { t: 'Botola Pro — Atlas Kings', d: 'Le championnat marocain — scores, classement et actualités.' },
  },
  'botola-pro/scores': {
    en: { t: 'Scores & Fixtures — Botola Pro — Atlas Kings', d: 'Botola Pro scores, results and fixtures.' },
    ar: { t: 'النتائج والمباريات — البطولة المحترفة — أطلس كينغز', d: 'نتائج ومباريات البطولة المحترفة.' },
    fr: { t: 'Scores & Calendrier — Botola Pro — Atlas Kings', d: 'Scores, résultats et calendrier de la Botola Pro.' },
  },
  'botola-pro/table': {
    en: { t: 'Botola Pro League Table & Standings — Atlas Kings', d: 'Live Botola Pro league table, standings, points and goal difference for every club in the Moroccan top flight.' },
    ar: { t: 'ترتيب البطولة الاحترافية المغربية — أطلس كينغز', d: 'ترتيب الدوري المغربي مباشر، النقاط وفارق الأهداف لجميع أندية البطولة الاحترافية.' },
    fr: { t: 'Classement & tableau de la Botola Pro — Atlas Kings', d: 'Classement en direct de la Botola Pro, points et différence de buts pour chaque club du championnat marocain.' },
  },
  'botola-pro/teams': {
    en: { t: 'Teams — Botola Pro — Atlas Kings', d: 'Botola Pro teams.' },
    ar: { t: 'الفرق — البطولة المحترفة — أطلس كينغز', d: 'فرق البطولة المحترفة.' },
    fr: { t: 'Équipes — Botola Pro — Atlas Kings', d: 'Les équipes de la Botola Pro.' },
  },
  'botola-pro/top-scorers': {
    en: { t: 'Top Scorers — Botola Pro — Atlas Kings', d: 'Botola Pro top scorers.' },
    ar: { t: 'هدافو الدوري — البطولة المحترفة — أطلس كينغز', d: 'هدافو البطولة المحترفة.' },
    fr: { t: 'Meilleurs buteurs — Botola Pro — Atlas Kings', d: 'Les meilleurs buteurs de la Botola Pro.' },
  },
  'premier-league': {
    en: { t: 'Premier League — Atlas Kings', d: 'English Premier League news, scores, fixtures and standings.' },
    ar: { t: 'الدوري الإنجليزي — أطلس كينغز', d: 'أخبار الدوري الإنجليزي الممتاز — النتائج، المباريات والترتيب.' },
    fr: { t: 'Premier League — Atlas Kings', d: 'Actualités de la Premier League — scores, calendrier et classement.' },
  },
  'premier-league/scores': {
    en: { t: 'Scores & Fixtures — Premier League — Atlas Kings', d: 'Premier League scores, results and fixtures.' },
    ar: { t: 'النتائج والمباريات — الدوري الإنجليزي — أطلس كينغز', d: 'نتائج ومباريات الدوري الإنجليزي.' },
    fr: { t: 'Scores & Calendrier — Premier League — Atlas Kings', d: 'Scores et calendrier de la Premier League.' },
  },
  'premier-league/table': {
    en: { t: 'Premier League Table & Standings 2025-26 — Atlas Kings', d: 'Live Premier League table, standings, points, form and goal difference for every club in the English top flight.' },
    ar: { t: 'ترتيب الدوري الإنجليزي الممتاز 2025-26 — أطلس كينغز', d: 'ترتيب الدوري الإنجليزي الممتاز مباشر، النقاط والفورمة وفارق الأهداف لجميع أندية البريميرليغ.' },
    fr: { t: 'Classement Premier League 2025-26 — Atlas Kings', d: "Classement en direct de la Premier League, points, forme et différence de buts pour chaque club du championnat anglais." },
  },
  'premier-league/teams': {
    en: { t: 'Teams — Premier League — Atlas Kings', d: 'Premier League teams.' },
    ar: { t: 'الفرق — الدوري الإنجليزي — أطلس كينغز', d: 'فرق الدوري الإنجليزي.' },
    fr: { t: 'Équipes — Premier League — Atlas Kings', d: 'Les équipes de la Premier League.' },
  },
  'premier-league/top-scorers': {
    en: { t: 'Top Scorers — Premier League — Atlas Kings', d: 'Premier League top scorers.' },
    ar: { t: 'هدافو الدوري — الدوري الإنجليزي — أطلس كينغز', d: 'هدافو الدوري الإنجليزي.' },
    fr: { t: 'Meilleurs buteurs — Premier League — Atlas Kings', d: 'Les meilleurs buteurs de la Premier League.' },
  },
  'premier-league/transfers': {
    en: { t: 'Transfers — Premier League — Atlas Kings', d: 'Premier League transfer news and done deals.' },
    ar: { t: 'الانتقالات — الدوري الإنجليزي — أطلس كينغز', d: 'أخبار انتقالات الدوري الإنجليزي.' },
    fr: { t: 'Transferts — Premier League — Atlas Kings', d: 'Actualités des transferts de la Premier League.' },
  },
  'la-liga': {
    en: { t: 'La Liga — Atlas Kings', d: 'Spanish La Liga news, scores, fixtures and standings.' },
    ar: { t: 'الليغا — أطلس كينغز', d: 'أخبار الدوري الإسباني — النتائج، المباريات والترتيب.' },
    fr: { t: 'La Liga — Atlas Kings', d: 'Actualités de La Liga — scores, calendrier et classement.' },
  },
  'la-liga/scores': {
    en: { t: 'Scores & Fixtures — La Liga — Atlas Kings', d: 'La Liga scores, results and fixtures.' },
    ar: { t: 'النتائج والمباريات — الليغا — أطلس كينغز', d: 'نتائج ومباريات الليغا.' },
    fr: { t: 'Scores & Calendrier — La Liga — Atlas Kings', d: 'Scores et calendrier de La Liga.' },
  },
  'la-liga/table': {
    en: { t: 'La Liga Table & Standings 2025-26 — Atlas Kings', d: 'Live La Liga table, standings, points, form and goal difference for every club in the Spanish top flight.' },
    ar: { t: 'ترتيب الليغا الإسبانية 2025-26 — أطلس كينغز', d: 'ترتيب الليغا مباشر، النقاط والفورمة وفارق الأهداف لجميع أندية الدوري الإسباني.' },
    fr: { t: 'Classement La Liga 2025-26 — Atlas Kings', d: "Classement en direct de La Liga, points, forme et différence de buts pour chaque club du championnat espagnol." },
  },
  'la-liga/teams': {
    en: { t: 'Teams — La Liga — Atlas Kings', d: 'La Liga teams.' },
    ar: { t: 'الفرق — الليغا — أطلس كينغز', d: 'فرق الليغا.' },
    fr: { t: 'Équipes — La Liga — Atlas Kings', d: 'Les équipes de La Liga.' },
  },
  'la-liga/top-scorers': {
    en: { t: 'Top Scorers — La Liga — Atlas Kings', d: 'La Liga top scorers.' },
    ar: { t: 'هدافو الدوري — الليغا — أطلس كينغز', d: 'هدافو الليغا.' },
    fr: { t: 'Meilleurs buteurs — La Liga — Atlas Kings', d: 'Les meilleurs buteurs de La Liga.' },
  },
  'la-liga/transfers': {
    en: { t: 'Transfers — La Liga — Atlas Kings', d: 'La Liga transfer news and done deals.' },
    ar: { t: 'الانتقالات — الليغا — أطلس كينغز', d: 'أخبار انتقالات الليغا.' },
    fr: { t: 'Transferts — La Liga — Atlas Kings', d: 'Actualités des transferts de La Liga.' },
  },
  'champions-league': {
    en: { t: 'Champions League — Atlas Kings', d: 'UEFA Champions League news, scores, fixtures and results.' },
    ar: { t: 'دوري الأبطال — أطلس كينغز', d: 'أخبار دوري أبطال أوروبا — النتائج، المباريات والترتيب.' },
    fr: { t: 'Ligue des Champions — Atlas Kings', d: 'Actualités de la Ligue des Champions — scores, calendrier et résultats.' },
  },
  'champions-league/scores': {
    en: { t: 'Scores & Fixtures — Champions League — Atlas Kings', d: 'Champions League scores, results and fixtures.' },
    ar: { t: 'النتائج والمباريات — دوري الأبطال — أطلس كينغز', d: 'نتائج ومباريات دوري الأبطال.' },
    fr: { t: 'Scores & Calendrier — Ligue des Champions — Atlas Kings', d: 'Scores et calendrier de la Ligue des Champions.' },
  },
  'champions-league/groups': {
    en: { t: 'Groups — Champions League — Atlas Kings', d: 'Champions League group standings.' },
    ar: { t: 'المجموعات — دوري الأبطال — أطلس كينغز', d: 'ترتيب مجموعات دوري الأبطال.' },
    fr: { t: 'Groupes — Ligue des Champions — Atlas Kings', d: 'Classement des groupes de la Ligue des Champions.' },
  },
  'champions-league/teams': {
    en: { t: 'Teams — Champions League — Atlas Kings', d: 'Champions League teams.' },
    ar: { t: 'الفرق — دوري الأبطال — أطلس كينغز', d: 'فرق دوري الأبطال.' },
    fr: { t: 'Équipes — Ligue des Champions — Atlas Kings', d: 'Les équipes de la Ligue des Champions.' },
  },
  'champions-league/stats': {
    en: { t: 'Player Stats — Champions League — Atlas Kings', d: 'Champions League top scorers, assists and cards.' },
    ar: { t: 'إحصاءات اللاعبين — دوري الأبطال — أطلس كينغز', d: 'هدافو ومساعدو دوري الأبطال.' },
    fr: { t: 'Statistiques joueurs — Ligue des Champions — Atlas Kings', d: 'Buteurs, passeurs et cartons de la Ligue des Champions.' },
  },
  'champions-league/bracket': {
    en: { t: 'Bracket — Champions League — Atlas Kings', d: 'Champions League knockout bracket.' },
    ar: { t: 'شجرة البطولة — دوري الأبطال — أطلس كينغز', d: 'شجرة الأدوار الإقصائية لدوري الأبطال.' },
    fr: { t: 'Tableau — Ligue des Champions — Atlas Kings', d: 'Tableau des éliminatoires de la Ligue des Champions.' },
  },
  'champions-league/table': {
    en: { t: 'Table — Champions League — Atlas Kings', d: 'Champions League league-phase standings.' },
    ar: { t: 'الترتيب — دوري الأبطال — أطلس كينغز', d: 'ترتيب مرحلة الدوري في دوري الأبطال.' },
    fr: { t: 'Classement — Ligue des Champions — Atlas Kings', d: 'Classement de la phase de ligue de la Ligue des Champions.' },
  },
  'premier-league/stats': {
    en: { t: 'Player Stats — Premier League — Atlas Kings', d: 'Premier League top scorers, assists and cards.' },
    ar: { t: 'إحصاءات اللاعبين — الدوري الإنجليزي — أطلس كينغز', d: 'هدافو ومساعدو الدوري الإنجليزي.' },
    fr: { t: 'Statistiques joueurs — Premier League — Atlas Kings', d: 'Buteurs, passeurs et cartons de la Premier League.' },
  },
  'la-liga/stats': {
    en: { t: 'Player Stats — La Liga — Atlas Kings', d: 'La Liga top scorers, assists and cards.' },
    ar: { t: 'إحصاءات اللاعبين — الليغا — أطلس كينغز', d: 'هدافو ومساعدو الليغا.' },
    fr: { t: 'Statistiques joueurs — La Liga — Atlas Kings', d: 'Buteurs, passeurs et cartons de La Liga.' },
  },
  'botola-pro/stats': {
    en: { t: 'Player Stats — Botola Pro — Atlas Kings', d: 'Botola Pro top scorers, assists and cards.' },
    ar: { t: 'إحصاءات اللاعبين — البطولة المحترفة — أطلس كينغز', d: 'هدافو ومساعدو البطولة المحترفة.' },
    fr: { t: 'Statistiques joueurs — Botola Pro — Atlas Kings', d: 'Buteurs, passeurs et cartons de la Botola Pro.' },
  },
  transfers: {
    en: { t: 'Football Transfer News & Done Deals — Atlas Kings', d: 'Latest football transfer news across Morocco, Botola Pro and the top European leagues — confirmed done deals, rumours and targets.' },
    ar: { t: 'أخبار انتقالات كرة القدم والصفقات المكتملة — أطلس كينغز', d: 'آخر أخبار انتقالات كرة القدم في المغرب والبطولة الاحترافية وكبرى الدوريات الأوروبية — صفقات مؤكّدة وشائعات ومساعي.' },
    fr: { t: "Transferts football & transferts conclus — Atlas Kings", d: "Actualité des transferts football au Maroc, en Botola Pro et dans les grands championnats européens — transferts officiels, rumeurs et pistes." },
  },
  'transfers/done-deals': {
    en: { t: 'Done Deals — Transfers — Atlas Kings', d: 'Confirmed football transfer done deals.' },
    ar: { t: 'صفقات مكتملة — الانتقالات — أطلس كينغز', d: 'الصفقات المكتملة والمؤكدة.' },
    fr: { t: 'Transferts conclus — Atlas Kings', d: 'Les transferts confirmés.' },
  },
  scores: {
    en: { t: 'Football Scores & Live Results — Atlas Kings', d: 'Live football scores and results across Morocco, Botola Pro, Premier League, La Liga, Champions League and the World Cup — updated in real time.' },
    ar: { t: 'نتائج مباشرة ومباريات كرة القدم — أطلس كينغز', d: 'نتائج مباشرة لمباريات المغرب والبطولة الاحترافية والدوري الإنجليزي والليغا ودوري الأبطال وكأس العالم — تحديث فوري.' },
    fr: { t: "Scores football & résultats en direct — Atlas Kings", d: "Scores et résultats en direct du Maroc, Botola Pro, Premier League, La Liga, Ligue des Champions et Coupe du Monde — mis à jour en temps réel." },
  },
  standings: {
    en: { t: 'Football League Tables & Standings — Morocco, Europe & the World Cup — Atlas Kings', d: 'League tables and standings for Botola Pro, Premier League, La Liga, Champions League and the 2026 World Cup — every competition Atlas Kings covers.' },
    ar: { t: 'جداول وترتيب الدوريات — المغرب وأوروبا وكأس العالم — أطلس كينغز', d: 'جداول الترتيب للبطولة الاحترافية والدوري الإنجليزي والليغا ودوري الأبطال وكأس العالم 2026.' },
    fr: { t: "Classements et tableaux du football — Maroc, Europe & Coupe du Monde — Atlas Kings", d: "Classements de la Botola Pro, Premier League, La Liga, Ligue des Champions et Coupe du Monde 2026 — toutes les compétitions couvertes par Atlas Kings." },
  },
  'world-cup-2026': {
    en: { t: 'FIFA World Cup 2026 — Atlas Kings', d: 'Morocco at the 2026 FIFA World Cup — news, fixtures, squad, groups and scores.' },
    ar: { t: 'كأس العالم 2026 — أطلس كينغز', d: 'المغرب في كأس العالم 2026 — أخبار، مباريات، تشكيلة، مجموعات ونتائج.' },
    fr: { t: 'Coupe du Monde 2026 — Atlas Kings', d: 'Le Maroc à la Coupe du Monde 2026 — actualités, calendrier, effectif, groupes et scores.' },
  },
  'world-cup-2026/scores': {
    en: { t: 'Scores & Fixtures — World Cup 2026 — Atlas Kings', d: 'World Cup 2026 scores and fixtures.' },
    ar: { t: 'النتائج والمباريات — مونديال 2026 — أطلس كينغز', d: 'نتائج ومباريات كأس العالم 2026.' },
    fr: { t: 'Scores & Calendrier — CM 2026 — Atlas Kings', d: 'Scores et calendrier de la Coupe du Monde 2026.' },
  },
  'world-cup-2026/groups': {
    en: { t: 'Groups — World Cup 2026 — Atlas Kings', d: 'World Cup 2026 group standings.' },
    ar: { t: 'المجموعات — مونديال 2026 — أطلس كينغز', d: 'ترتيب مجموعات كأس العالم 2026.' },
    fr: { t: 'Groupes — CM 2026 — Atlas Kings', d: 'Classement des groupes de la CM 2026.' },
  },
  'world-cup-2026/bracket': {
    en: { t: 'Bracket — World Cup 2026 — Atlas Kings', d: 'World Cup 2026 knockout bracket from Round of 32 to the final.' },
    ar: { t: 'شجرة البطولة — مونديال 2026 — أطلس كينغز', d: 'شجرة الأدوار الإقصائية لكأس العالم 2026.' },
    fr: { t: 'Tableau — CM 2026 — Atlas Kings', d: 'Tableau des éliminatoires de la CM 2026.' },
  },
  'world-cup-2026/teams': {
    en: { t: 'Teams — World Cup 2026 — Atlas Kings', d: 'All 48 teams at the 2026 FIFA World Cup.' },
    ar: { t: 'المنتخبات — مونديال 2026 — أطلس كينغز', d: 'جميع المنتخبات الـ48 في كأس العالم 2026.' },
    fr: { t: 'Équipes — CM 2026 — Atlas Kings', d: 'Les 48 équipes de la CM 2026.' },
  },
  'world-cup-2026/stats': {
    en: { t: 'Player Stats — World Cup 2026 — Atlas Kings', d: 'World Cup 2026 top scorers, assists and cards.' },
    ar: { t: 'إحصاءات اللاعبين — مونديال 2026 — أطلس كينغز', d: 'هدافو ومساعدو كأس العالم 2026.' },
    fr: { t: 'Statistiques joueurs — CM 2026 — Atlas Kings', d: 'Buteurs, passeurs et cartons de la CM 2026.' },
  },
  'world-cup-2026/predictor': {
    en: { t: 'Predictor — World Cup 2026 — Atlas Kings', d: 'Predict the 2026 World Cup bracket and compete with friends.' },
    ar: { t: 'التوقعات — مونديال 2026 — أطلس كينغز', d: 'توقع نتائج كأس العالم 2026 وتنافس مع أصدقائك.' },
    fr: { t: 'Pronostics — CM 2026 — Atlas Kings', d: 'Pronostiquez le tableau de la CM 2026 et défiez vos amis.' },
  },
  'world-cup-2030': {
    en: { t: 'FIFA World Cup 2030 — Atlas Kings', d: 'Morocco hosts the 2030 FIFA World Cup. Stadiums, host cities, news and tournament guide.' },
    ar: { t: 'كأس العالم 2030 — أطلس كينغز', d: 'المغرب يستضيف كأس العالم 2030. الملاعب، المدن المضيفة والأخبار.' },
    fr: { t: 'Coupe du Monde 2030 — Atlas Kings', d: 'Le Maroc accueille la Coupe du Monde 2030. Stades, villes hôtes et guide du tournoi.' },
  },
  'world-cup-2030/stadiums': {
    en: { t: "Morocco's Six World Cup Stadiums — WC 2030 — Atlas Kings", d: 'Deep-dive guide to the six Moroccan stadiums hosting the 2030 FIFA World Cup — from the 115,000-seat Grand Stade Hassan II to the Atlantic shores of Agadir.' },
    ar: { t: 'ملاعب كأس العالم الستة في المغرب — مونديال 2030 — أطلس كينغز', d: 'دليل تفصيلي للملاعب الستة التي ستستضيف كأس العالم 2030 في المغرب — من ملعب الحسن الثاني الكبير بسعة 115,000 مقعد إلى شواطئ أكادير الأطلسية.' },
    fr: { t: 'Les six stades de la Coupe du Monde au Maroc — CM 2030 — Atlas Kings', d: 'Guide approfondi des six stades marocains qui accueilleront la Coupe du Monde FIFA 2030 — du Grand Stade Hassan II de 115 000 places aux rivages atlantiques d\'Agadir.' },
  },
  'world-cup-2030/cities': {
    en: { t: "Host Cities — Morocco WC 2030 — Atlas Kings", d: 'Guide to the six Moroccan host cities for the 2030 FIFA World Cup — Casablanca, Rabat, Marrakech, Tangier, Fes and Agadir.' },
    ar: { t: 'المدن المضيفة — المغرب مونديال 2030 — أطلس كينغز', d: 'دليل للمدن المغربية الست المضيفة لكأس العالم 2030 — الدار البيضاء والرباط ومراكش وطنجة وفاس وأكادير.' },
    fr: { t: "Villes hôtes — Maroc CM 2030 — Atlas Kings", d: "Guide des six villes marocaines hôtes de la Coupe du Monde 2030 — Casablanca, Rabat, Marrakech, Tanger, Fès et Agadir." },
  },
  'world-cup-2030/construction': {
    en: { t: 'Construction & Infrastructure — Morocco WC 2030 — Atlas Kings', d: "Tracking Morocco's $16 billion investment in stadiums, transport and hospitality infrastructure for the 2030 FIFA World Cup." },
    ar: { t: 'البناء والبنية التحتية — مونديال المغرب 2030 — أطلس كينغز', d: 'متابعة استثمار المغرب البالغ 16 مليار دولار في الملاعب والنقل والبنية التحتية للضيافة لكأس العالم 2030.' },
    fr: { t: 'Construction & infrastructures — Maroc CM 2030 — Atlas Kings', d: "Suivi de l'investissement de 16 milliards de dollars du Maroc dans les stades, les transports et l'hôtellerie pour la Coupe du Monde 2030." },
  },
  'world-cup-2030/travel': {
    en: { t: 'Travel Guide — Morocco WC 2030 — Atlas Kings', d: 'Travel guide for fans attending the 2030 FIFA World Cup in Morocco — visas, airports, getting around, food, culture, weather and budget.' },
    ar: { t: 'دليل السفر — مونديال المغرب 2030 — أطلس كينغز', d: 'دليل السفر لمشجعي كأس العالم 2030 في المغرب — التأشيرات، المطارات، التنقل، الطعام، الثقافة، الطقس والميزانية.' },
    fr: { t: 'Guide de voyage — Maroc CM 2030 — Atlas Kings', d: "Guide de voyage pour les supporters de la Coupe du Monde 2030 au Maroc — visas, aéroports, transports, gastronomie, culture, météo et budget." },
  },
  'world-cup-2030/tickets': {
    en: { t: 'Tickets & FAQ — Morocco WC 2030 — Atlas Kings', d: 'Everything you need to know about buying tickets for the 2030 FIFA World Cup in Morocco — prices, ballot, Fan ID and the 15 most common questions.' },
    ar: { t: 'التذاكر والأسئلة الشائعة — مونديال المغرب 2030 — أطلس كينغز', d: 'كل ما تحتاج معرفته حول شراء تذاكر كأس العالم 2030 في المغرب — الأسعار، القرعة، بطاقة المشجع، وأكثر 15 سؤالاً شيوعاً.' },
    fr: { t: 'Billets & FAQ — Maroc CM 2030 — Atlas Kings', d: "Tout ce qu'il faut savoir pour acheter des billets pour la Coupe du Monde 2030 au Maroc — prix, tirage au sort, Fan ID et les 15 questions les plus fréquentes." },
  },
  advertise: {
    en: { t: 'Advertise — Atlas Kings', d: 'Advertising opportunities on Atlas Kings.' },
    ar: { t: 'الإعلان — أطلس كينغز', d: 'فرص الإعلان على أطلس كينغز.' },
    fr: { t: 'Publicité — Atlas Kings', d: 'Opportunités publicitaires sur Atlas Kings.' },
  },
  about: {
    en: { t: 'About — Atlas Kings', d: 'About Atlas Kings — the home of Moroccan football.' },
    ar: { t: 'من نحن — أطلس كينغز', d: 'حول أطلس كينغز — موطن كرة القدم المغربية.' },
    fr: { t: 'À propos — Atlas Kings', d: 'À propos d\'Atlas Kings — la maison du football marocain.' },
  },
  contact: {
    en: { t: 'Contact — Atlas Kings', d: 'Contact Atlas Kings.' },
    ar: { t: 'تواصل معنا — أطلس كينغز', d: 'تواصل مع أطلس كينغز.' },
    fr: { t: 'Contact — Atlas Kings', d: 'Contactez Atlas Kings.' },
  },
  privacy: {
    en: { t: 'Privacy Policy — Atlas Kings', d: 'Atlas Kings privacy policy.' },
    ar: { t: 'سياسة الخصوصية — أطلس كينغز', d: 'سياسة الخصوصية لأطلس كينغز.' },
    fr: { t: 'Politique de confidentialité — Atlas Kings', d: 'Politique de confidentialité d\'Atlas Kings.' },
  },
  terms: {
    en: { t: 'Terms of Service — Atlas Kings', d: 'Atlas Kings terms of service.' },
    ar: { t: 'شروط الاستخدام — أطلس كينغز', d: 'شروط استخدام أطلس كينغز.' },
    fr: { t: 'Conditions d\'utilisation — Atlas Kings', d: 'Conditions d\'utilisation d\'Atlas Kings.' },
  },
  cookies: {
    en: { t: 'Cookie Policy — Atlas Kings', d: 'Atlas Kings cookie policy.' },
    ar: { t: 'سياسة ملفات تعريف الارتباط — أطلس كينغز', d: 'سياسة ملفات تعريف الارتباط لأطلس كينغز.' },
    fr: { t: 'Politique de cookies — Atlas Kings', d: 'Politique de cookies d\'Atlas Kings.' },
  },
  editorial: {
    en: { t: 'Editorial Guidelines — Atlas Kings', d: 'Atlas Kings editorial guidelines.' },
    ar: { t: 'المبادئ التحريرية — أطلس كينغز', d: 'المبادئ التحريرية لأطلس كينغز.' },
    fr: { t: 'Charte éditoriale — Atlas Kings', d: 'Charte éditoriale d\'Atlas Kings.' },
  },
}

/**
 * Generate fully localised Metadata for a page.
 *
 * Usage in page.tsx:
 * ```ts
 * export async function generateMetadata({ params }: Props) {
 *   const { lang } = await params
 *   return pageMetadata('morocco', lang, '/morocco')
 * }
 * ```
 */
export function pageMetadata(key: string, lang: string, path: string): Metadata {
  const validLang = (['en', 'ar', 'fr'].includes(lang) ? lang : 'en') as 'en' | 'ar' | 'fr'
  const entry = META[key]
  const m = entry?.[validLang] ?? entry?.en ?? { t: `Atlas Kings`, d: '' }

  return {
    // `absolute` bypasses the root layout's title.template (`%s — Atlas Kings`)
    // because META[key] titles already end with "— Atlas Kings". Without
    // `absolute`, Next.js double-wraps them ("X — Atlas Kings — Atlas Kings").
    title: { absolute: m.t },
    description: m.d || undefined,
    alternates: {
      canonical: localUrl(path, validLang),
      languages: alternateLanguages(path),
    },
    openGraph: {
      title: m.t,
      description: m.d || undefined,
      siteName: SITE_NAME,
      url: localUrl(path, validLang),
      locale: validLang === 'ar' ? 'ar_MA' : validLang === 'fr' ? 'fr_FR' : 'en_GB',
    },
  }
}
