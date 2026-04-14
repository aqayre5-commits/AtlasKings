/**
 * WC 2030 host cities — shared data module.
 * ─────────────────────────────────────────────────────────────────────
 *
 * Phase E.2: fully localised body content for EN / AR / FR.
 *
 * Every language-facing field (kicker, facts, history, neighborhoods,
 * restaurants, accommodation, gettingThere, matchday, dontMiss) now
 * carries an {en, ar, fr} triple so that AR and FR readers get the
 * same flagship experience as EN. Mirrors the stadiums B.2 pattern.
 *
 * Stable flat fields:
 *   slug, emoji, nameEn (canonical EN proper noun), nameAr (Arabic
 *   display subtitle — intentionally same across all three locales),
 *   accent, population, region (used by Schema.org addressRegion),
 *   geo coordinates.
 *
 * Anchor slugs are STABLE and match the previous in-file section ids
 * (casablanca, rabat, marrakech, tangier, fes, agadir). Any rename
 * would break inbound deep links — do not touch without checking the
 * sitemap and any external references.
 */

import type { Lang } from '@/lib/i18n/config'

// ── Primitive data shapes ────────────────────────────────────────────

export interface CityFact {
  label: string
  value: string
}

/** Single list item for Neighborhoods, Restaurants, Don't Miss blocks */
export interface CityItemEntry {
  name: string
  desc: string
}

/** Accommodation tier (Budget / Mid-Range / Luxury) */
export interface CityStayTier {
  tier: string
  range: string
  desc: string
}

/** Getting-there row. Each city has 3–4 rows depending on its mix of
 *  airport / train / ferry / bus / tips. */
export interface CityGettingThereRow {
  /** Unicode icon rendered inline with the label (e.g. "✈", "🚄", "💡") */
  icon: string
  label: string
  detail: string
}

// ── Localisation shapes ──────────────────────────────────────────────

export interface LocalisedString {
  en: string
  ar: string
  fr: string
}

export interface LocalisedStrings {
  en: string[]
  ar: string[]
  fr: string[]
}

export interface LocalisedFacts {
  en: CityFact[]
  ar: CityFact[]
  fr: CityFact[]
}

export interface LocalisedItems {
  en: CityItemEntry[]
  ar: CityItemEntry[]
  fr: CityItemEntry[]
}

export interface LocalisedStayTiers {
  en: CityStayTier[]
  ar: CityStayTier[]
  fr: CityStayTier[]
}

export interface LocalisedGettingThere {
  en: CityGettingThereRow[]
  ar: CityGettingThereRow[]
  fr: CityGettingThereRow[]
}

/**
 * Generic locale picker. Falls back to EN if a locale is missing.
 */
export function pickLocale<T>(field: { en: T; ar: T; fr: T }, lang: Lang): T {
  return field[lang] ?? field.en
}

// ── City interface ───────────────────────────────────────────────────

export interface WC2030HostCity {
  /** URL-safe slug — also used as anchor id on the cities page */
  slug: string
  /** Header emoji for the city block */
  emoji: string
  /** Canonical English display name (stable across locales) */
  nameEn: string
  /** Arabic display name (rendered as subtle subtitle under the h2) */
  nameAr: string
  /** Short tagline shown above the h2 */
  kicker: LocalisedString
  /** CSS accent token or hex colour used for section headers */
  accent: string
  /** Top-of-section facts grid (Stadium / Population / Region) */
  facts: LocalisedFacts
  /** Numeric population estimate for TouristDestination JSON-LD */
  population: number
  /** Full region name for PostalAddress.addressRegion */
  region: string
  /** Approximate geo coordinates for GeoCoordinates JSON-LD */
  geo: {
    latitude: number
    longitude: number
  }
  /** History paragraph (single block of prose) */
  history: LocalisedString
  /** Best Neighborhoods (5 items per locale) */
  neighborhoods: LocalisedItems
  /** Where to Eat (5 items per locale) */
  restaurants: LocalisedItems
  /** Where to Stay (3 tiers per locale) */
  accommodation: LocalisedStayTiers
  /** Getting There (3–4 rows per locale) */
  gettingThere: LocalisedGettingThere
  /** Matchday Experience (3 paragraphs per locale) */
  matchday: LocalisedStrings
  /** Don't Miss (4 items per locale) */
  dontMiss: LocalisedItems
}

/* ------------------------------------------------------------------ */
/*  Host city dataset                                                  */
/* ------------------------------------------------------------------ */

export const WC2030_HOST_CITIES: WC2030HostCity[] = [
  /* ═══════════════════════════════════════════════════════════════
     1. CASABLANCA
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: 'casablanca',
    emoji: '🏙️',
    nameEn: 'Casablanca',
    nameAr: 'الدار البيضاء',
    kicker: {
      en: 'Commercial Capital · Modern · Cosmopolitan',
      ar: 'العاصمة الاقتصادية · حديثة · كوسموبوليتانية',
      fr: 'Capitale économique · Moderne · Cosmopolite',
    },
    accent: 'var(--green)',
    facts: {
      en: [
        { label: 'Stadium', value: 'Grand Stade Hassan II' },
        { label: 'Population', value: '4.3 million' },
        { label: 'Region', value: 'Grand Casablanca-Settat' },
      ],
      ar: [
        { label: 'الملعب', value: 'ملعب الحسن الثاني الكبير' },
        { label: 'السكان', value: '4.3 مليون' },
        { label: 'الجهة', value: 'الدار البيضاء-سطات الكبرى' },
      ],
      fr: [
        { label: 'Stade', value: 'Grand Stade Hassan II' },
        { label: 'Population', value: '4,3 millions' },
        { label: 'Région', value: 'Grand Casablanca-Settat' },
      ],
    },
    population: 4_300_000,
    region: 'Grand Casablanca-Settat',
    geo: { latitude: 33.5731, longitude: -7.5898 },
    history: {
      en: "Casablanca was a modest Berber fishing settlement known as Anfa until the Portuguese destroyed it in the 15th century and rebuilt it as Casa Branca. The French colonial administration transformed it from 1907 onward into Morocco's primary commercial port, laying a grand Art Deco core that still defines the city centre. Independence in 1956 unleashed decades of rapid, sometimes chaotic growth that turned Casablanca into the economic engine of the Maghreb. Today it is Morocco's largest city by far, responsible for roughly a third of the country's industrial output, and the site of one of the most ambitious stadium projects in World Cup history.",
      ar: "كانت الدار البيضاء مستوطنة صيد أمازيغية متواضعة تُعرف باسم أنفا قبل أن يدمّرها البرتغاليون في القرن الخامس عشر ويعيدوا بناءها باسم «كازا برانكا». حوّلتها الإدارة الاستعمارية الفرنسية ابتداءً من 1907 إلى الميناء التجاري الرئيسي للمغرب، ووضعت نواة حضرية كبرى بأسلوب الآرت ديكو ما زالت تُحدّد ملامح وسط المدينة حتى اليوم. أطلق استقلال 1956 عقوداً من النمو السريع والفوضوي أحياناً، جعلت الدار البيضاء محرّك المغرب العربي الاقتصادي. اليوم هي أكبر مدن المغرب بفارق كبير، ومسؤولة عن نحو ثلث الإنتاج الصناعي للبلاد، وتحتضن واحداً من أكثر مشاريع الملاعب طموحاً في تاريخ كأس العالم.",
      fr: "Casablanca n'était qu'un modeste village de pêcheurs berbères appelé Anfa avant que les Portugais ne le détruisent au XVe siècle et le reconstruisent sous le nom de Casa Branca. L'administration coloniale française l'a transformée à partir de 1907 en premier port commercial du Maroc, dessinant un grand centre Art déco qui définit encore aujourd'hui le cœur de la ville. L'indépendance de 1956 a déclenché des décennies de croissance rapide, parfois chaotique, qui ont fait de Casablanca le moteur économique du Maghreb. C'est aujourd'hui de loin la plus grande ville du Maroc, responsable d'environ un tiers de la production industrielle du pays, et le site de l'un des projets de stade les plus ambitieux de l'histoire de la Coupe du Monde.",
    },
    neighborhoods: {
      en: [
        { name: 'Corniche (Ain Diab)', desc: "Casablanca's seafront strip stretches south along the Atlantic, lined with beach clubs, restaurants, and open-air cafes. The evening promenade here is the city's social ritual. For World Cup visitors, the Corniche offers the most immediately enjoyable Casablanca experience: ocean views, fresh air, and excellent seafood within walking distance." },
        { name: 'Gauthier', desc: 'The upscale business district immediately south of the old city centre, Gauthier is full of international restaurants, cocktail bars, and boutique hotels. It is walkable, well-lit, and centrally located. An excellent base for fans who want easy access to transport hubs and nightlife.' },
        { name: 'Anfa', desc: "Casablanca's most desirable residential neighborhood climbs the hillside above the Corniche. Tree-lined boulevards, Art Deco villas, and an unhurried pace make Anfa a welcome contrast to the downtown bustle. Quieter restaurants and cafes here tend to be excellent and less crowded." },
        { name: 'Quartier Habous (Nouvelle Medina)', desc: "Built by the French in the 1930s as a 'modern medina,' Habous blends traditional Moroccan architecture with colonial-era planning. It is more navigable than the old medina and offers a concentrated experience of Moroccan crafts, pastries, and atmosphere without the intensity. The patisseries here produce the best cornes de gazelle in the city." },
        { name: 'Maarif', desc: 'The shopping and dining heartland of modern Casablanca. Twin Cities mall, the boutiques of Rue Abou Inane, and dozens of restaurants serving everything from sushi to tagine. Maarif is the best all-round base for World Cup visitors: central, well-connected by tram, and endlessly walkable.' },
      ],
      ar: [
        { name: 'الكورنيش (عين الذئاب)', desc: 'تمتد واجهة الدار البيضاء البحرية جنوباً على طول الأطلسي، وتصطف على طولها نوادي الشاطئ والمطاعم والمقاهي المكشوفة. التنزّه المسائي هنا طقس اجتماعي للمدينة. بالنسبة لزوار كأس العالم، يقدّم الكورنيش أسرع تجربة ممتعة للدار البيضاء: إطلالات على المحيط، هواء نقي، ومأكولات بحرية ممتازة على مسافة المشي.' },
        { name: 'غوتييه', desc: 'حي الأعمال الراقي الواقع جنوب وسط المدينة القديم مباشرة، يعجّ غوتييه بالمطاعم العالمية وبارات الكوكتيل والفنادق البوتيكية. الحي قابل للمشي، حسن الإضاءة، ومركزي الموقع. قاعدة ممتازة للمشجعين الذين يريدون وصولاً سهلاً إلى محاور النقل والحياة الليلية.' },
        { name: 'أنفا', desc: 'أرقى أحياء الدار البيضاء السكنية، يتسلّق سفح التلة فوق الكورنيش. الشوارع المشجّرة وفيلات الآرت ديكو والإيقاع المتمهّل تجعل أنفا نقيضاً مرحّباً به لصخب وسط المدينة. المطاعم والمقاهي الأهدأ هنا تميل إلى أن تكون ممتازة وأقل اكتظاظاً.' },
        { name: 'الحبوس (المدينة الجديدة)', desc: 'بناه الفرنسيون في ثلاثينيات القرن الماضي بوصفه «مدينة عتيقة حديثة»، يمزج الحبوس العمارة المغربية التقليدية بالتخطيط الاستعماري. يسهل التنقّل فيه أكثر من المدينة العتيقة ويقدّم تجربة مكثّفة للحرف المغربية والحلويات والأجواء دون الشدّة. تنتج حلوانياته أفضل «كعب الغزال» في المدينة.' },
        { name: 'المعاريف', desc: 'قلب التسوّق والمطاعم في الدار البيضاء الحديثة. مول توين سنترز، وبوتيكات شارع أبي عنان، وعشرات المطاعم التي تقدّم كل شيء من السوشي إلى الطاجين. المعاريف هو أفضل قاعدة شاملة لزوار كأس العالم: مركزي، متصل جيداً بالترامواي، وقابل للمشي بلا نهاية.' },
      ],
      fr: [
        { name: 'Corniche (Ain Diab)', desc: "La bande maritime de Casablanca s'étend vers le sud le long de l'Atlantique, bordée de beach clubs, de restaurants et de cafés en plein air. La promenade du soir y est le rituel social de la ville. Pour les visiteurs de la Coupe du Monde, la Corniche offre l'expérience casablancaise la plus immédiatement agréable : vues sur l'océan, air frais et excellents fruits de mer à distance de marche." },
        { name: 'Gauthier', desc: "Le quartier d'affaires haut de gamme immédiatement au sud du vieux centre-ville, Gauthier regorge de restaurants internationaux, de bars à cocktails et d'hôtels boutique. Il est marchable, bien éclairé et central. Une excellente base pour les supporters qui veulent un accès facile aux hubs de transport et à la vie nocturne." },
        { name: 'Anfa', desc: "Le quartier résidentiel le plus prisé de Casablanca grimpe la colline au-dessus de la Corniche. Des boulevards arborés, des villas Art déco et un rythme tranquille font d'Anfa un contraste bienvenu à l'agitation du centre-ville. Les restaurants et cafés plus calmes y sont souvent excellents et moins bondés." },
        { name: 'Quartier Habous (Nouvelle Medina)', desc: "Construit par les Français dans les années 1930 comme une « médina moderne », Habous mêle l'architecture traditionnelle marocaine et l'urbanisme colonial. Il est plus facile à parcourir que la vieille médina et offre une expérience concentrée de l'artisanat marocain, des pâtisseries et de l'ambiance, sans l'intensité. Les pâtisseries d'ici produisent les meilleures cornes de gazelle de la ville." },
        { name: 'Maarif', desc: "Le cœur commerçant et gastronomique de la Casablanca moderne. Le centre commercial Twin Cities, les boutiques de la rue Abou Inane et des dizaines de restaurants servant aussi bien des sushis que du tajine. Maarif est la meilleure base polyvalente pour les visiteurs de la Coupe du Monde : central, bien desservi par le tramway et infiniment marchable." },
      ],
    },
    restaurants: {
      en: [
        { name: 'La Sqala — Traditional Moroccan', desc: 'Set within the ramparts of an 18th-century fortress near the old medina, La Sqala serves refined Moroccan cuisine in a lush courtyard garden. The pastilla is exceptional and the setting is one of the most atmospheric in the city. Reserve for lunch. Moderate prices: 150-250 MAD per person.' },
        { name: "Rick's Cafe — Iconic Bar-Restaurant", desc: 'Yes, it was built to capitalize on the Humphrey Bogart film. No, there is no historical connection. But the renovation of a 1930s riad into a piano-bar restaurant overlooking the old medina is genuinely well done, and the food — a mix of Moroccan and international — is better than it needs to be. Worth one evening. 200-400 MAD.' },
        { name: 'Corniche Seafood Restaurants', desc: "The string of seafood restaurants along the Corniche boulevard serves the day's catch grilled, fried, or in chermoula marinade. La Bavaroise and Le Cabestan are the best-known names, but smaller places along Ain Diab serve equally fresh fish at lower prices. Expect 120-300 MAD depending on the restaurant." },
        { name: 'Central Market Food Stalls', desc: "The Marche Central near Place des Nations Unies is Casablanca's great democratic eating experience. Fishmongers sell fresh catch that the adjacent grill stalls will cook to order for a fraction of restaurant prices. Prawns, squid, sardines, sole — choose from the display and eat standing up. 40-80 MAD for a full plate." },
        { name: 'Cafe Culture: Bavaroise, Venezia', desc: 'Casablanca runs on espresso and fresh orange juice. The pavement cafes of Maarif and Boulevard Mohammed V are where the city watches itself go by. Bavaroise (the original, not the Corniche branch) and Cafe Venezia near Place Mohammed V are local institutions. 15-40 MAD.' },
      ],
      ar: [
        { name: 'السقالة — مطبخ مغربي تقليدي', desc: 'يقع داخل أسوار قلعة من القرن الثامن عشر قرب المدينة العتيقة، ويقدّم «لا سقالة» مطبخاً مغربياً راقياً في حديقة فناء خضراء. البسطيلة استثنائية، والفضاء من أكثر الأماكن عبقاً في المدينة. احجز للغداء. أسعار متوسطة: 150-250 درهماً للشخص.' },
        { name: 'ريكس كافيه — بار-مطعم أيقوني', desc: 'نعم، بُني لاستثمار فيلم همفري بوغارت. ولا، لا توجد صلة تاريخية بالأمر. لكن تحويل رياض من ثلاثينيات القرن الماضي إلى مطعم بار-بيانو يطلّ على المدينة العتيقة أُنجز بإتقان حقيقي، والطعام — مزيج مغربي وعالمي — أفضل ممّا يلزمه أن يكون. يستحق أمسية واحدة. 200-400 درهم.' },
        { name: 'مطاعم الأسماك على الكورنيش', desc: 'تقدّم سلسلة مطاعم الأسماك على طول شارع الكورنيش صيد اليوم مشوياً أو مقلياً أو مطهواً في الشرمولة. «لا بافاروا» و«لو كابستان» أشهر الأسماء، لكن أماكن أصغر على طول عين الذئاب تقدّم السمك الطازج ذاته بأسعار أقل. توقّع 120-300 درهم حسب المطعم.' },
        { name: 'أكشاك السوق المركزي', desc: 'السوق المركزي قرب ساحة الأمم المتحدة هو تجربة الأكل الديمقراطية الكبرى للدار البيضاء. يبيع باعة السمك صيداً طازجاً تطهوه أكشاك الشواء المجاورة حسب الطلب بجزء بسيط من أسعار المطاعم. الجمبري، الحبّار، السردين، موسى — اختر من العرض وكُل واقفاً. 40-80 درهماً للطبق الكامل.' },
        { name: 'ثقافة المقاهي: بافاروا، فينيسيا', desc: 'تعمل الدار البيضاء على الإسبريسو وعصير البرتقال الطازج. مقاهي رصيف المعاريف وشارع محمد الخامس هي حيث تراقب المدينة نفسها تمرّ. «بافاروا» (الأصلي، لا فرع الكورنيش) و«كافيه فينيسيا» قرب ساحة محمد الخامس مؤسستان محليتان. 15-40 درهماً.' },
      ],
      fr: [
        { name: 'La Sqala — Cuisine marocaine traditionnelle', desc: "Installée dans les remparts d'une forteresse du XVIIIe siècle près de la vieille médina, La Sqala sert une cuisine marocaine raffinée dans un jardin-patio luxuriant. La pastilla est exceptionnelle et le cadre est l'un des plus envoûtants de la ville. Réservez pour le déjeuner. Prix modérés : 150-250 MAD par personne." },
        { name: "Rick's Cafe — Bar-restaurant iconique", desc: "Oui, il a été construit pour capitaliser sur le film de Humphrey Bogart. Non, il n'y a aucun lien historique. Mais la rénovation d'un riad des années 1930 en bar-restaurant piano surplombant la vieille médina est véritablement bien réalisée, et la cuisine — un mélange marocain et international — est meilleure qu'elle n'a besoin de l'être. Mérite une soirée. 200-400 MAD." },
        { name: 'Restaurants de poisson de la Corniche', desc: "Les restaurants de fruits de mer alignés le long du boulevard de la Corniche servent la pêche du jour grillée, frite ou marinée à la chermoula. La Bavaroise et Le Cabestan sont les noms les plus connus, mais des adresses plus modestes le long d'Ain Diab servent du poisson tout aussi frais à des prix inférieurs. Comptez 120-300 MAD selon le restaurant." },
        { name: 'Marché central — Étals de restauration', desc: "Le Marché central près de la place des Nations Unies est la grande expérience populaire de Casablanca. Les poissonniers vendent la pêche fraîche que les grills voisins cuisinent à la commande pour une fraction des prix de restaurant. Crevettes, calamars, sardines, soles — choisissez dans l'étal et mangez debout. 40-80 MAD pour une assiette complète." },
        { name: 'Culture café : Bavaroise, Venezia', desc: "Casablanca tourne à l'expresso et au jus d'orange frais. Les cafés en terrasse de Maarif et du boulevard Mohammed V sont là où la ville se regarde passer. Bavaroise (l'original, pas la succursale de la Corniche) et le Café Venezia près de la place Mohammed V sont des institutions locales. 15-40 MAD." },
      ],
    },
    accommodation: {
      en: [
        { tier: 'Budget', range: '$30–60 / night', desc: 'The old medina and areas near Gare Casa-Voyageurs have clean, simple hostels and budget riads. HI Hostel Casablanca and Riad Jnane Sherazade are reliable picks. Expect basic rooms, shared facilities, and excellent location for the price.' },
        { tier: 'Mid-Range', range: '$80–150 / night', desc: 'Maarif and Gauthier offer the best concentration of mid-range hotels. Hotel & Spa Le Doge (an Art Deco gem), Kenzi Tower, and Novotel City Centre all deliver comfort and central access. Tram connections to the main station are straightforward.' },
        { tier: 'Luxury', range: '$200+ / night', desc: "The Four Seasons on the Corniche is Casablanca's flagship property, with direct ocean views. Hyatt Regency in the city centre and Sofitel Tour Blanche offer five-star alternatives. The luxury tier in Casablanca matches any North African city for quality." },
      ],
      ar: [
        { tier: 'اقتصادي', range: '30-60 دولاراً / الليلة', desc: 'توفّر المدينة العتيقة والمناطق القريبة من محطة الدار البيضاء-المسافرون نُزلاً نظيفة وبسيطة ورياضات اقتصادية. «HI Hostel Casablanca» و«رياض جنان شهرزاد» خيارات موثوقة. توقّع غرفاً أساسية ومرافق مشتركة وموقعاً ممتازاً مقابل السعر.' },
        { tier: 'متوسط', range: '80-150 دولاراً / الليلة', desc: 'يقدّم المعاريف وغوتييه أفضل تركّز لفنادق الفئة المتوسطة. فندق «لو دوج» الآرت ديكو، و«كنزي تاور»، و«نوفوتيل سنتر فيل» كلها تقدّم الراحة والوصول المركزي. خطوط الترامواي إلى المحطة الرئيسية مباشرة.' },
        { tier: 'فاخر', range: '200+ دولاراً / الليلة', desc: '«فور سيزونز» على الكورنيش هو فندق الدار البيضاء الرائد، بإطلالة مباشرة على المحيط. «حياة ريجنسي» في وسط المدينة و«سوفيتيل طور البيضاء» يقدّمان بدائل بخمس نجوم. الفئة الفاخرة في الدار البيضاء تُضاهي أي مدينة في شمال أفريقيا من حيث الجودة.' },
      ],
      fr: [
        { tier: 'Budget', range: '30-60 $ / nuit', desc: "La vieille médina et les zones proches de la gare Casa-Voyageurs abritent des auberges propres et simples et des riads économiques. HI Hostel Casablanca et Riad Jnane Sherazade sont des valeurs sûres. Attendez-vous à des chambres basiques, des équipements partagés et un excellent emplacement pour le prix." },
        { tier: 'Milieu de gamme', range: '80-150 $ / nuit', desc: "Maarif et Gauthier offrent la meilleure concentration d'hôtels de gamme moyenne. L'Hôtel & Spa Le Doge (un joyau Art déco), Kenzi Tower et Novotel City Centre offrent tous confort et accès central. Les connexions en tramway vers la gare principale sont directes." },
        { tier: 'Luxe', range: '200+ $ / nuit', desc: "Le Four Seasons sur la Corniche est l'hôtel phare de Casablanca, avec vue directe sur l'océan. Le Hyatt Regency au centre-ville et le Sofitel Tour Blanche offrent des alternatives cinq étoiles. Le segment luxe de Casablanca rivalise en qualité avec n'importe quelle ville d'Afrique du Nord." },
      ],
    },
    gettingThere: {
      en: [
        { icon: '✈', label: 'Airport', detail: "Mohammed V International Airport (CMN) — 30km south of the city centre. Morocco's busiest airport with direct flights from most European capitals, the Middle East, West Africa, and North America. The Airport Express train reaches Casa-Voyageurs station in 35 minutes." },
        { icon: '🚄', label: 'Train', detail: 'Casa-Voyageurs is the main station for Al Boraq high-speed trains (Tangier in 2h10, Rabat in 55min) and conventional rail to Marrakech, Fes, and Meknes. The station connects directly to the Casablanca tram network.' },
        { icon: '💡', label: 'Tips', detail: 'The Casablanca tram is clean, frequent, and connects most useful areas of the city. Petit taxis (red) are metered and affordable. Uber and Careem operate reliably. Avoid rush-hour driving — Casablanca traffic is legendary.' },
      ],
      ar: [
        { icon: '✈', label: 'المطار', detail: 'مطار محمد الخامس الدولي (CMN) — على بعد 30 كم جنوب وسط المدينة. أكثر مطارات المغرب ازدحاماً، يربط برحلات مباشرة معظم العواصم الأوروبية والشرق الأوسط وغرب أفريقيا وأمريكا الشمالية. يصل قطار «إكسبريس المطار» إلى محطة الدار البيضاء-المسافرون في 35 دقيقة.' },
        { icon: '🚄', label: 'القطار', detail: 'الدار البيضاء-المسافرون هي المحطة الرئيسية لقطارات البراق فائقة السرعة (طنجة في ساعتَين و10 دقائق، الرباط في 55 دقيقة) وللقطارات التقليدية إلى مراكش وفاس ومكناس. تتصل المحطة مباشرة بشبكة ترامواي الدار البيضاء.' },
        { icon: '💡', label: 'نصائح', detail: 'ترامواي الدار البيضاء نظيف، متواتر، ويربط معظم المناطق المفيدة في المدينة. سيارات الأجرة الصغيرة (الحمراء) مزوّدة بعدّاد ومعقولة السعر. «أوبر» و«كريم» يعملان بموثوقية. تجنّب القيادة في ساعة الذروة — ازدحام الدار البيضاء أسطوري.' },
      ],
      fr: [
        { icon: '✈', label: 'Aéroport', detail: "Aéroport international Mohammed V (CMN) — à 30 km au sud du centre-ville. Le plus fréquenté du Maroc, avec des vols directs depuis la plupart des capitales européennes, le Moyen-Orient, l'Afrique de l'Ouest et l'Amérique du Nord. Le train Airport Express rejoint la gare Casa-Voyageurs en 35 minutes." },
        { icon: '🚄', label: 'Train', detail: "Casa-Voyageurs est la gare principale pour les trains à grande vitesse Al Boraq (Tanger en 2h10, Rabat en 55 min) et le rail conventionnel vers Marrakech, Fès et Meknès. La gare est directement connectée au réseau de tramway de Casablanca." },
        { icon: '💡', label: 'Conseils', detail: "Le tramway de Casablanca est propre, fréquent et dessert la plupart des zones utiles de la ville. Les petits taxis (rouges) sont équipés de compteurs et abordables. Uber et Careem fonctionnent de manière fiable. Évitez de conduire aux heures de pointe — le trafic de Casablanca est légendaire." },
      ],
    },
    matchday: {
      en: [
        'Grand Stade Hassan II is 40km south of Casablanca in the El Mansouria district. On match days, expect dedicated shuttle services from central collection points, including Casa-Port, Casa-Voyageurs, and Mohammed V Airport. Allow 60-90 minutes travel time in match-day traffic, or use the new rail extension planned for 2028.',
        'Pre-match atmosphere will center on the Corniche and the fan zones planned for the Boulevard de la Corniche area. The seafront is the natural gathering point before heading to the stadium.',
        "On non-match days, the city's football culture lives at Stade Mohammed V, home to Raja CA and Wydad AC — two of the fiercest rivalries in African football.",
      ],
      ar: [
        'ملعب الحسن الثاني الكبير يقع على بعد 40 كم جنوب الدار البيضاء في منطقة المنصورية. في أيام المباريات، توقّع خدمات نقل مكوكي مخصصة من نقاط تجمّع مركزية، منها الدار البيضاء-الميناء، والدار البيضاء-المسافرون، ومطار محمد الخامس. خصّص 60-90 دقيقة للسفر في ازدحام يوم المباراة، أو استعمل امتداد السكة الحديدية الجديد المخطّط لـ 2028.',
        'ستتركّز الأجواء قبل المباراة على الكورنيش ومناطق المشجعين المخطّط لها في شارع الكورنيش. الواجهة البحرية هي نقطة التجمّع الطبيعية قبل التوجّه إلى الملعب.',
        'في الأيام العادية، تعيش ثقافة الكرة في المدينة على أرضية ملعب محمد الخامس، معقل الرجاء البيضاوي والوداد البيضاوي — إحدى أشرس الغريميات في الكرة الأفريقية.',
      ],
      fr: [
        "Le Grand Stade Hassan II se trouve à 40 km au sud de Casablanca, dans le district d'El Mansouria. Les jours de match, attendez-vous à des navettes dédiées depuis des points de rassemblement centraux : Casa-Port, Casa-Voyageurs et l'aéroport Mohammed V. Comptez 60 à 90 minutes de trajet dans le trafic de match, ou utilisez la nouvelle extension ferroviaire prévue pour 2028.",
        "L'ambiance d'avant-match se concentrera sur la Corniche et les zones de supporters prévues le long du boulevard de la Corniche. Le front de mer est le point de rassemblement naturel avant de rejoindre le stade.",
        "Les jours sans match, la culture football de la ville vit au Stade Mohammed V, fief du Raja CA et du Wydad AC — l'une des rivalités les plus féroces du football africain.",
      ],
    },
    dontMiss: {
      en: [
        { name: 'Hassan II Mosque', desc: 'The largest mosque in Africa, built on a platform extending over the Atlantic Ocean. The minaret is 210 metres tall. Guided tours for non-Muslim visitors run daily and the interior — with its retractable roof, heated floor, and space for 25,000 worshippers — is breathtaking. The most unmissable sight in Casablanca.' },
        { name: 'Art Deco Downtown', desc: 'The area around Place Mohammed V and Boulevard Mohammed V contains one of the finest concentrations of Art Deco and Mauresque architecture in the world, built during the French Protectorate era. The Palais de Justice, the Central Post Office, and the covered market are all worth an unhurried walk.' },
        { name: 'Old Medina', desc: 'Smaller and more manageable than Fes or Marrakech, the Casablanca medina offers an authentic experience without the tourist intensity. Narrow lanes, spice shops, and a genuine neighborhood feel. Enter from Place des Nations Unies.' },
        { name: 'Morocco Mall & Shopping', desc: "Africa's second-largest shopping mall, featuring an aquarium, ice rink, and hundreds of stores. Located on the southern Corniche. Even if shopping is not your thing, the scale is worth seeing." },
      ],
      ar: [
        { name: 'مسجد الحسن الثاني', desc: 'أكبر مسجد في أفريقيا، بُني على منصّة تمتد فوق المحيط الأطلسي. يبلغ ارتفاع المئذنة 210 أمتار. جولات مُرشدة للزوار غير المسلمين تُنظَّم يومياً، والداخل — بسقفه القابل للفتح، وأرضيته المُدفّأة، وحيّزه الذي يسع 25,000 مصلٍّ — مذهل. أكثر المعالم التي لا تُفوَّت في الدار البيضاء.' },
        { name: 'وسط المدينة الآرت ديكو', desc: 'المنطقة حول ساحة محمد الخامس وشارع محمد الخامس تضم واحدة من أروع تجمّعات عمارة الآرت ديكو والعمارة المغربية الاستعمارية في العالم، بُنيت في عهد الحماية الفرنسية. قصر العدل والبريد المركزي والسوق المغطّى جميعها تستحقّ جولة غير مستعجلة.' },
        { name: 'المدينة العتيقة', desc: 'أصغر وأسهل تنقّلاً من فاس أو مراكش، تقدّم مدينة الدار البيضاء العتيقة تجربة أصيلة بدون الشدّة السياحية. أزقة ضيّقة، دكاكين توابل، وإحساس حقيقي بحياة الحي. الدخول من ساحة الأمم المتحدة.' },
        { name: 'موروكو مول والتسوّق', desc: 'ثاني أكبر مركز تجاري في أفريقيا، يضمّ حوض أسماك ومضمار تزلّج ومئات المتاجر. يقع على الكورنيش الجنوبي. حتى لو لم يكن التسوّق اهتمامك، فإن الحجم وحده يستحقّ المشاهدة.' },
      ],
      fr: [
        { name: 'Mosquée Hassan II', desc: "La plus grande mosquée d'Afrique, construite sur une plateforme qui s'avance sur l'océan Atlantique. Le minaret mesure 210 mètres de haut. Des visites guidées pour les non-musulmans ont lieu quotidiennement, et l'intérieur — avec son toit rétractable, son sol chauffant et sa capacité de 25 000 fidèles — est à couper le souffle. Le monument à ne surtout pas manquer à Casablanca." },
        { name: 'Centre-ville Art déco', desc: "La zone autour de la place Mohammed V et du boulevard Mohammed V abrite l'une des plus belles concentrations d'architecture Art déco et mauresque au monde, construite durant le protectorat français. Le Palais de justice, la Poste centrale et le marché couvert méritent une promenade sans hâte." },
        { name: 'Vieille médina', desc: "Plus petite et plus facile à parcourir que celles de Fès ou Marrakech, la médina de Casablanca offre une expérience authentique sans l'intensité touristique. Ruelles étroites, boutiques d'épices et véritable sensation de quartier. Entrée par la place des Nations Unies." },
        { name: 'Morocco Mall & shopping', desc: "Le deuxième plus grand centre commercial d'Afrique, avec un aquarium, une patinoire et des centaines de boutiques. Situé sur la Corniche sud. Même si le shopping n'est pas votre truc, l'échelle mérite d'être vue." },
      ],
    },
  },

  /* ═══════════════════════════════════════════════════════════════
     2. RABAT
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: 'rabat',
    emoji: '🏛️',
    nameEn: 'Rabat',
    nameAr: 'الرباط',
    kicker: {
      en: 'Royal Capital · Refined · Historic · Overlooked Gem',
      ar: 'العاصمة الإدارية · راقية · تاريخية · جوهرة مُهمَلة',
      fr: 'Capitale royale · Raffinée · Historique · Trésor méconnu',
    },
    accent: 'var(--navy)',
    facts: {
      en: [
        { label: 'Stadium', value: 'Prince Moulay Abdellah' },
        { label: 'Population', value: '580,000' },
        { label: 'Region', value: 'Rabat-Sale-Kenitra' },
      ],
      ar: [
        { label: 'الملعب', value: 'ملعب الأمير مولاي عبد الله' },
        { label: 'السكان', value: '580,000' },
        { label: 'الجهة', value: 'الرباط-سلا-القنيطرة' },
      ],
      fr: [
        { label: 'Stade', value: 'Prince Moulay Abdellah' },
        { label: 'Population', value: '580 000' },
        { label: 'Région', value: 'Rabat-Salé-Kénitra' },
      ],
    },
    population: 580_000,
    region: 'Rabat-Sale-Kenitra',
    geo: { latitude: 34.0209, longitude: -6.8416 },
    history: {
      en: "Rabat's origins trace to the 3rd century BC Roman settlement of Sala Colonia, whose ruins survive in the Chellah necropolis on the city's southern edge. The Almohad dynasty established Rabat as a fortified ribat (monastery-fortress) in the 12th century, beginning the Hassan Tower mosque that was never completed. Rabat became Morocco's capital under the French Protectorate in 1912, replacing the traditional imperial cities of Fes and Marrakech, and has remained the seat of government and the Royal Palace since independence. The entire city was declared a UNESCO World Heritage Site in 2012, recognizing the remarkable layering of Roman, medieval Islamic, and colonial-modern heritage within a single compact urban fabric.",
      ar: "تعود أصول الرباط إلى مستوطنة «سالا كولونيا» الرومانية في القرن الثالث قبل الميلاد، وتبقى أطلالها في نكروبوليس شالة على الحافة الجنوبية للمدينة. أقامت الدولة الموحّدية الرباط كرباط حصين (أي كقلعة-زاوية) في القرن الثاني عشر، وبدأت في بناء مسجد صومعة حسان الذي لم يكتمل قطّ. أصبحت الرباط عاصمة المغرب في عهد الحماية الفرنسية سنة 1912، خلفاً للعاصمتين الإمبراطوريتَين التقليديتَين فاس ومراكش، وظلّت مقرّ الحكومة والقصر الملكي منذ الاستقلال. أُدرجت المدينة بأكملها في قائمة التراث العالمي لليونسكو سنة 2012، تكريماً للتراكم الاستثنائي للتراث الروماني والإسلامي في العصور الوسطى والحداثة الاستعمارية داخل نسيج حضري مدمج واحد.",
      fr: "Les origines de Rabat remontent à la colonie romaine de Sala Colonia au IIIe siècle avant J.-C., dont les ruines subsistent dans la nécropole de Chellah à la limite sud de la ville. La dynastie almohade établit Rabat comme un ribat fortifié (monastère-forteresse) au XIIe siècle, entamant la construction de la mosquée de la Tour Hassan qui ne fut jamais achevée. Rabat devint la capitale du Maroc sous le protectorat français en 1912, remplaçant les villes impériales traditionnelles de Fès et Marrakech, et est restée le siège du gouvernement et du Palais royal depuis l'indépendance. La ville entière a été inscrite au patrimoine mondial de l'UNESCO en 2012, reconnaissant la superposition remarquable d'héritages romain, islamique médiéval et colonial-moderne dans un même tissu urbain compact.",
    },
    neighborhoods: {
      en: [
        { name: 'Agdal', desc: "The modern, tree-lined district south of the city centre is Rabat's most livable neighborhood. Restaurants, cafes, and the city's best nightlife cluster along Avenue de France and Avenue Fal Ould Oumeir. Agdal is well-connected by tram and is the closest major neighborhood to the stadium. An ideal World Cup base." },
        { name: 'Hassan', desc: "The historic quarter surrounding the Hassan Tower and the Mausoleum of Mohammed V. Wide boulevards, government buildings, and a palpable sense of Moroccan statehood define the area. Walking from here to the medina takes ten minutes along the river. A beautiful place to stay for visitors who want to feel the capital's character." },
        { name: "Ocean (L'Ocean)", desc: "The coastal district north of the Kasbah of the Udayas is Rabat's emerging creative quarter. Surf culture, art galleries, independent cafes, and a relaxed Atlantic-facing vibe. Some of the best value accommodation in the city can be found here, and the sunsets over the ocean are free." },
        { name: 'Souissi', desc: "The embassy quarter and Rabat's wealthiest residential area, Souissi is green, quiet, and elegant. Large hotels catering to diplomatic visitors offer a premium experience. It is farther from the medina but well-connected by road and close to the stadium complex." },
        { name: 'Medina', desc: "Rabat's medina is one of the most pleasant in Morocco: compact, clean, and remarkably untouristed compared to Fes or Marrakech. Carpet shops, spice merchants, and traditional pharmacies line narrow whitewashed streets. Several boutique riads offer atmospheric accommodation at moderate prices." },
      ],
      ar: [
        { name: 'أكدال', desc: 'الحي الحديث المشجّر جنوب وسط المدينة هو أكثر أحياء الرباط قابلية للحياة. تتجمّع المطاعم والمقاهي وأفضل حياة ليلية في المدينة على طول شارع فرنسا وشارع فال ولد عمير. أكدال متصل جيداً بالترامواي وهو أقرب حي رئيسي إلى الملعب. قاعدة مثالية لكأس العالم.' },
        { name: 'حسان', desc: 'الحي التاريخي المحيط بصومعة حسان وضريح محمد الخامس. شوارع فسيحة، ومبانٍ حكومية، وإحساس ملموس بالدولة المغربية يُحدّدان ملامح المنطقة. المشي من هنا إلى المدينة العتيقة يستغرق عشر دقائق على ضفة النهر. مكان جميل للإقامة لمن يريدون الإحساس بطابع العاصمة.' },
        { name: 'المحيط', desc: 'الحي الساحلي شمال قصبة الأوداية هو الحي الإبداعي الصاعد في الرباط. ثقافة ركوب الأمواج، ومعارض فنية، ومقاهٍ مستقلة، وأجواء هادئة تطلّ على الأطلسي. يمكن أن تجد هنا بعض أفضل أماكن الإقامة من حيث القيمة، والغروب على المحيط مجاني.' },
        { name: 'السويسي', desc: 'حي السفارات وأغنى مناطق الرباط السكنية، السويسي أخضر وهادئ وأنيق. تقدّم الفنادق الكبرى التي تخدم الزوار الدبلوماسيين تجربة راقية. بعيد نسبياً عن المدينة العتيقة لكنه متصل جيداً بالطرق وقريب من مجمع الملعب.' },
        { name: 'المدينة العتيقة', desc: 'المدينة العتيقة بالرباط من أمتع مدن المغرب العتيقة: مدمجة، نظيفة، وقليلة السياح بشكل ملحوظ مقارنة بفاس أو مراكش. دكاكين الزرابي وباعة التوابل والصيدليات التقليدية تصطف على أزقة ضيّقة مُبيّضة. عدّة رياضات بوتيكية تقدّم إقامة غنية بالأجواء بأسعار معقولة.' },
      ],
      fr: [
        { name: 'Agdal', desc: "Le quartier moderne et arboré au sud du centre-ville est le plus agréable à vivre de Rabat. Restaurants, cafés et la meilleure vie nocturne de la ville se concentrent le long de l'avenue de France et de l'avenue Fal Ould Oumeir. Agdal est bien desservi par le tramway et c'est le quartier majeur le plus proche du stade. Une base idéale pour la Coupe du Monde." },
        { name: 'Hassan', desc: "Le quartier historique entourant la Tour Hassan et le Mausolée Mohammed V. De larges boulevards, des bâtiments gouvernementaux et un sentiment palpable d'État marocain définissent cette zone. Depuis ici, la médina est à dix minutes à pied le long du fleuve. Un bel endroit où séjourner pour les visiteurs qui veulent ressentir le caractère de la capitale." },
        { name: "L'Océan", desc: "Le quartier côtier au nord de la Kasbah des Oudayas est le quartier créatif émergent de Rabat. Culture du surf, galeries d'art, cafés indépendants et ambiance décontractée face à l'Atlantique. On y trouve certains des meilleurs rapports qualité-prix de la ville, et les couchers de soleil sur l'océan sont gratuits." },
        { name: 'Souissi', desc: "Le quartier des ambassades et la zone résidentielle la plus aisée de Rabat, Souissi est verdoyant, tranquille et élégant. Les grands hôtels destinés aux visiteurs diplomatiques offrent une expérience haut de gamme. Plus éloigné de la médina, mais bien desservi par la route et proche du complexe du stade." },
        { name: 'Médina', desc: "La médina de Rabat est l'une des plus agréables du Maroc : compacte, propre et remarquablement peu touristique comparée à Fès ou Marrakech. Boutiques de tapis, marchands d'épices et pharmacies traditionnelles bordent d'étroites rues blanchies à la chaux. Plusieurs riads boutique proposent un hébergement plein de cachet à des prix modérés." },
      ],
    },
    restaurants: {
      en: [
        { name: 'Le Dhow — Floating Restaurant', desc: 'A converted wooden sailing vessel moored on the Bou Regreg river between Rabat and Sale. Moroccan and international cuisine served on deck with views of the Kasbah of the Udayas lit up at night. The setting alone is worth the visit. Reserve ahead. 200-350 MAD.' },
        { name: 'Dar Zaki — Traditional Moroccan', desc: 'A family-run riad restaurant in the medina serving some of the best traditional Rabati cuisine in the city. Couscous on Fridays (the traditional day) is legendary. The rfissa and pastilla are superb. Intimate and unhurried. 120-200 MAD.' },
        { name: 'Cosmopolitan — Modern Fusion', desc: "Located in Agdal, Cosmopolitan blends Moroccan flavors with French and Asian influences. The tasting menu is one of the best dining experiences in the capital. Stylish, modern, and popular with Rabat's professional class. 250-400 MAD." },
        { name: 'Cafe Maure — Kasbah Tea', desc: 'Perched on the walls of the Kasbah of the Udayas overlooking the river mouth and the Atlantic, this simple outdoor cafe serves Moroccan mint tea and almond pastries with arguably the best view in the entire city. Go at sunset. 20-40 MAD.' },
        { name: 'Marche Central Rabat', desc: "Like its Casablanca counterpart, Rabat's central market has fresh produce stalls and grill counters where fish and meat are cooked to order. The surrounding streets have small restaurants serving excellent Moroccan daily specials for 40-80 MAD." },
      ],
      ar: [
        { name: 'لو داو — مطعم عائم', desc: 'سفينة شراعية خشبية مُحوّلة راسية على نهر أبي رقراق بين الرباط وسلا. مطبخ مغربي وعالمي يُقدَّم على السطح مع إطلالات على قصبة الأوداية المُضاءة ليلاً. الفضاء وحده يستحقّ الزيارة. احجز مسبقاً. 200-350 درهماً.' },
        { name: 'دار الزاكي — مطبخ مغربي تقليدي', desc: 'مطعم في رياض تديره عائلة في المدينة العتيقة، يقدّم أحد أفضل الأطباق الرباطية التقليدية في المدينة. الكسكس يوم الجمعة (اليوم التقليدي) أسطوري. الرفيسة والبسطيلة رائعتان. حميمي وغير مستعجل. 120-200 درهم.' },
        { name: 'كوسموبوليتان — فيوجن حديث', desc: 'يقع في أكدال، ويمزج «كوسموبوليتان» النكهات المغربية بتأثيرات فرنسية وآسيوية. قائمة التذوّق إحدى أفضل تجارب الطعام في العاصمة. أنيق، حديث، ومحبّب عند الفئة المهنية في الرباط. 250-400 درهم.' },
        { name: 'المقهى المغربي — شاي القصبة', desc: 'يقع على أسوار قصبة الأوداية مطلّاً على مصبّ النهر والأطلسي، ويقدّم هذا المقهى المكشوف البسيط أتاي النعناع المغربي وحلويات اللوز مع ما يمكن اعتباره أفضل إطلالة في المدينة كلها. اذهب عند الغروب. 20-40 درهماً.' },
        { name: 'السوق المركزي بالرباط', desc: 'كنظيره في الدار البيضاء، يضمّ السوق المركزي بالرباط أكشاك الخضر الطازجة ومشاوي تطهو السمك واللحم حسب الطلب. تضم الشوارع المحيطة مطاعم صغيرة تقدّم أطباق اليوم المغربية الممتازة بـ 40-80 درهماً.' },
      ],
      fr: [
        { name: 'Le Dhow — Restaurant flottant', desc: "Un voilier en bois converti, amarré sur le Bouregreg entre Rabat et Salé. Cuisine marocaine et internationale servie sur le pont avec vue sur la Kasbah des Oudayas illuminée la nuit. Le cadre à lui seul mérite la visite. Réservez à l'avance. 200-350 MAD." },
        { name: 'Dar Zaki — Cuisine marocaine traditionnelle', desc: "Un restaurant-riad familial dans la médina servant certaines des meilleures cuisines rbati traditionnelles de la ville. Le couscous du vendredi (jour traditionnel) est légendaire. La rfissa et la pastilla sont superbes. Intime et sans hâte. 120-200 MAD." },
        { name: 'Cosmopolitan — Fusion moderne', desc: "Situé à Agdal, Cosmopolitan marie les saveurs marocaines aux influences françaises et asiatiques. Le menu dégustation est l'une des meilleures expériences gastronomiques de la capitale. Élégant, moderne, et prisé par la classe professionnelle de Rabat. 250-400 MAD." },
        { name: 'Café Maure — Thé de la Kasbah', desc: "Perché sur les murs de la Kasbah des Oudayas surplombant l'embouchure du fleuve et l'Atlantique, ce simple café en plein air sert du thé à la menthe marocain et des pâtisseries aux amandes avec sans doute la plus belle vue de toute la ville. À faire au coucher du soleil. 20-40 MAD." },
        { name: 'Marché central de Rabat', desc: "Comme son homologue casablancais, le marché central de Rabat a des étals de produits frais et des grills où le poisson et la viande sont cuits à la commande. Les rues environnantes abritent de petits restaurants servant d'excellents plats du jour marocains pour 40-80 MAD." },
      ],
    },
    accommodation: {
      en: [
        { tier: 'Budget', range: '$30–60 / night', desc: 'The medina has several clean, characterful riads and guesthouses at budget prices. Riad Dar El Kebira and hostels near Bab El Had gate offer the best value. Ocean district also has affordable apartments and hostels with an Atlantic-coast feel.' },
        { tier: 'Mid-Range', range: '$80–150 / night', desc: 'Agdal is the sweet spot for mid-range hotels: Farah Rabat, Golden Tulip Farah, and several well-maintained business hotels offer comfort, central dining, and tram access. The medina also has boutique riads in this range that combine heritage charm with modern amenities.' },
        { tier: 'Luxury', range: '$200+ / night', desc: "The Sofitel Jardin des Roses in Souissi is the city's premier hotel, set in extensive gardens near the Royal Palace. The Tour Hassan Palace, a Moroccan palace-hotel overlooking the Hassan Tower, offers a uniquely Rabati luxury experience. Rabat's luxury tier is smaller than Casablanca's but more intimate." },
      ],
      ar: [
        { tier: 'اقتصادي', range: '30-60 دولاراً / الليلة', desc: 'تضم المدينة العتيقة عدّة رياضات ودور ضيافة نظيفة وذات طابع بأسعار اقتصادية. «رياض دار الكبيرة» والنزل قرب باب الحد تقدّم أفضل قيمة. يوفّر حي المحيط أيضاً شققاً ونزلاً معقولة الثمن بإحساس الساحل الأطلسي.' },
        { tier: 'متوسط', range: '80-150 دولاراً / الليلة', desc: 'أكدال هو النقطة المثالية لفنادق الفئة المتوسطة: فندق «فرح الرباط»، و«غولدن توليب فرح»، وعدّة فنادق أعمال حسنة الصيانة تقدّم الراحة والمطاعم المركزية ووصول الترامواي. تضم المدينة العتيقة أيضاً رياضات بوتيكية في هذه الفئة تجمع بين سحر التراث والمرافق الحديثة.' },
        { tier: 'فاخر', range: '200+ دولاراً / الليلة', desc: '«سوفيتيل جنان الورود» في السويسي هو فندق المدينة الرائد، يقع في حدائق واسعة قرب القصر الملكي. «تور حسان بالاس»، قصر-فندق مغربي يطلّ على صومعة حسان، يقدّم تجربة فخامة رباطية فريدة. الفئة الفاخرة في الرباط أصغر من الدار البيضاء لكنها أكثر حميمية.' },
      ],
      fr: [
        { tier: 'Budget', range: '30-60 $ / nuit', desc: "La médina abrite plusieurs riads et maisons d'hôtes propres et pleins de caractère à prix budget. Riad Dar El Kebira et les auberges près de la porte Bab El Had offrent le meilleur rapport qualité-prix. Le quartier de l'Océan propose également des appartements et auberges abordables avec une ambiance côte atlantique." },
        { tier: 'Milieu de gamme', range: '80-150 $ / nuit', desc: "Agdal est le point idéal pour les hôtels de gamme moyenne : Farah Rabat, Golden Tulip Farah et plusieurs hôtels d'affaires bien entretenus offrent confort, restauration centrale et accès au tramway. La médina compte aussi des riads boutique dans cette fourchette, mariant charme patrimonial et équipements modernes." },
        { tier: 'Luxe', range: '200+ $ / nuit', desc: "Le Sofitel Jardin des Roses à Souissi est l'hôtel phare de la ville, dans de vastes jardins près du Palais royal. Le Tour Hassan Palace, un palais-hôtel marocain surplombant la Tour Hassan, offre une expérience de luxe uniquement rbati. Le segment luxe de Rabat est plus petit que celui de Casablanca, mais plus intime." },
      ],
    },
    gettingThere: {
      en: [
        { icon: '✈', label: 'Airport', detail: "Rabat-Sale Airport (RBA) — just 8km from the city centre. Modest international connections to European capitals and Middle Eastern hubs. Many visitors fly into Casablanca's Mohammed V (CMN) instead and take the train, which is often cheaper and serves more routes." },
        { icon: '🚄', label: 'Train', detail: 'Rabat-Ville and Rabat-Agdal are the two main stations. Al Boraq high-speed service reaches Casablanca in 34 minutes and Tangier in 90 minutes. Conventional trains connect to Fes (3h), Marrakech (4h), and Meknes (2.5h). The rail connection to Casablanca makes the two cities functionally twin bases for the tournament.' },
        { icon: '💡', label: 'Tips', detail: 'The Rabat-Sale tram system is modern, clean, and connects the city centre to Hay Riad (near the stadium) and to Sale across the river. Petit taxis (blue) are metered. Rabat is significantly easier to navigate by foot and public transport than Casablanca.' },
      ],
      ar: [
        { icon: '✈', label: 'المطار', detail: 'مطار الرباط-سلا (RBA) — على بعد 8 كم فقط من وسط المدينة. اتصالات دولية متواضعة مع عواصم أوروبية ومحاور الشرق الأوسط. يفضّل كثير من الزوار الطيران إلى مطار محمد الخامس في الدار البيضاء (CMN) ثم ركوب القطار، وهو غالباً أرخص ويخدم مسارات أكثر.' },
        { icon: '🚄', label: 'القطار', detail: 'الرباط-المدينة والرباط-أكدال هما المحطتان الرئيسيتان. تصل خدمة البراق فائقة السرعة إلى الدار البيضاء في 34 دقيقة وإلى طنجة في 90 دقيقة. تربط القطارات التقليدية بفاس (3 ساعات) ومراكش (4 ساعات) ومكناس (2.5 ساعة). اتصال السكة الحديدية بالدار البيضاء يجعل المدينتين عملياً قاعدتَي توأمتَين للبطولة.' },
        { icon: '💡', label: 'نصائح', detail: 'منظومة ترامواي الرباط-سلا حديثة ونظيفة، وتربط وسط المدينة بحي الرياض (قرب الملعب) وبسلا عبر النهر. سيارات الأجرة الصغيرة (الزرقاء) مزوّدة بعدّاد. التنقّل في الرباط أسهل بكثير مشياً وبالنقل العام مقارنة بالدار البيضاء.' },
      ],
      fr: [
        { icon: '✈', label: 'Aéroport', detail: "Aéroport Rabat-Salé (RBA) — à seulement 8 km du centre-ville. Modestes connexions internationales vers les capitales européennes et les hubs moyen-orientaux. De nombreux visiteurs préfèrent atterrir au Mohammed V (CMN) de Casablanca et prendre le train, souvent moins cher et desservant davantage de destinations." },
        { icon: '🚄', label: 'Train', detail: "Rabat-Ville et Rabat-Agdal sont les deux gares principales. Le service à grande vitesse Al Boraq rejoint Casablanca en 34 minutes et Tanger en 90 minutes. Les trains conventionnels relient Fès (3h), Marrakech (4h) et Meknès (2h30). La connexion ferroviaire avec Casablanca fait fonctionnellement des deux villes des bases jumelles pour le tournoi." },
        { icon: '💡', label: 'Conseils', detail: "Le tramway Rabat-Salé est moderne, propre et relie le centre-ville à Hay Riad (près du stade) et à Salé de l'autre côté du fleuve. Les petits taxis (bleus) sont équipés de compteurs. Rabat est beaucoup plus facile à parcourir à pied et en transports publics que Casablanca." },
      ],
    },
    matchday: {
      en: [
        "Prince Moulay Abdellah Stadium is in the Hay Riad district, approximately 6km from the city centre. The tram's Line 2 extension connects directly. Taxis and shuttle buses will supplement on match days. Travel time from central Rabat: 20-30 minutes.",
        'Pre-match gathering will center on the waterfront between the medina and the Kasbah of the Udayas, where fan zones are planned along the Bou Regreg river promenade. The setting — with the kasbah walls above and the river below — will be one of the most scenic pre-match atmospheres in the tournament.',
        'Rabat and Casablanca are effectively twin host cities. Many fans will base in one and attend matches in both. The 34-minute Al Boraq train makes this seamless.',
      ],
      ar: [
        'يقع ملعب الأمير مولاي عبد الله في حي الرياض، على بعد نحو 6 كم من وسط المدينة. يتصل امتداد الخط 2 للترامواي مباشرة. ستُكمّل سيارات الأجرة وحافلات النقل المكوكي الخدمة في أيام المباريات. زمن التنقّل من وسط الرباط: 20-30 دقيقة.',
        'سيتركّز تجمّع ما قبل المباراة على الواجهة المائية بين المدينة العتيقة وقصبة الأوداية، حيث تُخطَّط مناطق المشجعين على طول كورنيش أبي رقراق. الفضاء — مع أسوار القصبة في الأعلى والنهر في الأسفل — سيكون من أجمل أجواء ما قبل المباراة في البطولة.',
        'الرباط والدار البيضاء عملياً مدينتان توأمتان مضيفتان. كثير من المشجعين سيتّخذون إحداهما قاعدة ويحضرون المباريات في الأخرى. قطار البراق البالغ 34 دقيقة يجعل هذا سلساً.',
      ],
      fr: [
        "Le stade Prince Moulay Abdellah se situe dans le quartier de Hay Riad, à environ 6 km du centre-ville. L'extension de la ligne 2 du tramway le relie directement. Taxis et navettes compléteront l'offre les jours de match. Durée du trajet depuis le centre de Rabat : 20-30 minutes.",
        "Le rassemblement d'avant-match se concentrera sur la rive entre la médina et la Kasbah des Oudayas, où des zones de supporters sont prévues le long de la promenade du Bouregreg. Le cadre — avec les murs de la kasbah au-dessus et le fleuve en contrebas — sera l'un des plus pittoresques de tout le tournoi.",
        'Rabat et Casablanca sont de fait des villes hôtes jumelles. De nombreux supporters baseront dans l\'une et assisteront à des matchs dans les deux. Le train Al Boraq de 34 minutes rend la chose fluide.',
      ],
    },
    dontMiss: {
      en: [
        { name: 'Kasbah of the Udayas', desc: "A 12th-century Almohad fortress at the mouth of the Bou Regreg river. Its blue-and-white painted lanes rival Chefchaouen for beauty. The Andalusian gardens inside, laid out in the 17th century, are one of Morocco's quiet masterpieces. Allow an hour to wander." },
        { name: 'Hassan Tower & Mausoleum of Mohammed V', desc: 'The unfinished 44-metre minaret of a 12th-century mosque that was intended to be the largest in the Islamic world. Adjacent sits the white marble mausoleum of King Mohammed V — the symbolic heart of the modern Moroccan state. Free entry, and worth every minute.' },
        { name: 'Chellah Necropolis', desc: 'A walled site layering Roman ruins (Sala Colonia) beneath a medieval Islamic necropolis, now inhabited by storks, cats, and an extraordinary sense of peace. Recently reopened after restoration, it is unlike anything else in Morocco — ancient, overgrown, and haunting.' },
        { name: 'Mohammed VI Museum of Modern and Contemporary Art', desc: "Morocco's national modern art museum, opened in 2014, houses a superb collection of Moroccan and international contemporary art in a striking building near the medina. A reminder that Morocco's cultural identity is as much about the present as the past." },
      ],
      ar: [
        { name: 'قصبة الأوداية', desc: 'قلعة موحّدية من القرن الثاني عشر عند مصبّ نهر أبي رقراق. أزقتها المصبوغة بالأزرق والأبيض تنافس شفشاون في الجمال. الحدائق الأندلسية داخلها، التي رُسِمت في القرن السابع عشر، واحدة من روائع المغرب الهادئة. خصّص ساعة للتجوّل.' },
        { name: 'صومعة حسان وضريح محمد الخامس', desc: 'المئذنة غير المكتملة التي يبلغ ارتفاعها 44 متراً لمسجد من القرن الثاني عشر كان يُراد له أن يكون الأكبر في العالم الإسلامي. يقع إلى جانبها ضريح الملك محمد الخامس من الرخام الأبيض — قلب الدولة المغربية الحديثة الرمزي. الدخول مجاني، ويستحقّ كل دقيقة.' },
        { name: 'موقع شالة', desc: 'موقع مسوّر يضمّ أطلالاً رومانية («سالا كولونيا») تحت نكروبوليس إسلامي من العصور الوسطى، يسكنه اليوم اللقالق والقطط وإحساس استثنائي بالسكينة. أُعيد فتحه حديثاً بعد الترميم، وهو يختلف عن أي شيء آخر في المغرب — قديم ومتشعّب ومؤثّر.' },
        { name: 'متحف محمد السادس للفن الحديث والمعاصر', desc: 'المتحف الوطني المغربي للفن الحديث، افتُتح سنة 2014، يضمّ مجموعة رفيعة من الفن المعاصر المغربي والعالمي في مبنى لافت قرب المدينة العتيقة. تذكير بأن الهوية الثقافية المغربية حاضرٌ بقدر ما هي ماضٍ.' },
      ],
      fr: [
        { name: 'Kasbah des Oudayas', desc: "Une forteresse almohade du XIIe siècle à l'embouchure du Bouregreg. Ses ruelles peintes en bleu et blanc rivalisent de beauté avec Chefchaouen. Les jardins andalous à l'intérieur, aménagés au XVIIe siècle, sont l'un des chefs-d'œuvre discrets du Maroc. Comptez une heure pour flâner." },
        { name: 'Tour Hassan & Mausolée Mohammed V', desc: "Le minaret inachevé de 44 mètres d'une mosquée du XIIe siècle destinée à être la plus grande du monde islamique. À côté se dresse le mausolée en marbre blanc du roi Mohammed V — le cœur symbolique de l'État marocain moderne. Entrée gratuite, et chaque minute en vaut la peine." },
        { name: 'Nécropole de Chellah', desc: "Un site muré où des ruines romaines (Sala Colonia) se superposent à une nécropole islamique médiévale, aujourd'hui peuplé de cigognes, de chats et d'une extraordinaire sensation de paix. Récemment rouvert après restauration, il ne ressemble à rien d'autre au Maroc — ancien, envahi par la végétation et envoûtant." },
        { name: "Musée Mohammed VI d'art moderne et contemporain", desc: "Le musée national marocain d'art moderne, ouvert en 2014, abrite une superbe collection d'art contemporain marocain et international dans un bâtiment remarquable près de la médina. Un rappel que l'identité culturelle marocaine est autant affaire de présent que de passé." },
      ],
    },
  },

  /* ═══════════════════════════════════════════════════════════════
     3. MARRAKECH
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: 'marrakech',
    emoji: '🌴',
    nameEn: 'Marrakech',
    nameAr: 'مراكش',
    kicker: {
      en: 'Tourist Capital · Medieval · Vibrant · Unmissable',
      ar: 'العاصمة السياحية · قرونية · نابضة · لا تُفوَّت',
      fr: 'Capitale touristique · Médiévale · Vibrante · Incontournable',
    },
    accent: 'var(--gold)',
    facts: {
      en: [
        { label: 'Stadium', value: 'Grand Stade de Marrakech' },
        { label: 'Population', value: '1 million' },
        { label: 'Region', value: 'Marrakech-Safi' },
      ],
      ar: [
        { label: 'الملعب', value: 'ملعب مراكش الكبير' },
        { label: 'السكان', value: 'مليون نسمة' },
        { label: 'الجهة', value: 'مراكش-آسفي' },
      ],
      fr: [
        { label: 'Stade', value: 'Grand Stade de Marrakech' },
        { label: 'Population', value: '1 million' },
        { label: 'Région', value: 'Marrakech-Safi' },
      ],
    },
    population: 1_000_000,
    region: 'Marrakech-Safi',
    geo: { latitude: 31.6295, longitude: -7.9811 },
    history: {
      en: 'Marrakech was founded in 1070 by the Almoravid dynasty as their imperial capital, and its name — derived from the Berber words for "Land of God" — eventually became the name of the country itself. The Almohads, who succeeded the Almoravids, gave the city its most iconic early monuments, including the Koutoubia Mosque. Successive dynasties — Saadians, Alaouites — added palaces, gardens, and madrasas that layered the medina into the extraordinary living museum it is today. Modern Marrakech, particularly since the 1960s, has become one of the most visited cities in Africa, a place where the medieval and the contemporary coexist with a vibrancy that has attracted artists, writers, designers, and now millions of annual tourists.',
      ar: 'تأسّست مراكش سنة 1070 على يد الدولة المرابطية كعاصمة إمبراطورية لها، واسمها — المشتقّ من كلمتَين أمازيغيتَين تعنيان «أرض الله» — أصبح في النهاية اسم البلاد نفسها. أعطى الموحّدون، الذين خلفوا المرابطين، المدينة أبرز معالمها المبكّرة، ومنها مسجد الكتبية. أضافت السلالات المتعاقبة — السعديون، العلويون — قصوراً وحدائق ومدارس جعلت المدينة العتيقة متحفاً حياً استثنائياً كما هي اليوم. مراكش الحديثة، خصوصاً منذ الستينيات، أصبحت إحدى أكثر المدن زيارة في أفريقيا، مكاناً تتعايش فيه العصور الوسطى والعصر الحديث بحيوية جذبت الفنانين والكتّاب والمصمّمين، واليوم ملايين السيّاح سنوياً.',
      fr: 'Marrakech fut fondée en 1070 par la dynastie almoravide comme capitale impériale, et son nom — dérivé des mots berbères signifiant « terre de Dieu » — est finalement devenu celui du pays lui-même. Les Almohades, successeurs des Almoravides, ont donné à la ville ses monuments précoces les plus emblématiques, dont la mosquée Koutoubia. Les dynasties successives — Saadiens, Alaouites — y ont ajouté palais, jardins et médersas qui ont sédimenté la médina en l\'extraordinaire musée vivant qu\'elle est aujourd\'hui. La Marrakech moderne, surtout depuis les années 1960, est devenue l\'une des villes les plus visitées d\'Afrique, un lieu où le médiéval et le contemporain coexistent avec une vitalité qui a attiré artistes, écrivains, designers et, désormais, des millions de touristes chaque année.',
    },
    neighborhoods: {
      en: [
        { name: 'Gueliz (Ville Nouvelle)', desc: 'The modern city centre built during the French Protectorate. Avenue Mohammed V runs through its core, lined with cafes, restaurants, international brands, and galleries. Gueliz is the most convenient base for World Cup visitors who want walkable restaurants, reliable Wi-Fi, and easy taxi access to both the medina and the stadium.' },
        { name: 'Hivernage', desc: "Marrakech's luxury hotel district, nestled between the medina walls and Gueliz. The Royal Theatre, Congress Palace, and the city's grandest hotels — La Mamounia, Royal Mansour — are here. Hivernage is manicured, quiet, and discreetly expensive. For fans seeking five-star comfort within walking distance of the Jemaa el-Fnaa." },
        { name: 'Medina & Jemaa el-Fnaa', desc: 'The heart of everything. The walled medieval city is where the riads, the souks, the palaces, and the square all live. Staying inside the medina is the most immersive experience in Morocco, but navigating the narrow lanes with luggage requires commitment. Once settled, you will not want to leave.' },
        { name: 'Palmeraie', desc: 'A vast palm grove north of the city, dotted with luxury resorts, golf courses, and private villas. The Palmeraie is a retreat from the intensity of the medina — pool-and-spa territory for visitors who want Marrakech on their own terms. A 15-minute taxi ride from the city centre.' },
        { name: 'Mellah (Jewish Quarter)', desc: "The historic Jewish quarter adjacent to the Royal Palace is one of the medina's most characterful areas. The Lazama Synagogue, the spice souk, and some of the best-value riads in the city are here. Less touristy than the streets around Jemaa el-Fnaa, and all the better for it." },
      ],
      ar: [
        { name: 'كليز (المدينة الجديدة)', desc: 'وسط المدينة الحديث الذي بُني في عهد الحماية الفرنسية. يمرّ شارع محمد الخامس في قلبه، وتصطف على طوله المقاهي والمطاعم والماركات العالمية والمعارض. كليز القاعدة الأنسب لزوار كأس العالم الذين يريدون مطاعم قابلة للمشي، وواي فاي موثوق، ووصولاً سهلاً بسيارة الأجرة إلى المدينة العتيقة والملعب معاً.' },
        { name: 'هيفرناج', desc: 'حي فنادق مراكش الفاخرة، يتمركز بين أسوار المدينة العتيقة وكليز. المسرح الملكي وقصر المؤتمرات وأفخم فنادق المدينة — «المامونية»، «المنصور الملكي» — هنا. هيفرناج مُعتنى به، هادئ، ومكلف بشكل خفي. للمشجعين الباحثين عن راحة الخمس نجوم على مسافة المشي من ساحة جامع الفنا.' },
        { name: 'المدينة العتيقة وجامع الفنا', desc: 'قلب كل شيء. المدينة العتيقة المسوّرة هي حيث تعيش الرياضات والأسواق والقصور والساحة كلها. الإقامة داخل المدينة العتيقة هي التجربة الأكثر انغماساً في المغرب، لكن التنقّل في الأزقة الضيّقة بالأمتعة يتطلّب التزاماً. بمجرد أن تستقرّ، لن تريد المغادرة.' },
        { name: 'النخيل', desc: 'واحة نخيل شاسعة شمال المدينة، تتناثر فيها المنتجعات الفاخرة وملاعب الغولف والفيلات الخاصة. النخيل ملاذ من شدّة المدينة العتيقة — أرض المسابح والسبا للزوار الذين يريدون مراكش على شروطهم. على بعد 15 دقيقة بسيارة الأجرة من وسط المدينة.' },
        { name: 'الملاح (الحي اليهودي)', desc: 'الحي اليهودي التاريخي الملاصق للقصر الملكي هو أحد أكثر مناطق المدينة العتيقة طابعاً. كنيس اللعزامة، وسوق التوابل، وبعض أفضل الرياضات من حيث القيمة في المدينة كلها هنا. أقل سياحية من الشوارع المحيطة بجامع الفنا، وكل ذلك لصالحه.' },
      ],
      fr: [
        { name: 'Guéliz (Ville Nouvelle)', desc: "Le centre-ville moderne construit durant le protectorat français. L'avenue Mohammed V en traverse le cœur, bordée de cafés, restaurants, marques internationales et galeries. Guéliz est la base la plus pratique pour les visiteurs de la Coupe du Monde qui veulent des restaurants accessibles à pied, une connexion Wi-Fi fiable et un accès facile en taxi à la fois à la médina et au stade." },
        { name: 'Hivernage', desc: "Le quartier des hôtels de luxe de Marrakech, niché entre les murs de la médina et Guéliz. Le Théâtre royal, le Palais des congrès et les hôtels les plus prestigieux de la ville — La Mamounia, Royal Mansour — s'y trouvent. Hivernage est soigné, tranquille et discrètement luxueux. Pour les supporters en quête de confort cinq étoiles à distance de marche de la place Jemaa el-Fnaa." },
        { name: 'Médina & Jemaa el-Fnaa', desc: "Le cœur de tout. La cité médiévale fortifiée abrite les riads, les souks, les palais et la grande place. Séjourner dans la médina est l'expérience la plus immersive du Maroc, mais naviguer dans les ruelles étroites avec des bagages demande de l'engagement. Une fois installé, vous ne voudrez plus partir." },
        { name: 'Palmeraie', desc: "Une vaste palmeraie au nord de la ville, parsemée de resorts de luxe, de terrains de golf et de villas privées. La Palmeraie est une retraite loin de l'intensité de la médina — territoire de piscines et de spas pour les visiteurs qui veulent Marrakech à leur rythme. À 15 minutes de taxi du centre-ville." },
        { name: 'Mellah (Quartier juif)', desc: "Le quartier juif historique adjacent au Palais royal est l'un des quartiers les plus typés de la médina. La synagogue Lazama, le souk aux épices et certains des meilleurs riads en rapport qualité-prix de la ville s'y trouvent. Moins touristique que les rues autour de Jemaa el-Fnaa, et tant mieux." },
      ],
    },
    restaurants: {
      en: [
        { name: 'Nomad — Modern Moroccan Rooftop', desc: "Perched above the spice souk with views across the medina rooftops to the Atlas Mountains, Nomad serves modern Moroccan cuisine — camel kefta, harissa prawns, watermelon salad — in a beautiful setting. The rooftop at sunset is one of Marrakech's great pleasures. Reserve in advance. 150-250 MAD." },
        { name: 'Le Jardin — Garden Dining', desc: 'Hidden in the northern medina, Le Jardin is a lush courtyard restaurant that feels like dining in a botanical garden. The menu mixes Moroccan salads, grilled meats, and light international dishes. A cool, calm refuge from the souk intensity. 120-200 MAD.' },
        { name: 'Jemaa el-Fnaa Food Stalls — Street Food', desc: "Every evening from around 5pm, dozens of food stalls assemble in the square. Harira soup, grilled meats, snail broth, fresh juice, msemen pancakes — all served from numbered stalls competing for your attention. This is one of the world's great street food experiences. Choose a busy stall and sit down. 30-70 MAD for a full meal." },
        { name: "Amal Women's Training Center — Social Enterprise", desc: 'A non-profit restaurant that trains disadvantaged women in the culinary arts. The daily set menu of traditional Moroccan dishes — tajine, couscous, salads — is homestyle, generous, and exceptional value. Supporting a genuinely worthy cause. 60-100 MAD.' },
        { name: 'La Mamounia — Palace Fine Dining', desc: 'If one meal in Marrakech deserves to be a splurge, make it dinner at La Mamounia. The Italian and Moroccan restaurants within this legendary 1920s palace-hotel are among the finest in North Africa. The gardens alone are worth the visit. 500+ MAD. Reserve well in advance.' },
      ],
      ar: [
        { name: 'نوماد — مطبخ مغربي حديث على السطح', desc: 'يقع فوق سوق التوابل بإطلالات تمتد من أسطح المدينة العتيقة إلى جبال الأطلس، ويقدّم «نوماد» مطبخاً مغربياً حديثاً — كفتة الجمل، جمبري الهريسة، سلطة البطيخ — في فضاء جميل. السطح عند الغروب من أعظم متع مراكش. احجز مسبقاً. 150-250 درهماً.' },
        { name: 'لو جاردان — عشاء في الحديقة', desc: 'مخبّأ في شمال المدينة العتيقة، «لو جاردان» مطعم فناء خضراء يُشعر وكأنك تأكل في حديقة نباتية. تمزج القائمة بين السلطات المغربية واللحوم المشوية وأطباق عالمية خفيفة. ملاذ بارد وهادئ من شدّة السوق. 120-200 درهم.' },
        { name: 'أكشاك جامع الفنا — طعام الشارع', desc: 'كل مساء من حوالي الخامسة، تتجمّع عشرات أكشاك الطعام في الساحة. الحريرة، اللحوم المشوية، مرق الحلزون، العصير الطازج، المسمّن — كلها تُقدَّم من أكشاك مرقّمة تتنافس على جذب انتباهك. إنها واحدة من أعظم تجارب طعام الشارع في العالم. اختر كشكاً مزدحماً واجلس. 30-70 درهماً لوجبة كاملة.' },
        { name: 'مركز أمل لتكوين النساء — مقاولة اجتماعية', desc: 'مطعم غير ربحي يدرّب النساء المحرومات على فنون الطبخ. قائمة الطعام اليومية الثابتة من الأطباق المغربية التقليدية — طاجين، كسكس، سلطات — بيتيّة الطابع، كريمة، وبقيمة استثنائية. دعم قضية تستحقّ حقاً. 60-100 درهم.' },
        { name: 'المامونية — عشاء قصر راقٍ', desc: 'إذا كانت وجبة واحدة في مراكش تستحقّ الإنفاق، فليكن العشاء في المامونية. المطاعم الإيطالية والمغربية داخل هذا الفندق-القصر الأسطوري من عشرينيات القرن الماضي من أرقى المطاعم في شمال أفريقيا. الحدائق وحدها تستحقّ الزيارة. 500+ درهم. احجز قبل مدة بعيدة.' },
      ],
      fr: [
        { name: 'Nomad — Rooftop marocain moderne', desc: "Perché au-dessus du souk aux épices avec des vues à travers les toits de la médina jusqu'aux montagnes de l'Atlas, Nomad sert une cuisine marocaine moderne — kefta de chameau, crevettes à la harissa, salade de pastèque — dans un cadre magnifique. Le rooftop au coucher du soleil est l'un des grands plaisirs de Marrakech. Réservez à l'avance. 150-250 MAD." },
        { name: 'Le Jardin — Dîner dans un jardin', desc: "Caché dans la médina nord, Le Jardin est un restaurant avec cour luxuriante qui donne l'impression de dîner dans un jardin botanique. La carte mêle salades marocaines, viandes grillées et plats internationaux légers. Un refuge frais et calme loin de l'intensité du souk. 120-200 MAD." },
        { name: 'Jemaa el-Fnaa — Étals de street food', desc: "Chaque soir à partir de 17h environ, des dizaines d'étals de restauration s'installent sur la place. Harira, viandes grillées, bouillon d'escargots, jus frais, msemen — tous servis depuis des étals numérotés qui rivalisent pour attirer votre attention. C'est l'une des grandes expériences de street food au monde. Choisissez un étal fréquenté et asseyez-vous. 30-70 MAD pour un repas complet." },
        { name: 'Centre Amal pour la formation des femmes — Entreprise sociale', desc: "Un restaurant à but non lucratif qui forme aux arts culinaires des femmes en situation de précarité. Le menu du jour, composé de plats marocains traditionnels — tajine, couscous, salades — est maison, généreux et d'un excellent rapport qualité-prix. Soutenir une cause véritablement méritante. 60-100 MAD." },
        { name: 'La Mamounia — Gastronomie de palais', desc: "Si un repas à Marrakech mérite la folie, que ce soit le dîner à La Mamounia. Les restaurants italien et marocain de ce palais-hôtel légendaire des années 1920 sont parmi les plus raffinés d'Afrique du Nord. Les jardins à eux seuls valent la visite. 500+ MAD. Réservez longtemps à l'avance." },
      ],
    },
    accommodation: {
      en: [
        { tier: 'Budget', range: '$30–60 / night', desc: 'The medina is home to hundreds of small riads and hostels at budget prices. Riad Laayoun, Equity Point Marrakech, and Waka Waka hostel are popular with backpackers. The Mellah area offers some of the best-value riads. Book months ahead for 2030 — Marrakech will be the most in-demand city of the tournament.' },
        { tier: 'Mid-Range', range: '$80–150 / night', desc: "Gueliz hotels like Savoy Le Grand, 2Ciels, and the medina's countless mid-range riads offer comfort and character. A well-chosen riad — with its central courtyard, rooftop terrace, and traditional architecture — is the definitive Marrakech accommodation experience. This is the sweet spot." },
        { tier: 'Luxury', range: '$200+ / night', desc: "La Mamounia, Royal Mansour, and Mandarin Oriental lead the luxury field, all within the Hivernage-medina zone. The Palmeraie's resort hotels — Amanjena, Four Seasons — offer a different luxury register: pools, gardens, and distance from the intensity. Expect World Cup prices to be 2-3x normal rates." },
      ],
      ar: [
        { tier: 'اقتصادي', range: '30-60 دولاراً / الليلة', desc: 'المدينة العتيقة تضمّ مئات الرياضات والنزل الصغيرة بأسعار اقتصادية. «رياض لعيون»، و«إيكويتي بوينت مراكش»، ونزل «واكا واكا» شائعة بين المسافرين ذوي الميزانيات المحدودة. منطقة الملاح تقدّم بعض أفضل الرياضات من حيث القيمة. احجز قبل أشهر لـ 2030 — ستكون مراكش المدينة الأكثر طلباً في البطولة.' },
        { tier: 'متوسط', range: '80-150 دولاراً / الليلة', desc: 'فنادق كليز مثل «سافوي لو غران» و«2 سييل» ورياضات المدينة العتيقة التي لا تُحصى من الفئة المتوسطة تقدّم الراحة والطابع. رياض حسن الاختيار — بفنائه المركزي وسطحه العلوي وعمارته التقليدية — هو تجربة الإقامة المراكشية بامتياز. هذه هي النقطة المثالية.' },
        { tier: 'فاخر', range: '200+ دولاراً / الليلة', desc: '«المامونية»، «المنصور الملكي»، و«ماندارين أورينتال» تتصدّر الفئة الفاخرة، كلها داخل منطقة هيفرناج-المدينة العتيقة. فنادق منتجعات النخيل — «أمنجينا»، «فور سيزونز» — تقدّم سجلاً مختلفاً للفخامة: مسابح وحدائق وبُعد عن الشدّة. توقّع أن تكون أسعار كأس العالم 2 إلى 3 أضعاف المعدّل العادي.' },
      ],
      fr: [
        { tier: 'Budget', range: '30-60 $ / nuit', desc: "La médina abrite des centaines de petits riads et auberges à prix budget. Riad Laayoun, Equity Point Marrakech et l'auberge Waka Waka sont populaires auprès des routards. La zone du Mellah propose certains des riads au meilleur rapport qualité-prix. Réservez des mois à l'avance pour 2030 — Marrakech sera la ville la plus demandée du tournoi." },
        { tier: 'Milieu de gamme', range: '80-150 $ / nuit', desc: "Les hôtels de Guéliz comme le Savoy Le Grand, 2Ciels, et les innombrables riads de gamme moyenne de la médina offrent confort et caractère. Un riad bien choisi — avec son patio central, sa terrasse rooftop et son architecture traditionnelle — est l'expérience d'hébergement marrakchie par excellence. C'est le point idéal." },
        { tier: 'Luxe', range: '200+ $ / nuit', desc: "La Mamounia, le Royal Mansour et le Mandarin Oriental dominent le segment luxe, tous dans la zone Hivernage-médina. Les resorts de la Palmeraie — Amanjena, Four Seasons — offrent un registre de luxe différent : piscines, jardins et distance avec l'intensité. Attendez-vous à des tarifs Coupe du Monde deux à trois fois supérieurs aux taux habituels." },
      ],
    },
    gettingThere: {
      en: [
        { icon: '✈', label: 'Airport', detail: 'Marrakech Menara Airport (RAK) — just 6km from the city centre, one of the closest airport-to-stadium relationships in the tournament. Direct flights from over 60 international destinations. The airport is a 15-minute taxi ride from Gueliz and 20 minutes from the medina.' },
        { icon: '🚄', label: 'Train', detail: 'Marrakech railway station connects to Casablanca (3.5h conventional, faster once the Al Boraq extension opens), Rabat (4h), and Tangier. The station is in Gueliz, within walking distance of hotels and a short taxi from the medina.' },
        { icon: '💡', label: 'Tips', detail: 'Marrakech is a taxi city. Petit taxis (beige) should use the meter — insist on it. Within the medina, everything is on foot. Horse-drawn caleches are tourist transport, not practical transport. For the stadium, expect dedicated shuttles from central collection points.' },
      ],
      ar: [
        { icon: '✈', label: 'المطار', detail: 'مطار مراكش المنارة (RAK) — على بعد 6 كم فقط من وسط المدينة، إحدى أقرب العلاقات بين المطار والملعب في البطولة. رحلات مباشرة من أكثر من 60 وجهة دولية. المطار على بعد 15 دقيقة بسيارة الأجرة من كليز و20 دقيقة من المدينة العتيقة.' },
        { icon: '🚄', label: 'القطار', detail: 'محطة قطار مراكش تربط بالدار البيضاء (3.5 ساعات بالتقليدي، أسرع بمجرد فتح امتداد البراق)، الرباط (4 ساعات)، وطنجة. المحطة في كليز، على مسافة مشي من الفنادق وقرب سيارة أجرة من المدينة العتيقة.' },
        { icon: '💡', label: 'نصائح', detail: 'مراكش مدينة سيارات أجرة. يجب أن تستعمل سيارات الأجرة الصغيرة (البيج) العدّاد — أصرّ على ذلك. داخل المدينة العتيقة، كل شيء على الأقدام. العربات التي تجرّها الخيول للسياح لا للاستعمال العملي. للملعب، توقّع حافلات نقل مكوكي مخصصة من نقاط تجمّع مركزية.' },
      ],
      fr: [
        { icon: '✈', label: 'Aéroport', detail: "Aéroport Marrakech Ménara (RAK) — à seulement 6 km du centre-ville, l'une des relations aéroport-stade les plus rapprochées du tournoi. Vols directs depuis plus de 60 destinations internationales. L'aéroport se trouve à 15 minutes en taxi de Guéliz et 20 minutes de la médina." },
        { icon: '🚄', label: 'Train', detail: "La gare de Marrakech relie Casablanca (3h30 en conventionnel, plus rapide une fois l'extension Al Boraq ouverte), Rabat (4h) et Tanger. La gare est à Guéliz, à distance de marche des hôtels et à quelques minutes en taxi de la médina." },
        { icon: '💡', label: 'Conseils', detail: "Marrakech est une ville de taxis. Les petits taxis (beiges) devraient utiliser le compteur — insistez. Dans la médina, tout se fait à pied. Les calèches sont un transport touristique, pas un transport pratique. Pour le stade, attendez-vous à des navettes dédiées depuis des points de rassemblement centraux." },
      ],
    },
    matchday: {
      en: [
        'Grand Stade de Marrakech is on Route de Safi, approximately 11km from the city centre. Tournament shuttle buses and taxis will be the primary transport. Allow 30-45 minutes from central Marrakech.',
        'The Jemaa el-Fnaa will be the emotional centre of the matchday experience. Expect fan zones, giant screens, and an atmosphere unlike any other World Cup host city. The square has been gathering crowds for a thousand years. On match days, it will do so again.',
        'Marrakech matches will sell out first. Accommodation will be the most expensive and scarce in the tournament. Book as early as possible and consider basing nearby (Essaouira, Ouarzazate) and travelling in for match days.',
      ],
      ar: [
        'يقع ملعب مراكش الكبير على طريق آسفي، على بعد نحو 11 كم من وسط المدينة. ستكون حافلات النقل المكوكي للبطولة وسيارات الأجرة وسيلة النقل الأساسية. خصّص 30-45 دقيقة من وسط مراكش.',
        'ستكون ساحة جامع الفنا المركز العاطفي لتجربة يوم المباراة. توقّع مناطق مشجعين، شاشات عملاقة، وأجواء لا تضاهيها أي مدينة مضيفة أخرى لكأس العالم. كانت الساحة تجمع الحشود منذ ألف عام. في أيام المباريات، ستفعل ذلك مجدداً.',
        'ستنفد تذاكر مباريات مراكش أولاً. وستكون الإقامة الأغلى والأندر في البطولة. احجز في أبكر وقت ممكن وفكّر في اتخاذ قاعدة قريبة (الصويرة، ورزازات) والسفر للحضور في أيام المباريات.',
      ],
      fr: [
        "Le Grand Stade de Marrakech se trouve sur la route de Safi, à environ 11 km du centre-ville. Les navettes du tournoi et les taxis seront les moyens de transport principaux. Comptez 30 à 45 minutes depuis le centre de Marrakech.",
        "La place Jemaa el-Fnaa sera le centre émotionnel de l'expérience jour de match. Attendez-vous à des zones de supporters, des écrans géants et une ambiance qui n'a d'équivalent dans aucune autre ville hôte de la Coupe du Monde. La place rassemble des foules depuis mille ans. Les jours de match, elle le fera à nouveau.",
        "Les matchs de Marrakech seront les premiers à afficher complet. L'hébergement sera le plus cher et le plus rare du tournoi. Réservez le plus tôt possible et envisagez de vous baser à proximité (Essaouira, Ouarzazate) et de voyager pour les jours de match.",
      ],
    },
    dontMiss: {
      en: [
        { name: 'Jemaa el-Fnaa at Sunset', desc: 'UNESCO Masterpiece of Intangible Heritage. The square transforms every evening into one of the greatest public spectacles in the world: storytellers, musicians, snake charmers, acrobats, food vendors. Watch from a rooftop terrace as the smoke rises and the lights come on. There is nothing like it anywhere.' },
        { name: 'Majorelle Garden', desc: 'A 12-acre botanical paradise created by French painter Jacques Majorelle and later owned by Yves Saint Laurent. The electric cobalt blue of the garden buildings against tropical planting is unforgettable. The adjacent Berber Museum and YSL Museum are both excellent. Book tickets in advance — it sells out daily.' },
        { name: 'Bahia Palace', desc: 'A 19th-century palace with 160 rooms, elaborate zellij tilework, painted cedar ceilings, and eight hectares of gardens. One of the finest surviving examples of Moroccan palatial architecture. Allow an hour and visit early to avoid crowds.' },
        { name: 'Atlas Mountains Day Trip', desc: 'The High Atlas begin 45 minutes south of Marrakech. Imlil village, the Ourika Valley, and the Toubkal National Park offer hiking, Berber villages, and dramatic mountain scenery. A day trip from Marrakech is one of the most rewarding side-excursions in the entire tournament.' },
      ],
      ar: [
        { name: 'جامع الفنا عند الغروب', desc: 'تحفة التراث الثقافي غير المادي لليونسكو. تتحوّل الساحة كل مساء إلى واحدة من أعظم العروض العمومية في العالم: رواة، موسيقيون، مروّضو أفاعٍ، بهلوانيون، باعة طعام. شاهد من شرفة على السطح وهي ترتفع منها الأدخنة وتضاء الأنوار. لا شيء مثلها في أي مكان.' },
        { name: 'حديقة ماجوريل', desc: 'جنّة نباتية مساحتها 12 فداناً أنشأها الرسّام الفرنسي جاك ماجوريل ثم امتلكها إيف سان لوران. الأزرق الكوبالتي الكهربائي لمباني الحديقة في مقابل النبات الاستوائي لا يُنسى. متحف الأمازيغ المجاور ومتحف إيف سان لوران ممتازان كلاهما. احجز التذاكر مسبقاً — تنفد يومياً.' },
        { name: 'قصر الباهية', desc: 'قصر من القرن التاسع عشر بـ 160 غرفة، وزليج متقن، وأسقف أرز مرسومة، وحدائق تمتد على ثمانية هكتارات. أحد أرقى النماذج الباقية للعمارة القصرية المغربية. خصّص ساعة وزر مبكراً لتجنّب الحشود.' },
        { name: 'رحلة يوم إلى جبال الأطلس', desc: 'يبدأ الأطلس الكبير على بعد 45 دقيقة جنوب مراكش. قرية إمليل ووادي أوريكة والمنتزه الوطني لتوبقال تقدّم المشي الجبلي والقرى الأمازيغية والمناظر الجبلية الجذابة. رحلة يوم من مراكش من أكثر الرحلات الجانبية مكافأةً في البطولة كلها.' },
      ],
      fr: [
        { name: 'Jemaa el-Fnaa au coucher du soleil', desc: "Chef-d'œuvre du patrimoine culturel immatériel de l'UNESCO. La place se transforme chaque soir en l'un des plus grands spectacles publics du monde : conteurs, musiciens, charmeurs de serpents, acrobates, marchands de nourriture. Observez depuis une terrasse rooftop tandis que la fumée monte et que les lumières s'allument. Rien de semblable nulle part ailleurs." },
        { name: 'Jardin Majorelle', desc: "Un paradis botanique de 12 acres créé par le peintre français Jacques Majorelle et plus tard propriété d'Yves Saint Laurent. Le bleu cobalt électrique des bâtiments du jardin contre la végétation tropicale est inoubliable. Le musée berbère adjacent et le musée YSL sont tous deux excellents. Réservez les billets à l'avance — ils partent chaque jour." },
        { name: 'Palais Bahia', desc: "Un palais du XIXe siècle de 160 pièces, avec un zellige élaboré, des plafonds de cèdre peints et huit hectares de jardins. L'un des plus beaux exemples préservés de l'architecture palatiale marocaine. Comptez une heure et visitez tôt pour éviter la foule." },
        { name: "Excursion dans l'Atlas", desc: "Le Haut Atlas commence à 45 minutes au sud de Marrakech. Le village d'Imlil, la vallée de l'Ourika et le parc national du Toubkal offrent randonnée, villages berbères et paysages de montagne spectaculaires. Une excursion depuis Marrakech est l'une des sorties les plus gratifiantes du tournoi entier." },
      ],
    },
  },

  /* ═══════════════════════════════════════════════════════════════
     4. TANGIER
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: 'tangier',
    emoji: '⚓',
    nameEn: 'Tangier',
    nameAr: 'طنجة',
    kicker: {
      en: 'Literary · Cosmopolitan · Gateway to Europe · Transformed',
      ar: 'أدبية · كوسموبوليتانية · بوابة أوروبا · متجدّدة',
      fr: "Littéraire · Cosmopolite · Porte de l'Europe · Transformée",
    },
    accent: 'var(--red)',
    facts: {
      en: [
        { label: 'Stadium', value: 'Ibn Batouta Stadium' },
        { label: 'Population', value: '1 million' },
        { label: 'Region', value: 'Tanger-Tetouan-Al Hoceima' },
      ],
      ar: [
        { label: 'الملعب', value: 'ملعب ابن بطوطة' },
        { label: 'السكان', value: 'مليون نسمة' },
        { label: 'الجهة', value: 'طنجة-تطوان-الحسيمة' },
      ],
      fr: [
        { label: 'Stade', value: 'Stade Ibn Batouta' },
        { label: 'Population', value: '1 million' },
        { label: 'Région', value: 'Tanger-Tétouan-Al Hoceïma' },
      ],
    },
    population: 1_000_000,
    region: 'Tanger-Tetouan-Al Hoceima',
    geo: { latitude: 35.7673, longitude: -5.7998 },
    history: {
      en: "Tangier has been coveted by empires for three millennia. Phoenicians, Romans, Vandals, Byzantines, Arabs, Portuguese, Spanish, and British have all controlled this city at the hinge point between the Atlantic and the Mediterranean, between Africa and Europe. In the 20th century, Tangier's International Zone (1923-1956) made it a haven for smugglers, spies, writers, and artists — the city of Paul Bowles, William Burroughs, Tennessee Williams, and the Rolling Stones. After decades of post-independence neglect, Tangier has undergone a dramatic renewal since the 2000s, driven by the Tanger Med mega-port, the Al Boraq high-speed railway, and massive royal investment that has transformed it into one of Morocco's most dynamic cities.",
      ar: "طنجة مدينة تطمع فيها الإمبراطوريات منذ ثلاثة آلاف عام. الفينيقيون، الرومان، الوندال، البيزنطيون، العرب، البرتغاليون، الإسبان، والبريطانيون جميعهم سيطروا على هذه المدينة عند نقطة المفصل بين الأطلسي والمتوسط، بين أفريقيا وأوروبا. في القرن العشرين، جعلت «المنطقة الدولية» لطنجة (1923-1956) المدينة ملاذاً للمهرّبين والجواسيس والكتّاب والفنانين — مدينة بول بولز، ووليام بوروز، وتينيسي ويليامز، والرولينغ ستونز. بعد عقود من الإهمال بعد الاستقلال، شهدت طنجة نهضة دراماتيكية منذ الألفية الثالثة، قادها ميناء «طنجة المتوسط» الضخم، وخط البراق فائق السرعة، والاستثمار الملكي الكبير الذي حوّلها إلى إحدى أكثر مدن المغرب ديناميكية.",
      fr: "Tanger a été convoitée par les empires depuis trois millénaires. Phéniciens, Romains, Vandales, Byzantins, Arabes, Portugais, Espagnols et Britanniques ont tous contrôlé cette ville au point de charnière entre l'Atlantique et la Méditerranée, entre l'Afrique et l'Europe. Au XXe siècle, la Zone internationale de Tanger (1923-1956) en a fait un refuge pour contrebandiers, espions, écrivains et artistes — la ville de Paul Bowles, William Burroughs, Tennessee Williams et des Rolling Stones. Après des décennies de négligence post-indépendance, Tanger a connu une renaissance spectaculaire depuis les années 2000, portée par le méga-port de Tanger Med, la ligne à grande vitesse Al Boraq et un investissement royal massif qui en ont fait l'une des villes les plus dynamiques du Maroc.",
    },
    neighborhoods: {
      en: [
        { name: 'Kasbah', desc: "The historic hilltop fortress overlooking the Strait of Gibraltar. Narrow lanes, whitewashed walls, and some of the finest boutique accommodation in Morocco. The Kasbah Museum (former Sultan's palace) crowns the summit with views of the Spanish coast. This is the atmospheric heart of old Tangier and the best base for visitors who want character over convenience." },
        { name: 'Ville Nouvelle', desc: 'The modern city centre stretching south from the Grand Socco. Boulevard Pasteur and Place de France are the main arteries, lined with pavement cafes, banks, and shops. Ville Nouvelle is flat, walkable, and centrally located between the medina and the beach. The most practical base for World Cup visitors.' },
        { name: 'Malabata', desc: 'The beach district east of the port, extending along Tangier Bay toward Cap Malabata. New hotels, restaurants, and a seafront promenade have transformed this area. The views back toward the medina across the bay are spectacular, particularly at sunset. Good swimming beaches in summer.' },
        { name: 'Cap Spartel & The Mountain', desc: "The forested hills west of the city, where the Atlantic meets the Mediterranean. Cap Spartel lighthouse, the Caves of Hercules, and the Diplomatic Forest are all here. Luxury villas and hotels offer seclusion within 15 minutes of the city centre. A world apart from the medina's intensity." },
        { name: 'Old Medina', desc: "Tangier's medina is more compact and less disorienting than Fes or Marrakech, but no less atmospheric. The Petit Socco — once the cafe society hub of the International Zone — retains a faded glamour. Art galleries, craft shops, and small restaurants fill the lanes. Easily walkable in a half-day." },
      ],
      ar: [
        { name: 'القصبة', desc: 'القلعة التاريخية على قمة التلّة المطلّة على مضيق جبل طارق. أزقة ضيّقة، جدران مُبيّضة، وبعض أفضل الإقامات البوتيكية في المغرب. متحف القصبة (قصر السلطان السابق) يتوّج القمّة بإطلالات على الساحل الإسباني. هذا هو القلب العبق لطنجة القديمة وأفضل قاعدة للزوار الذين يريدون الطابع على حساب الراحة.' },
        { name: 'المدينة الجديدة', desc: 'وسط المدينة الحديث الممتدّ جنوباً من السوق الكبير. شارع باستور وساحة فرنسا هما الشريانان الرئيسيان، تصطف على طولهما مقاهي الرصيف والبنوك والمحلات. المدينة الجديدة مسطّحة، قابلة للمشي، ومركزية بين المدينة العتيقة والشاطئ. القاعدة الأكثر عملية لزوار كأس العالم.' },
        { name: 'مالاباطا', desc: 'حي الشاطئ شرق الميناء، يمتدّ على طول خليج طنجة نحو رأس مالاباطا. فنادق جديدة ومطاعم وواجهة بحرية حوّلت هذه المنطقة. الإطلالات نحو المدينة العتيقة عبر الخليج مذهلة، خصوصاً عند الغروب. شواطئ سباحة جيدة في الصيف.' },
        { name: 'رأس سبارطيل وجبل طنجة', desc: 'التلال المشجّرة غرب المدينة، حيث يلتقي الأطلسي بالمتوسط. فنار رأس سبارطيل، ومغارات هرقل، وغابة الدبلوماسية كلها هنا. فيلات وفنادق فاخرة تقدّم عزلة في غضون 15 دقيقة من وسط المدينة. عالم منفصل عن شدّة المدينة العتيقة.' },
        { name: 'المدينة العتيقة', desc: 'المدينة العتيقة بطنجة أكثر تماسكاً وأقل إرباكاً من فاس أو مراكش، لكنها ليست أقل عبقاً. «السوق الصغير» — الذي كان يوماً مركز مقاهي المنطقة الدولية — يحتفظ ببهاء باهت. تملأ معارض الفن ومتاجر الحرف والمطاعم الصغيرة الأزقة. يمكن التجوّل فيها بسهولة في نصف يوم.' },
      ],
      fr: [
        { name: 'Kasbah', desc: "La forteresse historique en sommet de colline surplombant le détroit de Gibraltar. Ruelles étroites, murs blanchis à la chaux et certaines des plus belles adresses boutique du Maroc. Le musée de la Kasbah (ancien palais du sultan) couronne le sommet avec des vues sur la côte espagnole. C'est le cœur atmosphérique du vieux Tanger et la meilleure base pour les visiteurs qui privilégient le caractère au confort." },
        { name: 'Ville Nouvelle', desc: "Le centre-ville moderne qui s'étend vers le sud depuis le Grand Socco. Le boulevard Pasteur et la place de France sont les artères principales, bordées de cafés en terrasse, de banques et de boutiques. Ville Nouvelle est plate, marchable et centralement située entre la médina et la plage. La base la plus pratique pour les visiteurs de la Coupe du Monde." },
        { name: 'Malabata', desc: "Le quartier de plage à l'est du port, s'étendant le long de la baie de Tanger vers le Cap Malabata. De nouveaux hôtels, restaurants et une promenade en bord de mer ont transformé cette zone. Les vues vers la médina de l'autre côté de la baie sont spectaculaires, particulièrement au coucher du soleil. Bonnes plages de baignade en été." },
        { name: 'Cap Spartel & la Montagne', desc: "Les collines boisées à l'ouest de la ville, où l'Atlantique rencontre la Méditerranée. Le phare du Cap Spartel, les grottes d'Hercule et la Forêt Diplomatique sont tous ici. Villas de luxe et hôtels offrent l'isolement à 15 minutes du centre-ville. Un monde à part de l'intensité de la médina." },
        { name: 'Vieille Médina', desc: "La médina de Tanger est plus compacte et moins déroutante que celles de Fès ou Marrakech, mais tout aussi atmosphérique. Le Petit Socco — autrefois le cœur de la vie de café de la Zone internationale — conserve un glamour délavé. Galeries d'art, boutiques d'artisanat et petits restaurants remplissent les ruelles. Facile à parcourir à pied en une demi-journée." },
      ],
    },
    restaurants: {
      en: [
        { name: 'El Morocco Club — Fine Dining', desc: 'A beautifully restored 1930s mansion in the medina, serving refined Moroccan cuisine with European influences. The interiors are exquisite — all zellige, carved plaster, and candlelight. One of the best restaurants in northern Morocco. Reserve ahead. 250-400 MAD.' },
        { name: 'Cafe Hafa — Legendary Cliffside Cafe', desc: 'Established in 1921, this terraced cafe cascades down the cliffside above the Strait of Gibraltar. Mint tea, simple pastries, and one of the most famous views in Morocco. The Rolling Stones, Paul Bowles, and the Beat Generation all sat on these same terraces. No food beyond snacks, but the experience is priceless. 20-40 MAD.' },
        { name: 'Saveur de Poisson — Set-Menu Fish', desc: 'A Tangier institution. There is no menu. You sit down and course after course of fish and seafood arrives — soup, fried fish, grilled fish, salads — until you signal that you have had enough. The price is fixed, the fish is that morning\'s catch, and the experience is unique. Approximately 150 MAD.' },
        { name: 'Le Salon Bleu — Rooftop Kasbah', desc: 'Perched on a terrace in the kasbah with panoramic views of the port and the strait, Le Salon Bleu serves Moroccan-Mediterranean small plates and fresh juices. The setting is as good as anything in Tangier. Popular at sunset. 100-200 MAD.' },
        { name: 'Port Fish Market', desc: "Tangier's port area has simple grill restaurants where the day's catch is displayed on ice and cooked to order. Sardines, prawns, sole, and calamari — fresh, fast, and remarkably cheap. Point at what you want and wait ten minutes. 50-100 MAD." },
      ],
      ar: [
        { name: 'إل موروكو كلوب — عشاء راقٍ', desc: 'قصر من ثلاثينيات القرن الماضي رُمِّم بجمال في المدينة العتيقة، يقدّم مطبخاً مغربياً راقياً بتأثيرات أوروبية. الداخل فاخر — زليج وجبس منحوت وضوء الشموع. من أفضل مطاعم شمال المغرب. احجز مسبقاً. 250-400 درهم.' },
        { name: 'مقهى الحافة — مقهى الجرف الأسطوري', desc: 'تأسّس عام 1921، ويتدلّى هذا المقهى المدرّج على جانب الجرف فوق مضيق جبل طارق. أتاي النعناع، وحلويات بسيطة، وواحدة من أشهر الإطلالات في المغرب. الرولينغ ستونز، وبول بولز، وجيل البيت جميعهم جلسوا على هذه الشرفات نفسها. لا طعام وراء الوجبات الخفيفة، لكن التجربة لا تُقدَّر بثمن. 20-40 درهماً.' },
        { name: 'سافور دو بواسون — قائمة سمك ثابتة', desc: 'مؤسسة طنجيّة. لا قائمة طعام. تجلس فيصل طبق بعد طبق من السمك والمأكولات البحرية — حساء، سمك مقلي، سمك مشوي، سلطات — حتى تشير بأنك اكتفيت. السعر ثابت، السمك صيد ذلك الصباح، والتجربة فريدة. نحو 150 درهماً.' },
        { name: 'الصالون الأزرق — شرفة القصبة', desc: 'يقع على شرفة في القصبة بإطلالات بانورامية على الميناء والمضيق، ويقدّم «الصالون الأزرق» أطباقاً صغيرة مغربية-متوسطية وعصائر طازجة. الفضاء بجودة أي شيء في طنجة. محبّب عند الغروب. 100-200 درهم.' },
        { name: 'سوق السمك بالميناء', desc: 'منطقة ميناء طنجة بها مطاعم شواء بسيطة تُعرَض فيها صيد اليوم على الثلج ويُطهى حسب الطلب. سردين، جمبري، موسى، كاليماري — طازج، سريع، ورخيص بشكل ملحوظ. أشر إلى ما تريد وانتظر عشر دقائق. 50-100 درهم.' },
      ],
      fr: [
        { name: 'El Morocco Club — Gastronomie', desc: "Une demeure des années 1930 magnifiquement restaurée dans la médina, servant une cuisine marocaine raffinée aux influences européennes. Les intérieurs sont exquis — tout en zellige, plâtre sculpté et éclairage aux chandelles. L'un des meilleurs restaurants du nord du Maroc. Réservez à l'avance. 250-400 MAD." },
        { name: 'Café Hafa — Café légendaire en falaise', desc: "Créé en 1921, ce café en terrasses dévale le flanc de la falaise au-dessus du détroit de Gibraltar. Thé à la menthe, pâtisseries simples et l'une des vues les plus célèbres du Maroc. Les Rolling Stones, Paul Bowles et la Beat Generation se sont tous assis sur ces mêmes terrasses. Pas de repas au-delà des en-cas, mais l'expérience n'a pas de prix. 20-40 MAD." },
        { name: 'Saveur de Poisson — Menu fixe poisson', desc: "Une institution tangéroise. Pas de carte. Vous vous asseyez et les plats de poisson et de fruits de mer arrivent les uns après les autres — soupe, poisson frit, poisson grillé, salades — jusqu'à ce que vous signaliez avoir assez mangé. Le prix est fixe, le poisson est celui pêché le matin même, et l'expérience est unique. Environ 150 MAD." },
        { name: 'Le Salon Bleu — Rooftop de la Kasbah', desc: "Perché sur une terrasse de la kasbah avec vues panoramiques sur le port et le détroit, Le Salon Bleu sert des petites assiettes marocaines-méditerranéennes et des jus frais. Le cadre vaut tout ce que Tanger peut offrir. Apprécié au coucher du soleil. 100-200 MAD." },
        { name: 'Marché aux poissons du port', desc: "La zone portuaire de Tanger abrite de simples grills où la pêche du jour est exposée sur glace et cuite à la commande. Sardines, crevettes, soles et calamars — frais, rapides et remarquablement bon marché. Pointez du doigt ce que vous voulez et attendez dix minutes. 50-100 MAD." },
      ],
    },
    accommodation: {
      en: [
        { tier: 'Budget', range: '$30–60 / night', desc: 'The medina has a growing selection of small guesthouses and hostels. Dar Nour and several new hostels near the Petit Socco offer character and location at budget prices. Ville Nouvelle also has clean, affordable hotels along Boulevard Pasteur.' },
        { tier: 'Mid-Range', range: '$80–150 / night', desc: "Tangier's mid-range has improved dramatically. Boutique hotels in the kasbah and medina — Nord-Pinus Tanger, Dar Chams Tanja — blend heritage architecture with modern comfort. Malabata's newer hotels offer sea views and contemporary style in this range." },
        { tier: 'Luxury', range: '$200+ / night', desc: "El Minzah, the grande dame of Tangier hotels since 1930, anchors the luxury tier in the city centre. The kasbah's Riad TanJa and Grand Hotel Villa de France (where Matisse painted) offer boutique luxury. Cap Spartel's Fairmont Le Tazi is the newest ultra-premium option." },
      ],
      ar: [
        { tier: 'اقتصادي', range: '30-60 دولاراً / الليلة', desc: 'تضم المدينة العتيقة اختياراً متزايداً من دور الضيافة الصغيرة والنزل. «دار نور» وعدّة نزل جديدة قرب السوق الصغير تقدّم الطابع والموقع بأسعار اقتصادية. المدينة الجديدة أيضاً بها فنادق نظيفة ومعقولة على طول شارع باستور.' },
        { tier: 'متوسط', range: '80-150 دولاراً / الليلة', desc: 'الفئة المتوسطة في طنجة تحسّنت بشكل دراماتيكي. الفنادق البوتيكية في القصبة والمدينة العتيقة — «نورد-بينوس طنجة»، «دار شمس طنجة» — تمزج عمارة التراث بالراحة الحديثة. فنادق مالاباطا الأحدث تقدّم إطلالات بحرية وأسلوباً معاصراً في هذه الفئة.' },
        { tier: 'فاخر', range: '200+ دولاراً / الليلة', desc: '«المنزه»، سيدة فنادق طنجة منذ 1930، هي مرساة الفئة الفاخرة في وسط المدينة. «رياض طنجة» في القصبة و«غران هوتيل فيلا دو فرانس» (حيث رسم ماتيس) يقدّمان فخامة بوتيكية. «فيرمونت لو تازي» برأس سبارطيل أحدث الخيارات ذات المستوى الأعلى.' },
      ],
      fr: [
        { tier: 'Budget', range: '30-60 $ / nuit', desc: "La médina offre une sélection croissante de petites maisons d'hôtes et d'auberges. Dar Nour et plusieurs nouvelles auberges près du Petit Socco offrent caractère et emplacement à prix budget. Ville Nouvelle dispose également d'hôtels propres et abordables le long du boulevard Pasteur." },
        { tier: 'Milieu de gamme', range: '80-150 $ / nuit', desc: "La gamme moyenne de Tanger s'est nettement améliorée. Des hôtels boutique dans la kasbah et la médina — Nord-Pinus Tanger, Dar Chams Tanja — marient architecture patrimoniale et confort moderne. Les hôtels plus récents de Malabata offrent vue sur mer et style contemporain dans cette fourchette." },
        { tier: 'Luxe', range: '200+ $ / nuit', desc: "El Minzah, la grande dame des hôtels tangérois depuis 1930, ancre le segment luxe au centre-ville. Le Riad TanJa de la kasbah et le Grand Hôtel Villa de France (où peignait Matisse) offrent un luxe boutique. Le Fairmont Le Tazi du Cap Spartel est la plus récente option ultra-premium." },
      ],
    },
    gettingThere: {
      en: [
        { icon: '✈', label: 'Airport', detail: 'Ibn Battouta Airport (TNG) — 15km southwest of the city centre. Growing international connections, particularly to European budget airline hubs. A taxi to the city takes 20-25 minutes.' },
        { icon: '🚄', label: 'Train & Ferry', detail: 'Tangier-Ville station is the terminus of the Al Boraq high-speed line: Casablanca in 2h10, Rabat in 90 minutes. This is the fastest intercity rail in Africa. The Tangier ferry port connects to Tarifa (35 min) and Algeciras (1h) in Spain — 14km across the Strait of Gibraltar. Many European fans will arrive by ferry.' },
        { icon: '💡', label: 'Tips', detail: 'Tangier is compact and walkable, though the hills are steep. Petit taxis (blue-striped) are cheap and plentiful. The city is the natural entry point for fans combining a Morocco World Cup trip with travel from southern Spain.' },
      ],
      ar: [
        { icon: '✈', label: 'المطار', detail: 'مطار ابن بطوطة (TNG) — على بعد 15 كم جنوب غرب وسط المدينة. اتصالات دولية متنامية، خصوصاً إلى محاور شركات الطيران الاقتصادية الأوروبية. سيارة أجرة إلى المدينة تستغرق 20-25 دقيقة.' },
        { icon: '🚄', label: 'القطار والعبّارة', detail: 'محطة طنجة المدينة هي محطة وصول خط البراق فائق السرعة: الدار البيضاء في ساعتَين و10 دقائق، الرباط في 90 دقيقة. هذا أسرع قطار بين المدن في أفريقيا. يربط ميناء طنجة بطريفة (35 دقيقة) والجزيرة الخضراء (ساعة) في إسبانيا — على بعد 14 كم عبر مضيق جبل طارق. سيصل كثير من المشجعين الأوروبيين بالعبّارة.' },
        { icon: '💡', label: 'نصائح', detail: 'طنجة مدمجة وقابلة للمشي، وإن كانت تلالها شديدة الانحدار. سيارات الأجرة الصغيرة (ذات الخطوط الزرقاء) رخيصة ومتوفّرة بكثرة. المدينة هي نقطة الدخول الطبيعية للمشجعين الذين يجمعون بين رحلة كأس العالم في المغرب والسفر من جنوب إسبانيا.' },
      ],
      fr: [
        { icon: '✈', label: 'Aéroport', detail: "Aéroport Ibn Battouta (TNG) — à 15 km au sud-ouest du centre-ville. Connexions internationales en croissance, notamment vers les hubs des compagnies low-cost européennes. Un taxi vers la ville prend 20 à 25 minutes." },
        { icon: '🚄', label: 'Train & ferry', detail: "La gare de Tanger-Ville est le terminus de la ligne à grande vitesse Al Boraq : Casablanca en 2h10, Rabat en 90 minutes. C'est le train intercités le plus rapide d'Afrique. Le port de Tanger relie Tarifa (35 min) et Algésiras (1h) en Espagne — à 14 km de l'autre côté du détroit de Gibraltar. De nombreux supporters européens arriveront par ferry." },
        { icon: '💡', label: 'Conseils', detail: "Tanger est compacte et marchable, même si les collines sont abruptes. Les petits taxis (rayés bleu) sont bon marché et nombreux. La ville est le point d'entrée naturel pour les supporters qui combinent un voyage Coupe du Monde au Maroc avec un déplacement depuis le sud de l'Espagne." },
      ],
    },
    matchday: {
      en: [
        'Ibn Batouta Stadium is located in the northern suburbs near the airport, approximately 15km from the city centre. Dedicated match-day buses and taxis will be the primary transport. Allow 25-40 minutes depending on traffic.',
        "Pre-match atmosphere will build around the Grand Socco and the waterfront corniche. Tangier's cafe culture — pavement terraces watching the world go by — is the perfect pre-match ritual.",
        'Tangier matches may attract significant numbers of Spanish fans crossing the Strait for the day. Expect a uniquely bicontinental matchday atmosphere.',
      ],
      ar: [
        'يقع ملعب ابن بطوطة في الضواحي الشمالية قرب المطار، على بعد نحو 15 كم من وسط المدينة. ستكون الحافلات المخصصة ليوم المباراة وسيارات الأجرة وسيلة النقل الأساسية. خصّص 25-40 دقيقة حسب الازدحام.',
        'ستتجمّع أجواء ما قبل المباراة حول السوق الكبير وكورنيش الواجهة البحرية. ثقافة مقاهي طنجة — شرفات الرصيف التي تراقب العالم يمرّ — هي الطقس الأمثل قبل المباراة.',
        'قد تجتذب مباريات طنجة أعداداً كبيرة من المشجعين الإسبان الذين يعبرون المضيق ليوم واحد. توقّع أجواء يوم مباراة فريدة من نوعها، بين قارتَين.',
      ],
      fr: [
        "Le stade Ibn Batouta est situé dans la banlieue nord près de l'aéroport, à environ 15 km du centre-ville. Les bus dédiés aux jours de match et les taxis seront le moyen de transport principal. Comptez 25 à 40 minutes selon le trafic.",
        "L'ambiance d'avant-match se construira autour du Grand Socco et de la corniche du front de mer. La culture café de Tanger — terrasses en trottoir regardant le monde passer — est le rituel parfait avant un match.",
        "Les matchs de Tanger pourraient attirer un grand nombre de supporters espagnols traversant le détroit pour la journée. Attendez-vous à une ambiance de jour de match uniquement bicontinentale.",
      ],
    },
    dontMiss: {
      en: [
        { name: 'Caves of Hercules', desc: "Partially natural, partially carved by ancient Berbers quarrying millstones, these sea caves at Cap Spartel open onto the Atlantic through a gap shaped like the map of Africa. Mythologically linked to the labors of Hercules, they are one of Morocco's most evocative natural monuments." },
        { name: 'Cap Spartel', desc: 'The northwestern tip of Africa, where the Atlantic and Mediterranean meet. A lighthouse marks the point. On clear days, the Spanish coast is vividly visible across the 14km strait. The drive through the Diplomatic Forest to reach it is beautiful.' },
        { name: 'Kasbah Museum', desc: "The former Sultan's palace at the summit of the kasbah houses a collection spanning Phoenician and Roman antiquities through Islamic art and traditional crafts. The building itself — with its courtyard, garden, and sweeping views — is as much the attraction as the collection." },
        { name: 'American Legation', desc: 'The oldest American diplomatic property abroad, established in 1821 when Morocco was the first country to recognize American independence. Now a museum of Moroccan-American relations, it houses paintings, historical documents, and Paul Bowles memorabilia in a beautiful riad setting.' },
      ],
      ar: [
        { name: 'مغارات هرقل', desc: 'طبيعية جزئياً ومحفورة جزئياً على يد الأمازيغ القدامى الذين استخرجوا منها أحجار الرحى، تنفتح هذه المغارات البحرية عند رأس سبارطيل على الأطلسي من خلال فتحة تشبه خريطة أفريقيا. ترتبط أسطورياً بأعمال هرقل، وهي من أكثر المعالم الطبيعية المغربية إيحاءً.' },
        { name: 'رأس سبارطيل', desc: 'الطرف الشمالي الغربي لأفريقيا، حيث يلتقي الأطلسي والمتوسط. فنار يحدّد النقطة. في الأيام الصافية، يظهر الساحل الإسباني بوضوح عبر المضيق البالغ 14 كم. القيادة عبر غابة الدبلوماسية للوصول إليه جميلة.' },
        { name: 'متحف القصبة', desc: 'قصر السلطان السابق في قمة القصبة يضمّ مجموعة تمتدّ من الآثار الفينيقية والرومانية إلى الفن الإسلامي والحرف التقليدية. المبنى نفسه — بفنائه وحديقته وإطلالاته الواسعة — جزء من الجاذبية بقدر المجموعة.' },
        { name: 'الإقامة الأمريكية', desc: 'أقدم ممتلك دبلوماسي أمريكي في الخارج، أُسِّس سنة 1821 حين كان المغرب أول بلد يعترف بالاستقلال الأمريكي. وهو اليوم متحف للعلاقات المغربية-الأمريكية، يضمّ لوحات ووثائق تاريخية وتذكارات بول بولز في فضاء رياض جميل.' },
      ],
      fr: [
        { name: "Grottes d'Hercule", desc: "Partiellement naturelles, partiellement creusées par d'anciens Berbères qui y taillaient des meules, ces grottes marines du Cap Spartel s'ouvrent sur l'Atlantique par une faille en forme de carte de l'Afrique. Liées mythologiquement aux travaux d'Hercule, elles comptent parmi les monuments naturels les plus évocateurs du Maroc." },
        { name: 'Cap Spartel', desc: "La pointe nord-ouest de l'Afrique, là où l'Atlantique et la Méditerranée se rencontrent. Un phare marque le point. Par temps clair, la côte espagnole est nettement visible de l'autre côté du détroit de 14 km. La route à travers la Forêt Diplomatique pour y arriver est magnifique." },
        { name: 'Musée de la Kasbah', desc: "L'ancien palais du sultan au sommet de la kasbah abrite une collection allant des antiquités phéniciennes et romaines à l'art islamique et à l'artisanat traditionnel. Le bâtiment lui-même — avec sa cour, son jardin et ses vues imprenables — est autant une attraction que la collection elle-même." },
        { name: 'Légation américaine', desc: "La plus ancienne propriété diplomatique américaine à l'étranger, établie en 1821 lorsque le Maroc fut le premier pays à reconnaître l'indépendance américaine. Aujourd'hui musée des relations maroco-américaines, il abrite des peintures, des documents historiques et des souvenirs de Paul Bowles dans un magnifique cadre de riad." },
      ],
    },
  },

  /* ═══════════════════════════════════════════════════════════════
     5. FES
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: 'fes',
    emoji: '🕌',
    nameEn: 'Fes',
    nameAr: 'فاس',
    kicker: {
      en: 'Cultural Capital · Ancient · Spiritual · Intellectual',
      ar: 'العاصمة الثقافية · عريقة · روحية · فكرية',
      fr: 'Capitale culturelle · Ancienne · Spirituelle · Intellectuelle',
    },
    accent: '#7B5EA7',
    facts: {
      en: [
        { label: 'Stadium', value: 'Grand Stade de Fes' },
        { label: 'Population', value: '1.2 million' },
        { label: 'Region', value: 'Fes-Meknes' },
      ],
      ar: [
        { label: 'الملعب', value: 'ملعب فاس الكبير' },
        { label: 'السكان', value: '1.2 مليون' },
        { label: 'الجهة', value: 'فاس-مكناس' },
      ],
      fr: [
        { label: 'Stade', value: 'Grand Stade de Fès' },
        { label: 'Population', value: '1,2 million' },
        { label: 'Région', value: 'Fès-Meknès' },
      ],
    },
    population: 1_200_000,
    region: 'Fes-Meknes',
    geo: { latitude: 34.0181, longitude: -5.0078 },
    history: {
      en: 'Fes was founded in 789 AD by Idris I, a descendant of the Prophet Muhammad, and expanded into an imperial capital by his son Idris II. The arrival of 8,000 Arab families expelled from Cordoba and 2,000 from Kairouan in the early 9th century transformed Fes into the intellectual and spiritual centre of the western Islamic world. Al-Qarawiyyin, founded in 859 by Fatima al-Fihri, is recognized by UNESCO as the oldest continuously operating university on earth. The Marinid dynasty (13th-15th centuries) built the madrasas, fondouks, and gates that give the medina its present character. Fes el-Bali has survived largely intact for over a millennium, making it the largest and most complete medieval city in the world.',
      ar: 'تأسّست فاس سنة 789 ميلادية على يد إدريس الأول، من سلالة النبي محمد ﷺ، وتوسّعت على يد ابنه إدريس الثاني لتصبح عاصمة إمبراطورية. وصول 8,000 عائلة عربية طُرِدت من قرطبة و2,000 من القيروان في أوائل القرن التاسع حوّل فاس إلى المركز الفكري والروحي للعالم الإسلامي الغربي. جامعة القرويين، التي أسّستها فاطمة الفهرية سنة 859، تعترف اليونسكو بها كأقدم جامعة عاملة باستمرار على وجه الأرض. بَنَت الدولة المرينية (القرن الثالث عشر إلى الخامس عشر) المدارس والفنادق والأبواب التي تعطي المدينة العتيقة طابعها الحالي. نجت فاس البالي سليمة إلى حدّ كبير لأكثر من ألف عام، ما يجعلها أكبر وأكمل مدينة من القرون الوسطى في العالم.',
      fr: "Fès fut fondée en 789 après J.-C. par Idris Ier, descendant du prophète Mahomet, et transformée en capitale impériale par son fils Idris II. L'arrivée de 8 000 familles arabes expulsées de Cordoue et 2 000 de Kairouan au début du IXe siècle a fait de Fès le centre intellectuel et spirituel de l'Occident islamique. Al-Qarawiyyin, fondée en 859 par Fatima al-Fihri, est reconnue par l'UNESCO comme la plus ancienne université en activité continue au monde. La dynastie mérinide (XIIIe-XVe siècles) a bâti les médersas, les fondouks et les portes qui donnent à la médina son caractère actuel. Fès el-Bali a survécu largement intacte pendant plus d'un millénaire, ce qui en fait la plus grande et la plus complète cité médiévale du monde.",
    },
    neighborhoods: {
      en: [
        { name: 'Fes el-Bali (Old Medina)', desc: 'The ancient walled medina, a UNESCO World Heritage Site since 1981. Over 9,000 streets and alleys, 150,000 residents, no cars, and a living medieval infrastructure that has barely changed since the 14th century. Staying inside Fes el-Bali — in one of its hundreds of converted riads — is the most extraordinary urban experience in Morocco. You will get lost. This is part of the arrangement.' },
        { name: 'Fes el-Jdid (New Fes)', desc: "'New' is relative — Fes el-Jdid was built in the 13th century by the Marinids as a royal quarter. The Mellah (historic Jewish quarter), the Royal Palace gates, and the Moulay Abdallah quarter are here. Less labyrinthine than Fes el-Bali but still deeply atmospheric. Good riads at slightly lower prices than the old medina." },
        { name: 'Ville Nouvelle', desc: 'The French-built modern city south of the medina. Avenue Hassan II is the main artery, lined with cafes, restaurants, banks, and hotels. Ville Nouvelle is flat, navigable, and connected to the medina by taxi and local bus. The most practical base for visitors who want easy in-and-out access to the medina without the navigation challenge.' },
        { name: 'Borj Nord & Merenid Hills', desc: 'The hills above the northern walls of Fes el-Bali offer the defining panoramic view of the city — a carpet of minarets, rooftops, and satellite dishes stretching to the horizon. The Merenid Tombs at sunset are the best free experience in Fes. Several hilltop hotels here offer views that make up for the uphill taxi ride.' },
        { name: 'Route de Sefrou', desc: 'The southern approach to Fes has seen new hotel and apartment development in recent years, catering to visitors who want modern amenities and parking. Closer to the new stadium and the airport than the medina. A practical choice for fans prioritizing match-day logistics over atmosphere.' },
      ],
      ar: [
        { name: 'فاس البالي (المدينة العتيقة)', desc: 'المدينة المسوّرة القديمة، موقع تراث عالمي لليونسكو منذ 1981. أكثر من 9,000 زقاق وممر، 150,000 ساكن، لا سيارات، وبنية تحتية من العصور الوسطى حيّة لم تتغيّر كثيراً منذ القرن الرابع عشر. الإقامة داخل فاس البالي — في واحد من مئات رياضاتها المحوّلة — هي التجربة الحضرية الأكثر استثنائية في المغرب. ستضلّ الطريق. هذا جزء من الترتيب.' },
        { name: 'فاس الجديد', desc: 'كلمة «الجديد» هنا نسبية — بُنيت فاس الجديد في القرن الثالث عشر على يد المرينيين كحيّ ملكي. الملاح (الحي اليهودي التاريخي)، وأبواب القصر الملكي، وحي مولاي عبد الله جميعها هنا. أقلّ متاهيةً من فاس البالي لكنها لا تزال عبقة بعمق. رياضات جيدة بأسعار أقلّ قليلاً من المدينة العتيقة.' },
        { name: 'المدينة الجديدة', desc: 'المدينة الحديثة التي بناها الفرنسيون جنوب المدينة العتيقة. شارع الحسن الثاني هو الشريان الرئيسي، تصطف على طوله المقاهي والمطاعم والبنوك والفنادق. المدينة الجديدة مسطّحة وقابلة للتنقل ومتصلة بالمدينة العتيقة بسيارة الأجرة والحافلات المحلية. القاعدة الأكثر عملية للزوار الذين يريدون دخولاً وخروجاً سهلَين إلى المدينة العتيقة دون تحدّي التنقل.' },
        { name: 'برج نرد وتلال المرينيين', desc: 'التلال فوق الأسوار الشمالية لفاس البالي تقدّم المنظر البانورامي الأبرز للمدينة — بساط من المآذن والأسطح وأطباق الأقمار الصناعية يمتدّ إلى الأفق. قبور المرينيين عند الغروب هي أفضل تجربة مجانية في فاس. عدّة فنادق على قمة التلال هنا تقدّم إطلالات تعوّض ركوب سيارة الأجرة صعوداً.' },
        { name: 'طريق صفرو', desc: 'المدخل الجنوبي لفاس شهد تطوّراً جديداً للفنادق والشقق في السنوات الأخيرة، يخدم الزوار الذين يريدون المرافق الحديثة ومواقف السيارات. أقرب إلى الملعب الجديد والمطار من المدينة العتيقة. خيار عملي للمشجعين الذين يعطون الأولوية للجوانب اللوجستية ليوم المباراة على الأجواء.' },
      ],
      fr: [
        { name: 'Fès el-Bali (Vieille médina)', desc: "L'ancienne médina fortifiée, site du patrimoine mondial de l'UNESCO depuis 1981. Plus de 9 000 rues et ruelles, 150 000 habitants, pas de voitures, et une infrastructure médiévale vivante qui a à peine changé depuis le XIVe siècle. Séjourner dans Fès el-Bali — dans l'un de ses centaines de riads restaurés — est l'expérience urbaine la plus extraordinaire du Maroc. Vous vous perdrez. Cela fait partie de l'arrangement." },
        { name: 'Fès el-Jdid (Nouvelle Fès)', desc: "« Nouvelle » est relatif — Fès el-Jdid a été construite au XIIIe siècle par les Mérinides comme quartier royal. Le Mellah (ancien quartier juif), les portes du Palais royal et le quartier Moulay Abdallah s'y trouvent. Moins labyrinthique que Fès el-Bali, mais toujours profondément atmosphérique. De bons riads à des prix légèrement inférieurs à ceux de la vieille médina." },
        { name: 'Ville Nouvelle', desc: "La ville moderne construite par les Français au sud de la médina. L'avenue Hassan II est l'artère principale, bordée de cafés, restaurants, banques et hôtels. Ville Nouvelle est plate, navigable et reliée à la médina par taxi et bus local. La base la plus pratique pour les visiteurs qui veulent un accès entrée-sortie facile à la médina sans le défi de la navigation." },
        { name: 'Borj Nord & collines mérinides', desc: "Les collines au-dessus des remparts nord de Fès el-Bali offrent la vue panoramique emblématique de la ville — un tapis de minarets, de toits et d'antennes paraboliques s'étendant jusqu'à l'horizon. Les tombeaux mérinides au coucher du soleil constituent la meilleure expérience gratuite à Fès. Plusieurs hôtels de colline y offrent des vues qui compensent le taxi en montée." },
        { name: 'Route de Sefrou', desc: "L'accès sud à Fès a vu de nouveaux développements hôteliers et d'appartements ces dernières années, destinés aux visiteurs qui veulent des équipements modernes et un parking. Plus proche du nouveau stade et de l'aéroport que de la médina. Un choix pratique pour les supporters qui privilégient la logistique jour de match à l'atmosphère." },
      ],
    },
    restaurants: {
      en: [
        { name: 'Cafe Clock — Cultural Cafe', desc: "A multi-level cafe in the heart of the medina, famous for its camel burger and its role as a cultural hub hosting live music, storytelling, and language exchanges. The rooftop terrace has medina views. Cafe Clock is where Fes's traditional and contemporary sides meet. 80-150 MAD." },
        { name: 'Riad Fes — Fine Dining', desc: 'The restaurant at Riad Fes is widely regarded as one of the finest in the city. Refined Moroccan cuisine — pigeon pastilla, slow-cooked lamb, saffron-scented couscous — served in an exquisitely restored riad. The Andalusian bar is excellent for pre-dinner drinks. Reserve ahead. 300-500 MAD.' },
        { name: "Thami's — Local Favorite", desc: 'A no-frills neighborhood restaurant beloved by Fassis (Fes locals) for its generous portions of traditional home-style cooking. Harira, grilled kefta, and tajine served fast, fresh, and cheap. Finding it is part of the adventure. 40-80 MAD.' },
        { name: 'Tannery Rooftop Cafes', desc: 'The leather shops overlooking the Chouara Tannery have rooftop terraces where you can sip mint tea while watching the tanners work the dyeing pits below. The view is extraordinary — circles of colored dye against the ancient city fabric. The tea is secondary to the spectacle. 30-50 MAD.' },
        { name: 'Ruined Garden — Medina Courtyard', desc: 'Set in a partially ruined riad garden in the medina, this restaurant serves modern Mediterranean-Moroccan small plates amid crumbling walls and climbing plants. The atmosphere is unique — beautiful decay meeting excellent cooking. Popular with visiting food writers. 120-200 MAD.' },
      ],
      ar: [
        { name: 'كافي كلوك — مقهى ثقافي', desc: 'مقهى متعدّد الطوابق في قلب المدينة العتيقة، اشتهر بـ«برغر الجمل» وبدوره كمركز ثقافي يستضيف الموسيقى الحيّة ورواية القصص وتبادل اللغات. شرفة السطح تطلّ على المدينة العتيقة. «كافي كلوك» هو حيث يلتقي وجها فاس التقليدي والمعاصر. 80-150 درهماً.' },
        { name: 'رياض فاس — عشاء راقٍ', desc: 'مطعم «رياض فاس» يُعدّ على نطاق واسع من أرقى مطاعم المدينة. مطبخ مغربي راقٍ — بسطيلة الحمام، لحم الضأن المطبوخ ببطء، كسكس بعبق الزعفران — يُقدَّم في رياض مُرمَّم ببراعة. البار الأندلسي ممتاز لاحتساء المشروبات قبل العشاء. احجز مسبقاً. 300-500 درهم.' },
        { name: 'ثامي — المطعم المحبّب محلياً', desc: 'مطعم حيّ بلا تكلّف يحبّه الفاسيون لحصصه الكريمة من الطبخ البيتي التقليدي. الحريرة، كفتة مشوية، وطاجين يُقدَّم بسرعة وطزاجة ورخص. العثور عليه جزء من المغامرة. 40-80 درهماً.' },
        { name: 'مقاهي سطح دار الدبّاغة', desc: 'محلات الجلد المطلّة على دار دبّاغة الشوارة لديها شرفات سطح يمكنك فيها احتساء أتاي النعناع بينما تشاهد الدبّاغين يعملون في أحواض الصباغة في الأسفل. المنظر استثنائي — دوائر من الصبغ الملوّن مقابل نسيج المدينة القديمة. الشاي ثانوي مقارنة بالمشهد. 30-50 درهماً.' },
        { name: 'الحديقة المتهالكة — فناء المدينة العتيقة', desc: 'في حديقة رياض مُتهالكة جزئياً في المدينة العتيقة، يقدّم هذا المطعم أطباقاً صغيرة متوسطية-مغربية حديثة وسط جدران متداعية ونباتات متسلّقة. الأجواء فريدة — تهالك جميل يلتقي بطبخ ممتاز. محبّب عند كتّاب الطعام الزائرين. 120-200 درهم.' },
      ],
      fr: [
        { name: 'Café Clock — Café culturel', desc: "Un café sur plusieurs niveaux au cœur de la médina, célèbre pour son burger de chameau et son rôle de pôle culturel accueillant concerts, contes et échanges linguistiques. La terrasse rooftop offre des vues sur la médina. Café Clock est là où les facettes traditionnelle et contemporaine de Fès se rencontrent. 80-150 MAD." },
        { name: 'Riad Fès — Gastronomie', desc: "Le restaurant du Riad Fès est largement considéré comme l'un des meilleurs de la ville. Cuisine marocaine raffinée — pastilla au pigeon, agneau mijoté, couscous au safran — servie dans un riad superbement restauré. Le bar andalou est excellent pour les apéritifs. Réservez à l'avance. 300-500 MAD." },
        { name: "Chez Thami — Favori local", desc: "Un restaurant de quartier sans chichis adoré des Fassis (habitants de Fès) pour ses portions généreuses de cuisine familiale traditionnelle. Harira, kefta grillée et tajine servis rapidement, frais et bon marché. Le trouver fait partie de l'aventure. 40-80 MAD." },
        { name: 'Cafés-terrasses des tanneries', desc: "Les boutiques de cuir surplombant la tannerie Chouara ont des terrasses rooftop où vous pouvez siroter un thé à la menthe tout en regardant les tanneurs travailler les cuves de teinture en contrebas. La vue est extraordinaire — cercles de teinture colorée contre le tissu de la ville ancienne. Le thé est secondaire par rapport au spectacle. 30-50 MAD." },
        { name: 'Ruined Garden — Cour de la médina', desc: "Installé dans un jardin de riad partiellement en ruine au sein de la médina, ce restaurant sert de petites assiettes méditerranéennes-marocaines modernes parmi des murs effrités et des plantes grimpantes. L'atmosphère est unique — une belle décadence rencontrant une cuisine excellente. Apprécié des critiques gastronomiques en visite. 120-200 MAD." },
      ],
    },
    accommodation: {
      en: [
        { tier: 'Budget', range: '$30–60 / night', desc: "Fes el-Bali has dozens of small, family-run riads and guesthouses at budget prices. Dar Seffarine (overlooking the coppersmiths' square) and Funky Fes hostel are standout picks. Budget riads in Fes often punch well above their price — expect rooftop terraces, courtyard breakfasts, and genuine hospitality." },
        { tier: 'Mid-Range', range: '$80–150 / night', desc: "The medina's best-value tier. Beautifully restored merchant-house riads with plunge pools, traditional hammams, and rooftop dining. Riad Laaroussa, Dar Roumana, and Riad Maison Bleue all offer boutique luxury at mid-range prices. This is where Fes accommodation excels — the riad experience here is unmatched in Morocco." },
        { tier: 'Luxury', range: '$200+ / night', desc: "Riad Fes, Palais Faraj (perched on the northern ramparts with panoramic views), and Hotel Sahrai (a modernist hilltop hotel with an infinity pool overlooking the medina) lead the luxury category. Fes's luxury options are smaller and more intimate than Marrakech's — fewer rooms, more personal attention." },
      ],
      ar: [
        { tier: 'اقتصادي', range: '30-60 دولاراً / الليلة', desc: 'فاس البالي تضمّ عشرات الرياضات الصغيرة التي تديرها العائلات ودور الضيافة بأسعار اقتصادية. «دار الصفّارين» (المطلّ على ساحة النحّاسين) ونزل «فانكي فاس» خياران لافتان. غالباً ما تعطي الرياضات الاقتصادية في فاس قيمة تفوق سعرها — توقّع شرفات سطح وفطور في الفناء وضيافة حقيقية.' },
        { tier: 'متوسط', range: '80-150 دولاراً / الليلة', desc: 'الفئة الأفضل قيمةً في المدينة العتيقة. رياضات منازل تجّار مُرمَّمة بجمال مع أحواض سباحة صغيرة وحمّامات تقليدية وعشاء على السطح. «رياض العروسة» و«دار رمانة» و«رياض ميزون بلو» كلها تقدّم فخامة بوتيكية بأسعار متوسطة. هنا تتفوّق إقامة فاس — تجربة الرياض هنا لا مثيل لها في المغرب.' },
        { tier: 'فاخر', range: '200+ دولاراً / الليلة', desc: '«رياض فاس»، «قصر فرج» (المطلّ من على الأسوار الشمالية بإطلالات بانورامية)، وفندق «صحراي» (فندق حداثي على قمّة تلة بمسبح لانهائي يطلّ على المدينة العتيقة) تتصدّر فئة الفخامة. خيارات فاس الفاخرة أصغر وأكثر حميمية من مراكش — غرف أقل، اهتمام شخصي أكثر.' },
      ],
      fr: [
        { tier: 'Budget', range: '30-60 $ / nuit', desc: "Fès el-Bali compte des dizaines de petits riads familiaux et de maisons d'hôtes à prix budget. Dar Seffarine (surplombant la place des dinandiers) et l'auberge Funky Fes sont des choix remarquables. Les riads économiques de Fès offrent souvent bien plus que leur prix — attendez-vous à des terrasses rooftop, des petits-déjeuners en patio et une véritable hospitalité." },
        { tier: 'Milieu de gamme', range: '80-150 $ / nuit', desc: "Le meilleur rapport qualité-prix de la médina. De magnifiques riads de maison de marchand restaurés avec bassins, hammams traditionnels et restauration sur le toit. Riad Laaroussa, Dar Roumana et Riad Maison Bleue offrent tous un luxe boutique à des prix de gamme moyenne. C'est là que l'hébergement de Fès excelle — l'expérience du riad ici est inégalée au Maroc." },
        { tier: 'Luxe', range: '200+ $ / nuit', desc: "Riad Fès, le Palais Faraj (perché sur les remparts nord avec vues panoramiques) et l'Hôtel Sahrai (un hôtel moderniste au sommet d'une colline avec piscine à débordement surplombant la médina) dominent la catégorie luxe. Les options luxe de Fès sont plus petites et plus intimes que celles de Marrakech — moins de chambres, plus d'attention personnelle." },
      ],
    },
    gettingThere: {
      en: [
        { icon: '✈', label: 'Airport', detail: 'Fes-Saiss Airport (FEZ) — 15km south of the city centre. Direct flights to major European cities including Paris, London, Barcelona, and several Ryanair and easyJet hubs. A taxi to the medina takes 20-25 minutes.' },
        { icon: '🚄', label: 'Train', detail: 'Fes railway station connects to Casablanca (3.5h), Rabat (3h), Meknes (45min), and Tangier (4.5h via conventional rail). The planned high-speed rail extension to Fes will eventually cut these times significantly. For now, the conventional train is comfortable and scenic.' },
        { icon: '💡', label: 'Tips', detail: 'Taxis cannot enter the medina. You will walk the final stretch to any riad inside the walls. Many riads send a porter to meet you at the nearest gate (Bab Boujloud, Bab Rcif, or Bab Guissa). GPS is unreliable inside the medina. Accept guidance and tip generously.' },
      ],
      ar: [
        { icon: '✈', label: 'المطار', detail: 'مطار فاس-سايس (FEZ) — على بعد 15 كم جنوب وسط المدينة. رحلات مباشرة إلى كبرى المدن الأوروبية بما فيها باريس ولندن وبرشلونة وعدّة محاور لـ Ryanair وeasyJet. سيارة أجرة إلى المدينة العتيقة تستغرق 20-25 دقيقة.' },
        { icon: '🚄', label: 'القطار', detail: 'محطة قطار فاس تربط بالدار البيضاء (3.5 ساعات)، الرباط (3 ساعات)، مكناس (45 دقيقة)، وطنجة (4.5 ساعات عبر السكة التقليدية). امتداد البراق فائق السرعة المخطّط لفاس سيُقلّص هذه الأوقات بشكل كبير في النهاية. في الوقت الحالي، القطار التقليدي مريح وجميل المناظر.' },
        { icon: '💡', label: 'نصائح', detail: 'لا يمكن لسيارات الأجرة أن تدخل المدينة العتيقة. ستسير المسافة الأخيرة إلى أي رياض داخل الأسوار. ترسل كثير من الرياضات حمّالاً لاستقبالك عند أقرب باب (باب بوجلود، أو باب الرصيف، أو باب قيسة). ال«جي بي إس» غير موثوق داخل المدينة العتيقة. اقبل الإرشاد وأكرم الإكرامية.' },
      ],
      fr: [
        { icon: '✈', label: 'Aéroport', detail: "Aéroport Fès-Saïss (FEZ) — à 15 km au sud du centre-ville. Vols directs vers les grandes villes européennes, dont Paris, Londres, Barcelone et plusieurs hubs Ryanair et easyJet. Un taxi vers la médina prend 20 à 25 minutes." },
        { icon: '🚄', label: 'Train', detail: "La gare de Fès relie Casablanca (3h30), Rabat (3h), Meknès (45 min) et Tanger (4h30 en train conventionnel). L'extension à grande vitesse prévue jusqu'à Fès réduira considérablement ces temps. Pour l'instant, le train conventionnel est confortable et pittoresque." },
        { icon: '💡', label: 'Conseils', detail: "Les taxis ne peuvent pas entrer dans la médina. Vous marcherez la dernière portion jusqu'à n'importe quel riad intra-muros. De nombreux riads envoient un porteur vous attendre à la porte la plus proche (Bab Boujloud, Bab Rcif ou Bab Guissa). Le GPS est peu fiable dans la médina. Acceptez d'être guidé et donnez un bon pourboire." },
      ],
    },
    matchday: {
      en: [
        'Grand Stade de Fes is on the southern outskirts of the city, approximately 10km from the medina. Match-day shuttles will run from the Ville Nouvelle and key collection points near the medina gates. Allow 20-35 minutes by taxi or bus.',
        "Pre-match gathering will center on Bab Boujloud (the famous Blue Gate) and the Place R'cif area. The narrow streets of the medina will channel fans toward the gates in a way that creates natural atmosphere — expect drums, chanting, and an intensity that medieval walls were built to amplify.",
        'Fes demands more time than other host cities. The medina cannot be rushed. Arrive at least 48 hours before your match to give the city the time it requires and deserves.',
      ],
      ar: [
        'يقع ملعب فاس الكبير في الضواحي الجنوبية للمدينة، على بعد نحو 10 كم من المدينة العتيقة. ستنطلق حافلات نقل يوم المباراة من المدينة الجديدة ونقاط تجمّع رئيسية قرب أبواب المدينة العتيقة. خصّص 20-35 دقيقة بسيارة الأجرة أو الحافلة.',
        'سيتركّز تجمّع ما قبل المباراة على باب بوجلود (الباب الأزرق الشهير) ومنطقة ساحة الرصيف. ستحشد أزقة المدينة العتيقة الضيّقة المشجعين نحو الأبواب بطريقة تخلق أجواءً طبيعية — توقّع الطبول والهتافات وشدّة بُنيت الأسوار القروسطية لتضخيمها.',
        'فاس تطلب وقتاً أكثر من المدن المضيفة الأخرى. لا يمكن الإسراع في المدينة العتيقة. احضر قبل مباراتك بـ 48 ساعة على الأقل لتعطي المدينة الوقت الذي تطلبه وتستحقّه.',
      ],
      fr: [
        "Le Grand Stade de Fès se trouve dans la périphérie sud de la ville, à environ 10 km de la médina. Les navettes jour de match partiront de Ville Nouvelle et de points de rassemblement clés près des portes de la médina. Comptez 20 à 35 minutes en taxi ou en bus.",
        "Le rassemblement d'avant-match se concentrera autour de Bab Boujloud (la fameuse Porte Bleue) et de la place R'cif. Les rues étroites de la médina canaliseront les supporters vers les portes d'une manière qui crée une ambiance naturelle — attendez-vous à des tambours, des chants et une intensité que les murs médiévaux ont été conçus pour amplifier.",
        "Fès exige plus de temps que les autres villes hôtes. La médina ne se presse pas. Arrivez au moins 48 heures avant votre match pour donner à la ville le temps qu'elle demande et mérite.",
      ],
    },
    dontMiss: {
      en: [
        { name: 'Fes el-Bali Medina', desc: 'The largest car-free urban area in the world. Over 9,000 lanes and alleys, 365 mosques, 25 hammams, and a complete medieval commercial infrastructure that has barely changed since the 14th century. Allow at least two full days. Getting lost is mandatory. Finding your way out is the reward.' },
        { name: 'Al-Qarawiyyin University', desc: 'Founded in 859 AD by Fatima al-Fihri, recognized as the oldest continuously operating university in the world. The mosque and library complex — recently restored with breathtaking results — are among the most important intellectual monuments in the Islamic world. Non-Muslim access is limited but the exterior and courtyard glimpses are profound.' },
        { name: 'Chouara Tannery', desc: 'The oldest tannery in the world, visible from the terraces of surrounding leather shops. Circular stone dyeing pits in vivid colors of saffron, indigo, poppy, and mint have been in continuous operation since the 11th century. The smell is powerful. The sight is unforgettable. Go in the morning for the best light.' },
        { name: 'Merenid Tombs at Sunset', desc: 'Climb to the ruined Marinid tombs on the hillside above Fes el-Bali for the defining view of the city. As the sun drops and the call to prayer echoes from hundreds of minarets below, the panorama of medieval Fes spread across the valley is one of the great visual experiences in North Africa. Free, unmissable, and best at golden hour.' },
      ],
      ar: [
        { name: 'مدينة فاس البالي العتيقة', desc: 'أكبر منطقة حضرية خالية من السيارات في العالم. أكثر من 9,000 زقاق وممرّ، و365 مسجداً، و25 حمّاماً، وبنية تحتية تجارية من القرون الوسطى كاملة لم تتغيّر كثيراً منذ القرن الرابع عشر. خصّص يومَين كاملَين على الأقلّ. الضياع إلزامي. إيجاد طريق الخروج هو المكافأة.' },
        { name: 'جامعة القرويين', desc: 'تأسّست سنة 859 ميلادية على يد فاطمة الفهرية، ويُعترف بها كأقدم جامعة عاملة باستمرار في العالم. مجمع المسجد والمكتبة — الذي رُمّم حديثاً بنتائج مبهرة — من أهم المعالم الفكرية في العالم الإسلامي. وصول غير المسلمين محدود، لكن إطلالات الخارج والفناء مؤثّرة جداً.' },
        { name: 'دبّاغة الشوارة', desc: 'أقدم دبّاغة في العالم، مرئية من شرفات محلات الجلد المحيطة. أحواض الصباغة الحجرية الدائرية بألوان زاهية من الزعفران والنيلي والخشخاش والنعناع تعمل بلا انقطاع منذ القرن الحادي عشر. الرائحة قوية. المشهد لا يُنسى. اذهب صباحاً للحصول على أفضل ضوء.' },
        { name: 'قبور المرينيين عند الغروب', desc: 'اصعد إلى قبور المرينيين المتهدّمة على سفح التلة فوق فاس البالي من أجل المنظر الأكثر تعريفاً للمدينة. حين تغرب الشمس ويتردّد الأذان من مئات المآذن في الأسفل، بانوراما فاس القروسطية المنبسطة عبر الوادي تكون واحدة من أعظم التجارب البصرية في شمال أفريقيا. مجاني، لا يُفوَّت، وأفضل في ساعة الذهب.' },
      ],
      fr: [
        { name: 'Médina de Fès el-Bali', desc: "La plus grande zone urbaine sans voitures au monde. Plus de 9 000 ruelles et impasses, 365 mosquées, 25 hammams et une infrastructure commerciale médiévale complète qui a à peine changé depuis le XIVe siècle. Comptez au moins deux journées complètes. Se perdre est obligatoire. Trouver son chemin est la récompense." },
        { name: 'Université al-Qarawiyyin', desc: "Fondée en 859 après J.-C. par Fatima al-Fihri, reconnue comme la plus ancienne université en activité continue au monde. Le complexe mosquée-bibliothèque — récemment restauré avec des résultats à couper le souffle — figure parmi les plus importants monuments intellectuels du monde islamique. L'accès pour les non-musulmans est limité, mais les aperçus de l'extérieur et du patio sont profonds." },
        { name: 'Tannerie Chouara', desc: "La plus ancienne tannerie au monde, visible depuis les terrasses des boutiques de cuir environnantes. Des cuves de teinture en pierre circulaires aux couleurs vives de safran, indigo, coquelicot et menthe fonctionnent en continu depuis le XIe siècle. L'odeur est puissante. Le spectacle est inoubliable. Allez-y le matin pour la meilleure lumière." },
        { name: 'Tombeaux mérinides au coucher du soleil', desc: "Montez jusqu'aux tombeaux mérinides en ruine sur la colline au-dessus de Fès el-Bali pour la vue définitive de la ville. Lorsque le soleil descend et que l'appel à la prière résonne depuis des centaines de minarets en contrebas, le panorama de la Fès médiévale étalée dans la vallée est l'une des grandes expériences visuelles d'Afrique du Nord. Gratuit, incontournable, et meilleur à l'heure dorée." },
      ],
    },
  },

  /* ═══════════════════════════════════════════════════════════════
     6. AGADIR
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: 'agadir',
    emoji: '🌊',
    nameEn: 'Agadir',
    nameAr: 'أكادير',
    kicker: {
      en: 'Beach Resort · Modern · Atlantic Riviera · Rebuilt',
      ar: 'منتجع شاطئي · حديثة · الريفييرا الأطلسية · أُعيد بناؤها',
      fr: 'Station balnéaire · Moderne · Riviera atlantique · Reconstruite',
    },
    accent: '#0E8A9E',
    facts: {
      en: [
        { label: 'Stadium', value: 'Adrar Stadium' },
        { label: 'Population', value: '600,000' },
        { label: 'Region', value: 'Souss-Massa' },
      ],
      ar: [
        { label: 'الملعب', value: 'ملعب أدرار' },
        { label: 'السكان', value: '600,000' },
        { label: 'الجهة', value: 'سوس-ماسة' },
      ],
      fr: [
        { label: 'Stade', value: 'Stade Adrar' },
        { label: 'Population', value: '600 000' },
        { label: 'Région', value: 'Souss-Massa' },
      ],
    },
    population: 600_000,
    region: 'Souss-Massa',
    geo: { latitude: 30.4278, longitude: -9.5981 },
    history: {
      en: "Agadir's history is defined by a single catastrophic event: the earthquake of February 29, 1960, which destroyed the entire city in fifteen seconds and killed roughly a third of its population. The old Agadir — a Berber settlement with a 16th-century Portuguese kasbah — was levelled almost completely. What stands today was built from scratch in the 1960s and 1970s, designed by modern architects as a planned resort city with wide boulevards, earthquake-resistant construction, and a focus on tourism. This makes Agadir unique among the host cities: it has no medina, no medieval fabric, no layered history visible in its streets. What it has instead is ten kilometers of Atlantic beach, year-round sunshine, and a modern, relaxed character that serves as a welcome counterpoint to the intensity of Fes, Marrakech, and Tangier.",
      ar: "تاريخ أكادير يُحدّده حدث واحد كارثي: زلزال 29 فبراير 1960 الذي دمّر المدينة بأكملها في خمس عشرة ثانية وقتل ما يقرب من ثلث سكانها. أكادير القديمة — مستوطنة أمازيغية بها قصبة برتغالية من القرن السادس عشر — سُوِّيت بالأرض تقريباً بالكامل. ما يقف اليوم بُني من الصفر في الستينيات والسبعينيات، صمّمه معماريون حداثيون كمدينة منتجع مخطّطة بشوارع واسعة وبناء مقاوم للزلازل وتركيز على السياحة. هذا يجعل أكادير فريدة بين المدن المضيفة: لا مدينة عتيقة فيها، لا نسيج قروسطي، لا تاريخ متراكم يظهر في شوارعها. ما تملكه بدلاً من ذلك هو عشرة كيلومترات من الشاطئ الأطلسي، وشمس على مدار السنة، وطابع حديث ومُسترخٍ يُشكّل نقيضاً مرحّباً به لشدّة فاس ومراكش وطنجة.",
      fr: "L'histoire d'Agadir est définie par un seul événement catastrophique : le tremblement de terre du 29 février 1960, qui a détruit la ville entière en quinze secondes et tué environ un tiers de sa population. L'ancienne Agadir — une colonie berbère avec une kasbah portugaise du XVIe siècle — fut presque entièrement rasée. Ce qui s'élève aujourd'hui a été construit de zéro dans les années 1960 et 1970, conçu par des architectes modernes comme une station balnéaire planifiée, avec de larges boulevards, une construction antisismique et un accent mis sur le tourisme. Cela rend Agadir unique parmi les villes hôtes : elle n'a pas de médina, pas de tissu médiéval, pas d'histoire en couches visible dans ses rues. Ce qu'elle a en revanche, c'est dix kilomètres de plage atlantique, du soleil toute l'année, et un caractère moderne et détendu qui constitue un contrepoint bienvenu à l'intensité de Fès, Marrakech et Tanger.",
    },
    neighborhoods: {
      en: [
        { name: 'Marina', desc: "Agadir's modern marina development, completed in recent years, is the city's showcase district. Yacht berths, waterfront restaurants, fish vendors, and a pedestrian promenade give it a Mediterranean-resort feel. The freshly grilled seafood here — sardines, sea bream, red mullet — is the best meal for the money in Morocco. The most enjoyable base for World Cup visitors." },
        { name: 'Talborjt (City Centre)', desc: 'The administrative and commercial heart of post-earthquake Agadir. Practical rather than pretty, but well-stocked with restaurants, cafes, shops, and mid-range hotels. Avenue Hassan II and Avenue du 29 Fevrier (named for the earthquake date) are the main arteries. Good transport connections and easy walking distance to the beach.' },
        { name: 'Beach Promenade (Corniche)', desc: "The long, wide seafront promenade running the length of Agadir's main beach is where the city's social life happens. Hotels, restaurants, and cafes line the inland side; the sand and Atlantic stretch to the horizon on the other. Walking, cycling, or just sitting here with a coffee is the essential Agadir experience." },
        { name: 'Taghazout', desc: "A former fishing village turned world-class surfing destination, 20km north of Agadir on the coastal road. Surf schools, yoga retreats, and bohemian cafes have transformed Taghazout into one of Morocco's most appealing small-town experiences. Excellent for World Cup visitors who want a base with character and daily waves, with Agadir's stadium a 25-minute drive away." },
        { name: 'Secteur Touristique', desc: 'The hotel zone stretching along the beach south of the city centre. Large resort hotels, all-inclusive complexes, and apartment rentals dominate. This is package-holiday Agadir — familiar, comfortable, and directly on the sand. The most available accommodation for the tournament.' },
      ],
      ar: [
        { name: 'المارينا', desc: 'تطوير مارينا أكادير الحديث، الذي اكتمل في السنوات الأخيرة، هو حيّ الواجهة للمدينة. مراسي اليخوت والمطاعم على الواجهة البحرية وباعة السمك وممشى المشاة تمنحه إحساس منتجع متوسطي. المأكولات البحرية المشوية طازجة هنا — السردين والدنيس والسلطان إبراهيم — هي أفضل وجبة مقابل المال في المغرب. القاعدة الأكثر متعة لزوار كأس العالم.' },
        { name: 'تالبرجت (وسط المدينة)', desc: 'القلب الإداري والتجاري لأكادير ما بعد الزلزال. عملية أكثر من كونها جميلة، لكنها مزوّدة جيداً بالمطاعم والمقاهي والمحلات والفنادق متوسطة الفئة. شارع الحسن الثاني وشارع 29 فبراير (المسمّى نسبة إلى تاريخ الزلزال) هما الشريانان الرئيسيان. اتصالات نقل جيدة ومسافة مشي قصيرة إلى الشاطئ.' },
        { name: 'كورنيش الشاطئ', desc: 'الممشى البحري الطويل العريض الذي يمتدّ على طول شاطئ أكادير الرئيسي هو حيث تجري الحياة الاجتماعية للمدينة. الفنادق والمطاعم والمقاهي تصطفّ على الجانب الداخلي؛ الرمل والأطلسي يمتدّان إلى الأفق من الجانب الآخر. المشي أو ركوب الدرّاجة أو مجرد الجلوس هنا مع فنجان قهوة هو التجربة الأكاديرية الجوهرية.' },
        { name: 'تغازوت', desc: 'قرية صيد سابقة تحوّلت إلى وجهة سياحية لركوب الأمواج عالمية المستوى، على بعد 20 كم شمال أكادير على الطريق الساحلي. حوّلت مدارس ركوب الأمواج وملاذات اليوغا والمقاهي البوهيمية تغازوت إلى إحدى أكثر التجارب الجذابة في مدينة صغيرة في المغرب. ممتازة لزوار كأس العالم الذين يريدون قاعدة ذات طابع وأمواجاً يومية، مع ملعب أكادير على بُعد 25 دقيقة بالسيارة.' },
        { name: 'القطاع السياحي', desc: 'منطقة الفنادق الممتدّة على طول الشاطئ جنوب وسط المدينة. الفنادق الكبيرة للمنتجعات، والمجمّعات الشاملة، والشقق السكنية المؤجّرة تهيمن. هذه أكادير العطلات الباقات — مألوفة ومريحة ومباشرة على الرمل. الإقامة الأكثر توفّراً للبطولة.' },
      ],
      fr: [
        { name: 'Marina', desc: "Le développement moderne de la marina d'Agadir, achevé ces dernières années, est le quartier vitrine de la ville. Postes de yachts, restaurants en bord de mer, marchands de poisson et promenade piétonne lui donnent un air de station méditerranéenne. Les fruits de mer grillés à la minute ici — sardines, daurades, rougets — constituent le meilleur repas au rapport qualité-prix du Maroc. La base la plus agréable pour les visiteurs de la Coupe du Monde." },
        { name: 'Talborjt (Centre-ville)', desc: "Le cœur administratif et commercial de l'Agadir post-séisme. Plus pratique que jolie, mais bien pourvue en restaurants, cafés, boutiques et hôtels de gamme moyenne. L'avenue Hassan II et l'avenue du 29 Février (nommée d'après la date du tremblement de terre) sont les artères principales. Bonnes connexions de transport et distance de marche facile jusqu'à la plage." },
        { name: 'Promenade de la plage (Corniche)', desc: "La longue et large promenade maritime qui longe la plage principale d'Agadir est là où se déroule la vie sociale de la ville. Hôtels, restaurants et cafés bordent le côté intérieur ; le sable et l'Atlantique s'étendent à l'horizon de l'autre côté. Marcher, faire du vélo ou simplement s'asseoir ici avec un café est l'expérience agadiroise essentielle." },
        { name: 'Taghazout', desc: "Un ancien village de pêcheurs devenu destination de surf de classe mondiale, à 20 km au nord d'Agadir sur la route côtière. Écoles de surf, retraites de yoga et cafés bohèmes ont transformé Taghazout en l'une des expériences de petite ville les plus attrayantes du Maroc. Excellent pour les visiteurs de la Coupe du Monde qui veulent une base avec du caractère et des vagues quotidiennes, le stade d'Agadir étant à 25 minutes en voiture." },
        { name: 'Secteur touristique', desc: "La zone hôtelière qui longe la plage au sud du centre-ville. Grands hôtels-resorts, complexes all-inclusive et locations d'appartements dominent. C'est l'Agadir des vacances tout compris — familière, confortable et directement sur le sable. L'hébergement le plus disponible pour le tournoi." },
      ],
    },
    restaurants: {
      en: [
        { name: 'Pure Passion — Upscale Seafood', desc: "Agadir's standout restaurant, serving beautifully presented seafood and Mediterranean-Moroccan fusion in a stylish marina-adjacent setting. The fish is impeccable, the wine list (unusual for Morocco) is well-curated, and the service is polished. The closest thing to fine dining in the city. 200-350 MAD." },
        { name: 'Port Fish Market Grill — Street Food', desc: "The working fishing port south of the marina has a row of simple grill stalls where the morning's catch is cooked over charcoal to order. Choose your fish from the display, pay by weight, and eat at communal tables overlooking the boats. This is the freshest seafood you will eat in Morocco, and the cheapest. 50-100 MAD." },
        { name: 'Taghazout Cafes — Surf Culture', desc: "The cafes lining Taghazout's main street serve a mix of Moroccan staples and international surf-culture food — smoothie bowls, avocado toast, tagine, fresh juice. The vibe is laid-back, the views are Atlantic, and the prices are lower than Agadir proper. 60-120 MAD." },
        { name: 'Le Tapis Rouge — Moroccan Traditional', desc: "One of the few restaurants in Agadir serving traditional Moroccan cuisine with real ambition. Tajines, couscous, and pastilla prepared with care and presented with style. A reminder that Agadir's modernity has not erased its culinary heritage. 120-200 MAD." },
        { name: 'Jour et Nuit — All-Day Cafe', desc: 'A popular local cafe-restaurant in Talborjt serving Moroccan breakfasts, fresh-squeezed juices, grilled meats, and pastries from morning until late. The terrace is a good people-watching spot. A reliable, affordable daily staple. 40-80 MAD.' },
      ],
      ar: [
        { name: 'بيور باسيون — مأكولات بحرية راقية', desc: 'المطعم البارز في أكادير، يقدّم مأكولات بحرية معروضة بجمال ومزيجاً متوسطياً-مغربياً في فضاء أنيق بجوار المارينا. السمك مُتقَن، قائمة النبيذ (غير معتادة في المغرب) منتقاة بعناية، والخدمة مصقولة. أقرب شيء إلى الطعام الراقي في المدينة. 200-350 درهم.' },
        { name: 'شواء سوق السمك بالميناء — طعام الشارع', desc: 'ميناء الصيد العامل جنوب المارينا به صفّ من أكشاك الشواء البسيطة حيث يُطهى صيد الصباح على الفحم حسب الطلب. اختر سمكك من العرض، ادفع حسب الوزن، وكُل على طاولات جماعية تطلّ على القوارب. هذه هي أطزج المأكولات البحرية التي ستأكلها في المغرب، وأرخصها. 50-100 درهم.' },
        { name: 'مقاهي تغازوت — ثقافة ركوب الأمواج', desc: 'تقدّم المقاهي التي تصطف على الشارع الرئيسي لتغازوت مزيجاً من الأطباق المغربية الأساسية وطعام ثقافة ركوب الأمواج العالمية — أطباق سموذي، توست الأفوكادو، طاجين، عصير طازج. الأجواء مسترخية، الإطلالات أطلسية، والأسعار أقلّ من أكادير نفسها. 60-120 درهماً.' },
        { name: 'التابي روج — مغربي تقليدي', desc: 'أحد المطاعم القليلة في أكادير التي تقدّم المطبخ المغربي التقليدي بطموح حقيقي. طاجين وكسكس وبسطيلة تُحضَّر بعناية وتُقدَّم بأسلوب. تذكير بأن حداثة أكادير لم تمحِ تراثها الطهوي. 120-200 درهم.' },
        { name: 'ليل ونهار — مقهى طوال اليوم', desc: 'مقهى-مطعم محلي محبّب في تالبرجت يقدّم الفطور المغربي والعصائر الطازجة واللحوم المشوية والمعجّنات من الصباح إلى وقت متأخر. الشرفة مكان جيد لمشاهدة الناس. طعام يومي موثوق وبأسعار معقولة. 40-80 درهماً.' },
      ],
      fr: [
        { name: 'Pure Passion — Fruits de mer haut de gamme', desc: "Le restaurant phare d'Agadir, servant des fruits de mer joliment présentés et une fusion méditerranéenne-marocaine dans un cadre élégant attenant à la marina. Le poisson est impeccable, la carte des vins (inhabituelle pour le Maroc) est bien pensée, et le service est soigné. Ce qui se rapproche le plus du fine dining dans la ville. 200-350 MAD." },
        { name: 'Grill du marché aux poissons du port — Street food', desc: "Le port de pêche en activité au sud de la marina abrite une rangée de simples stands de grillades où la pêche du matin est cuite au charbon à la commande. Choisissez votre poisson à l'étal, payez au poids et mangez aux tables communes donnant sur les bateaux. Ce sont les fruits de mer les plus frais que vous mangerez au Maroc, et les moins chers. 50-100 MAD." },
        { name: 'Cafés de Taghazout — Culture surf', desc: "Les cafés qui bordent la rue principale de Taghazout servent un mélange de classiques marocains et de cuisine internationale de culture surf — bols smoothie, avocado toast, tajine, jus frais. L'ambiance est décontractée, les vues sont atlantiques et les prix sont plus bas qu'à Agadir même. 60-120 MAD." },
        { name: 'Le Tapis Rouge — Cuisine marocaine traditionnelle', desc: "L'un des rares restaurants d'Agadir servant une cuisine marocaine traditionnelle avec une réelle ambition. Tajines, couscous et pastilla préparés avec soin et présentés avec style. Un rappel que la modernité d'Agadir n'a pas effacé son héritage culinaire. 120-200 MAD." },
        { name: 'Jour et Nuit — Café toute la journée', desc: "Un café-restaurant local populaire à Talborjt servant des petits-déjeuners marocains, des jus pressés, des grillades et des pâtisseries du matin jusque tard. La terrasse est un bon point d'observation des passants. Une valeur sûre, fiable et abordable. 40-80 MAD." },
      ],
    },
    accommodation: {
      en: [
        { tier: 'Budget', range: '$30–60 / night', desc: "Talborjt and the streets behind the beach have clean, simple hotels and apartments at budget prices. Taghazout's surf hostels — Surf Maroc, Hash Point — offer communal atmosphere and ocean proximity for backpacker budgets. Agadir is one of the most affordable host cities for accommodation." },
        { tier: 'Mid-Range', range: '$80–150 / night', desc: 'The beach hotel zone has several well-maintained mid-range options: Iberostar Founty Beach, Atlantic Palace, and Kenzi Europa offer comfort, pools, and direct beach access. Marina-area apartments are a strong alternative in this range, offering self-catering flexibility.' },
        { tier: 'Luxury', range: '$200+ / night', desc: "Sofitel Agadir Royal Bay leads the luxury segment with direct beachfront and full resort facilities. Sofitel Thalassa Sea & Spa and the Tikida Golf Palace in the Citrus district offer premium alternatives. The new Fairmont Taghazout Bay resort complex, 20km north, adds a distinctly modern luxury option." },
      ],
      ar: [
        { tier: 'اقتصادي', range: '30-60 دولاراً / الليلة', desc: 'تالبرجت والشوارع الخلفية للشاطئ بها فنادق وشقق نظيفة وبسيطة بأسعار اقتصادية. نزل ركوب الأمواج في تغازوت — «سيرف مغرب»، «هاش بوينت» — تقدّم أجواءً جماعية وقرباً من المحيط لميزانيات المسافرين. أكادير إحدى أكثر المدن المضيفة التي يسهل الإقامة فيها.' },
        { tier: 'متوسط', range: '80-150 دولاراً / الليلة', desc: 'منطقة فنادق الشاطئ بها عدّة خيارات متوسطة حسنة الصيانة: «إيبيروستار فونتي بيتش»، «أتلانتيك بالاس»، و«كنزي أوروبا» تقدّم الراحة والمسابح والوصول المباشر للشاطئ. شقق منطقة المارينا بديل قوي في هذه الفئة، تقدّم مرونة الإعاشة الذاتية.' },
        { tier: 'فاخر', range: '200+ دولاراً / الليلة', desc: '«سوفيتيل أكادير رويال باي» يتصدّر قطاع الفخامة بواجهة شاطئية مباشرة ومرافق منتجع كاملة. «سوفيتيل ثالاسا سي آند سبا» و«تيكيدا غولف بالاس» في حي سيترو يقدّمان بدائل راقية. مجمع منتجع «فيرمونت تغازوت باي» الجديد، على بعد 20 كم شمالاً، يضيف خياراً فاخراً حديثاً بشكل واضح.' },
      ],
      fr: [
        { tier: 'Budget', range: '30-60 $ / nuit', desc: "Talborjt et les rues derrière la plage abritent des hôtels et appartements propres et simples à prix budget. Les auberges de surf de Taghazout — Surf Maroc, Hash Point — offrent ambiance communautaire et proximité de l'océan pour des budgets routards. Agadir est l'une des villes hôtes les plus abordables pour l'hébergement." },
        { tier: 'Milieu de gamme', range: '80-150 $ / nuit', desc: "La zone hôtelière de la plage compte plusieurs options bien entretenues de gamme moyenne : Iberostar Founty Beach, Atlantic Palace et Kenzi Europa offrent confort, piscines et accès direct à la plage. Les appartements autour de la marina sont une alternative solide dans cette fourchette, offrant la flexibilité de l'autonomie en cuisine." },
        { tier: 'Luxe', range: '200+ $ / nuit', desc: "Le Sofitel Agadir Royal Bay domine le segment luxe avec un front de mer direct et des installations de resort complètes. Le Sofitel Thalassa Sea & Spa et le Tikida Golf Palace dans le quartier Citrus offrent des alternatives premium. Le nouveau complexe Fairmont Taghazout Bay, à 20 km au nord, ajoute une option luxe résolument moderne." },
      ],
    },
    gettingThere: {
      en: [
        { icon: '✈', label: 'Airport', detail: "Al Massira Airport (AGA) — 25km southeast of the city centre. Morocco's most-flown-to destination for European charter flights, with direct connections from the UK, Germany, France, Scandinavia, and the Benelux countries. For many European fans, Agadir may be the cheapest and most convenient host city to reach. A taxi to the city takes 25-30 minutes." },
        { icon: '🚌', label: 'Bus', detail: "Agadir is not connected to Morocco's rail network. CTM and Supratours coaches link the city to Marrakech (3h), Essaouira (2.5h), Casablanca (7h), and Tiznit (1.5h). The bus station is in Talborjt. Coaches are comfortable, air-conditioned, and reliable." },
        { icon: '💡', label: 'Tips', detail: 'Agadir is flat and easy to navigate. Petit taxis (orange) are metered and cheap. The beach promenade is ideal for walking and cycling. For Taghazout, grand taxis (shared) run frequently from central Agadir, or Careem/taxi will cost around 100-150 MAD one way.' },
      ],
      ar: [
        { icon: '✈', label: 'المطار', detail: 'مطار المسيرة (AGA) — على بعد 25 كم جنوب شرق وسط المدينة. الوجهة المغربية الأكثر طلباً لرحلات العبور الأوروبية، مع اتصالات مباشرة من المملكة المتحدة وألمانيا وفرنسا والدول الاسكندنافية ودول البنلوكس. لكثير من المشجعين الأوروبيين، قد تكون أكادير أرخص وأسهل مدينة مضيفة للوصول إليها. سيارة أجرة إلى المدينة تستغرق 25-30 دقيقة.' },
        { icon: '🚌', label: 'الحافلة', detail: 'أكادير غير متصلة بشبكة السكك الحديدية المغربية. تربط حافلات «CTM» و«سوبراتور» المدينة بمراكش (3 ساعات)، والصويرة (2.5 ساعة)، والدار البيضاء (7 ساعات)، وتزنيت (1.5 ساعة). محطة الحافلات في تالبرجت. الحافلات مريحة ومكيّفة وموثوقة.' },
        { icon: '💡', label: 'نصائح', detail: 'أكادير مسطّحة وسهلة التنقل. سيارات الأجرة الصغيرة (البرتقالية) مزوّدة بعدّاد ورخيصة. كورنيش الشاطئ مثالي للمشي وركوب الدرّاجة. لتغازوت، تعمل سيارات الأجرة الكبيرة (الجماعية) بانتظام من وسط أكادير، أو ستكلّف سيارة «كريم»/الأجرة نحو 100-150 درهم في الاتجاه الواحد.' },
      ],
      fr: [
        { icon: '✈', label: 'Aéroport', detail: "Aéroport Al Massira (AGA) — à 25 km au sud-est du centre-ville. La destination marocaine la plus desservie par les vols charter européens, avec des connexions directes depuis le Royaume-Uni, l'Allemagne, la France, la Scandinavie et le Benelux. Pour de nombreux supporters européens, Agadir pourrait être la ville hôte la plus économique et la plus pratique à rejoindre. Un taxi vers la ville prend 25 à 30 minutes." },
        { icon: '🚌', label: 'Bus', detail: "Agadir n'est pas reliée au réseau ferroviaire marocain. Les autocars CTM et Supratours relient la ville à Marrakech (3h), Essaouira (2h30), Casablanca (7h) et Tiznit (1h30). La gare routière se trouve à Talborjt. Les autocars sont confortables, climatisés et fiables." },
        { icon: '💡', label: 'Conseils', detail: "Agadir est plate et facile à parcourir. Les petits taxis (orange) sont équipés de compteurs et bon marché. La promenade de la plage est idéale pour marcher et faire du vélo. Pour Taghazout, les grands taxis (partagés) circulent fréquemment depuis le centre d'Agadir, ou un Careem/taxi coûtera environ 100-150 MAD l'aller simple." },
      ],
    },
    matchday: {
      en: [
        'Adrar Stadium is located in the eastern part of the city, approximately 5km from the beach and the hotel zone. It is one of the most accessible stadiums in the tournament. Taxis, local buses, and walking (from Talborjt) are all viable. Allow 15-25 minutes from the beach area.',
        "Pre-match atmosphere will build along the beach promenade and in the marina district. Agadir's matchday character will be different from the other host cities — less medieval intensity, more beachfront festival. Expect open-air screens, music, and a relaxed Atlantic-coast energy.",
        'Consider using Agadir as a base for multiple matches. Its airport connections, affordable accommodation, and resort infrastructure make it an ideal hub, with bus and domestic flight connections to Marrakech and Casablanca for additional matches.',
      ],
      ar: [
        'يقع ملعب أدرار في الجزء الشرقي من المدينة، على بعد نحو 5 كم من الشاطئ ومنطقة الفنادق. إنه أحد أكثر الملاعب إمكانية للوصول في البطولة. سيارات الأجرة والحافلات المحلية والمشي (من تالبرجت) كلها خيارات ممكنة. خصّص 15-25 دقيقة من منطقة الشاطئ.',
        'ستتجمّع أجواء ما قبل المباراة على طول كورنيش الشاطئ وفي حي المارينا. سيكون طابع يوم المباراة في أكادير مختلفاً عن المدن المضيفة الأخرى — شدّة قروسطية أقل، مهرجان واجهة بحرية أكثر. توقّع شاشات في الهواء الطلق وموسيقى وطاقة ساحل أطلسي مسترخية.',
        'فكّر في استعمال أكادير قاعدة لعدّة مباريات. اتصالات مطارها، وإقامتها المعقولة الثمن، وبنيتها التحتية كمنتجع تجعلها مركزاً مثالياً، مع اتصالات الحافلات والطيران الداخلي إلى مراكش والدار البيضاء للمباريات الإضافية.',
      ],
      fr: [
        "Le stade Adrar est situé dans la partie est de la ville, à environ 5 km de la plage et de la zone hôtelière. C'est l'un des stades les plus accessibles du tournoi. Taxis, bus locaux et même la marche (depuis Talborjt) sont tous viables. Comptez 15 à 25 minutes depuis la zone de la plage.",
        "L'ambiance d'avant-match se construira le long de la promenade de la plage et dans le quartier de la marina. Le caractère jour de match d'Agadir sera différent de celui des autres villes hôtes — moins d'intensité médiévale, plus de festival en bord de mer. Attendez-vous à des écrans en plein air, de la musique et une énergie détendue de côte atlantique.",
        "Envisagez d'utiliser Agadir comme base pour plusieurs matchs. Ses connexions aéroport, son hébergement abordable et son infrastructure balnéaire en font un hub idéal, avec des liaisons en bus et des vols intérieurs vers Marrakech et Casablanca pour des matchs supplémentaires.",
      ],
    },
    dontMiss: {
      en: [
        { name: 'Agadir Oufella (Kasbah Ruins)', desc: "The hilltop ruins of the old kasbah, destroyed in the 1960 earthquake, offer a panoramic viewpoint over the entire city, the beach, the port, and the Atlantic. The inscription on the hillside — 'God, Country, King' — is visible from across the city. Go at sunset for the best light and a poignant reminder of what was lost." },
        { name: 'Souss-Massa National Park', desc: 'A coastal national park 40km south of Agadir, protecting wetlands, sand dunes, and one of the last wild populations of the critically endangered northern bald ibis. Flamingos, boar, and jackals inhabit the reserve. A genuine wildlife experience an hour from the city.' },
        { name: 'Taghazout Surfing', desc: "Morocco's premier surf destination, with consistent Atlantic swells from September to April. Anchor Point, Killer Point, and Hash Point offer world-class waves for experienced surfers; the beach breaks are perfect for beginners. Surf schools operate year-round. Even non-surfers will enjoy the village atmosphere." },
        { name: 'Crocoparc', desc: 'A modern zoological park 14km from the city centre, home to over 300 Nile crocodiles in landscaped gardens alongside a cactus collection and tropical plants. Well-designed, family-friendly, and surprisingly engaging. One of the best-executed tourist attractions in southern Morocco.' },
      ],
      ar: [
        { name: 'أكادير أوفلا (أطلال القصبة)', desc: 'أطلال القصبة القديمة على قمّة التلة، التي دمّرها زلزال 1960، تقدّم نقطة مشاهدة بانورامية على المدينة بأكملها والشاطئ والميناء والأطلسي. النقش على سفح التلة — «الله، الوطن، الملك» — مرئي من كامل المدينة. اذهب عند الغروب لأفضل ضوء وتذكير مؤثّر بما فُقد.' },
        { name: 'المنتزه الوطني لسوس ماسة', desc: 'منتزه وطني ساحلي على بعد 40 كم جنوب أكادير، يحمي الأراضي الرطبة والكثبان الرملية وواحدة من آخر المجموعات البرية لأبي منجل الأصلع الشمالي المهدّد بالانقراض. يسكن المحمية البشاروش والخنازير البرية وابن آوى. تجربة حياة برية حقيقية على بعد ساعة من المدينة.' },
        { name: 'ركوب الأمواج في تغازوت', desc: 'الوجهة الأولى لركوب الأمواج في المغرب، بموجات أطلسية ثابتة من شتنبر إلى أبريل. «أنكور بوينت» و«كيلر بوينت» و«هاش بوينت» تقدّم أمواجاً عالمية المستوى لراكبي الأمواج ذوي الخبرة؛ الأمواج الشاطئية مثالية للمبتدئين. مدارس ركوب الأمواج تعمل على مدار السنة. حتى غير راكبي الأمواج سيستمتعون بأجواء القرية.' },
        { name: 'كروكوبارك', desc: 'حديقة حيوانات حديثة على بعد 14 كم من وسط المدينة، تضمّ أكثر من 300 تمساح نيل في حدائق منسّقة إلى جانب مجموعة من الصبّار والنباتات الاستوائية. حسنة التصميم، ملائمة للعائلات، وجذّابة بشكل مفاجئ. من أفضل المعالم السياحية التنفيذ في جنوب المغرب.' },
      ],
      fr: [
        { name: 'Agadir Oufella (Ruines de la kasbah)', desc: "Les ruines de l'ancienne kasbah au sommet de la colline, détruite par le tremblement de terre de 1960, offrent un point de vue panoramique sur toute la ville, la plage, le port et l'Atlantique. L'inscription à flanc de colline — « Dieu, Patrie, Roi » — est visible depuis toute la ville. Allez-y au coucher du soleil pour la meilleure lumière et un rappel poignant de ce qui a été perdu." },
        { name: 'Parc national de Souss-Massa', desc: "Un parc national côtier à 40 km au sud d'Agadir, protégeant zones humides, dunes de sable et l'une des dernières populations sauvages de l'ibis chauve du Nord, en danger critique. Flamants roses, sangliers et chacals peuplent la réserve. Une véritable expérience faunique à une heure de la ville." },
        { name: 'Surf à Taghazout', desc: "La première destination de surf du Maroc, avec des houles atlantiques régulières de septembre à avril. Anchor Point, Killer Point et Hash Point offrent des vagues de classe mondiale pour les surfeurs expérimentés ; les beach breaks sont parfaits pour les débutants. Les écoles de surf fonctionnent toute l'année. Même les non-surfeurs apprécieront l'ambiance du village." },
        { name: 'Crocoparc', desc: "Un parc zoologique moderne à 14 km du centre-ville, abritant plus de 300 crocodiles du Nil dans des jardins paysagers ainsi qu'une collection de cactus et de plantes tropicales. Bien conçu, adapté aux familles et étonnamment captivant. L'une des attractions touristiques les mieux exécutées du sud du Maroc." },
      ],
    },
  },
]

/**
 * Build a localised `TouristDestination` JSON-LD object for a single
 * host city. Called once per city per page render, with the current
 * page locale.
 *
 * Localised fields: description (full history paragraph), inLanguage.
 *
 * Stable fields: canonical English name, geo coordinates, region,
 * country. Matches the stadiums venueJsonLd() pattern.
 */
export function hostCityJsonLd(city: WC2030HostCity, lang: Lang = 'en') {
  const history = pickLocale(city.history, lang)
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    inLanguage: lang,
    name: city.nameEn,
    description: history,
    touristType: ['Football fans', 'World Cup 2030 visitors'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.nameEn,
      addressRegion: city.region,
      addressCountry: 'MA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: city.geo.latitude,
      longitude: city.geo.longitude,
    },
    ...(city.population ? {
      populationGroup: {
        '@type': 'QuantitativeValue',
        value: city.population,
      },
    } : {}),
  }
}
