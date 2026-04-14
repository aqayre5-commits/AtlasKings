/**
 * WC 2030 venues — shared data module.
 * ─────────────────────────────────────────────────────────────────────
 *
 * Phase B.2: fully localised body content for EN / AR / FR.
 *
 * Single source of truth for the six Moroccan stadiums hosting the
 * 2030 FIFA World Cup. Every language-facing field (body prose, facts,
 * matchday copy, getting-there rows, schedule line, status label,
 * badge, city display, capacity note) carries an {en, ar, fr} triple
 * so that AR and FR readers get the same flagship experience as EN.
 *
 * Language-neutral fields kept flat (NOT localised):
 *   slug, name (canonical EN proper noun), capacity (display number),
 *   status key, accent colour, badgeColor, venueId, geo coordinates,
 *   addressLocality (used by Schema.org PostalAddress.addressRegion)
 *
 * Consumed by:
 *   - /world-cup-2030/stadiums        (flagship, Phase B.1 + B.2)
 *   - /world-cup-2030                 (hub, Phase G refactor)
 *   - /world-cup-2030/construction    (Phase D — independent, keeps its
 *                                      own narrower dataset for now)
 *
 * Coordinates are approximate — accurate enough for Place JSON-LD
 * location identification, not precise enough for navigation.
 */

import type { Lang } from '@/lib/i18n/config'

// ── Primitive data shapes ────────────────────────────────────────────

export interface VenueFact {
  label: string
  value: string
}

export interface MatchdayCard {
  label: string
  detail: string
}

export interface GettingThereRow {
  mode: string
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
  en: VenueFact[]
  ar: VenueFact[]
  fr: VenueFact[]
}

export interface LocalisedMatchday {
  en: MatchdayCard[]
  ar: MatchdayCard[]
  fr: MatchdayCard[]
}

export interface LocalisedGettingThere {
  en: GettingThereRow[]
  ar: GettingThereRow[]
  fr: GettingThereRow[]
}

/**
 * Generic locale picker. Falls back to EN if a locale is missing,
 * which should never happen in practice but keeps the renderer
 * defensive against future partial data.
 */
export function pickLocale<T>(field: { en: T; ar: T; fr: T }, lang: Lang): T {
  return field[lang] ?? field.en
}

// ── Venue status ─────────────────────────────────────────────────────

export type VenueStatusKey = 'complete' | 'construction' | 'design'

export const VENUE_STATUS: Record<VenueStatusKey, {
  label: LocalisedString
  color: string
  emoji: string
}> = {
  complete: {
    label: { en: 'Complete', ar: 'مكتمل', fr: 'Achevé' },
    color: '#22c55e',
    emoji: '🟢',
  },
  construction: {
    label: { en: 'Under Construction', ar: 'قيد الإنشاء', fr: 'En construction' },
    color: '#eab308',
    emoji: '🟡',
  },
  design: {
    label: { en: 'Design Phase', ar: 'مرحلة التصميم', fr: 'Phase de conception' },
    color: '#3b82f6',
    emoji: '🔵',
  },
}

// ── Venue interface ──────────────────────────────────────────────────

export interface WC2030Venue {
  /** URL-safe slug — also used as anchor id on the stadiums page */
  slug: string
  /** Canonical EN proper noun name (stable across locales) */
  name: string
  /** Host city, localised for display */
  city: LocalisedString
  /** Capacity as display string (e.g. "115,000") — kept flat, numeric */
  capacity: string
  /** Optional capacity context (e.g. "Expanded from 45,000") */
  capacityNote?: LocalisedString
  /** Construction/readiness status — label localised via VENUE_STATUS */
  status: VenueStatusKey
  /** Match schedule badge on the card header */
  badge: LocalisedString
  /** Accent colour token used for card highlights */
  accent: string
  /** Badge background colour token */
  badgeColor: string
  /** api-football venue id for photo fetches */
  venueId?: number
  /** Approximate geo coordinates for Place JSON-LD */
  geo: {
    latitude: number
    longitude: number
  }
  /** Street-level address locality (EN) for PostalAddress.addressRegion */
  addressLocality: string
  /** Key facts grid rendered at the top of each card */
  facts: LocalisedFacts
  /** Long-form narrative (4 paragraphs per locale) */
  story: LocalisedStrings
  /** Architecture & design long-form (3 paragraphs per locale) */
  architecture: LocalisedStrings
  /** Matchday experience cards (4 items per locale) */
  matchday: LocalisedMatchday
  /** Getting there rows (5 items per locale) */
  gettingThere: LocalisedGettingThere
  /** Match schedule line */
  matchSchedule: LocalisedString
}

/* ------------------------------------------------------------------ */
/*  Venue dataset                                                      */
/* ------------------------------------------------------------------ */

export const WC2030_VENUES: WC2030Venue[] = [
  /* ═══════════════════════════════════════════════════════════════
     1. GRAND STADE HASSAN II — Casablanca
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: 'grand-stade-hassan-ii',
    name: 'Grand Stade Hassan II',
    city: { en: 'Casablanca', ar: 'الدار البيضاء', fr: 'Casablanca' },
    capacity: '115,000',
    capacityNote: {
      en: 'Will be the largest football stadium on Earth',
      ar: 'سيصبح أكبر ملعب كرة قدم في العالم',
      fr: 'Sera le plus grand stade de football au monde',
    },
    status: 'construction',
    badge: {
      en: 'OPENING MATCH + FINAL',
      ar: 'مباراة الافتتاح + النهائي',
      fr: "MATCH D'OUVERTURE + FINALE",
    },
    accent: 'var(--green)',
    badgeColor: 'var(--gold)',
    venueId: 1099,
    geo: { latitude: 33.7200, longitude: -7.2230 },
    addressLocality: 'El Mansouria, Benslimane',
    facts: {
      en: [
        { label: 'Architect', value: 'Tarik Oualalou (OUALALOU+CHOI) + Populous' },
        { label: 'Budget', value: '$1.2 billion' },
        { label: 'Club Tenant (post-2030)', value: 'Raja CA & Wydad AC' },
        { label: 'Location', value: 'El Mansouria, Benslimane (40 km from Casablanca centre)' },
        { label: 'Surface', value: 'Natural grass with retractable roof' },
        { label: 'Expected Completion', value: '2028' },
      ],
      ar: [
        { label: 'المهندس المعماري', value: 'طارق الوعلالو (OUALALOU+CHOI) + Populous' },
        { label: 'الميزانية', value: '1.2 مليار دولار' },
        { label: 'النادي المقيم (بعد 2030)', value: 'الرجاء البيضاوي والوداد البيضاوي' },
        { label: 'الموقع', value: 'المنصورية، بن سليمان (40 كم من وسط الدار البيضاء)' },
        { label: 'أرضية الملعب', value: 'عشب طبيعي مع سقف قابل للطي' },
        { label: 'الإنجاز المتوقع', value: '2028' },
      ],
      fr: [
        { label: 'Architecte', value: 'Tarik Oualalou (OUALALOU+CHOI) + Populous' },
        { label: 'Budget', value: '1,2 milliard $' },
        { label: 'Club résident (post-2030)', value: 'Raja CA & Wydad AC' },
        { label: 'Emplacement', value: 'El Mansouria, Benslimane (40 km du centre de Casablanca)' },
        { label: 'Pelouse', value: 'Gazon naturel avec toit rétractable' },
        { label: 'Achèvement prévu', value: '2028' },
      ],
    },
    story: {
      en: [
        "There are football stadiums, and then there is the Grand Stade Hassan II. Rising from the forested plains of El Mansouria, midway between the Atlantic coast and the first ridges of the Middle Atlas, this is not merely a venue for the 2030 World Cup. It is Morocco's declaration of intent on the global stage. At 115,000 seats it will surpass the Narendra Modi Stadium in Ahmedabad as the largest football ground ever built, and it will do so with an architectural ambition that elevates the project far beyond sheer numbers.",
        "Morocco has been bidding to host the World Cup since 1994. Six attempts. Six painful rejections. The Grand Stade Hassan II is the physical embodiment of everything those decades of perseverance built toward. It is named after the late King Hassan II, a unifying figure in Moroccan history, and its positioning in El Mansouria, roughly 40 kilometres from downtown Casablanca, is deliberate. The stadium anchors a new 200-hectare sports complex that will serve as a legacy hub for athletics, training, and community recreation long after the final whistle of the 2030 tournament.",
        "The significance of this venue cannot be overstated. FIFA has designated it as the host for both the opening match and the final of the 2030 World Cup. The opening ceremony will unfold here before a crowd of 115,000, and weeks later the tournament's climax will take place on the same pitch. No stadium in World Cup history will have shouldered both bookends of a single tournament at this scale. For Morocco, the symbolism is unmistakable: the country that was told \"no\" for thirty years will open and close football's greatest show.",
        "Beyond the football, the Grand Stade Hassan II represents one of the most significant infrastructure investments in Moroccan history. New motorway connections, a rail extension from Casablanca, and a dedicated transport corridor are being built specifically to funnel 115,000 spectators to and from the venue on match days. The surrounding sports complex will include training pitches, an aquatics centre, and public parkland, ensuring the site lives and breathes well beyond 2030.",
      ],
      ar: [
        "هناك ملاعب كرة قدم، ثم هناك ملعب الحسن الثاني الكبير. يرتفع هذا الصرح من سهول المنصورية المشجّرة، في منتصف الطريق بين الساحل الأطلسي وأولى تلال الأطلس المتوسط، وهو ليس مجرد ملعب لكأس العالم 2030. إنه إعلان المغرب عن نواياه على الساحة العالمية. بسعة 115,000 مقعد، سيتجاوز ملعب ناريندرا مودي في أحمد آباد ليصبح أكبر ملعب لكرة القدم أُنشئ على الإطلاق، وسيفعل ذلك بطموح معماري يرتقي بالمشروع إلى ما هو أبعد بكثير من مجرد الأرقام.",
        "يسعى المغرب إلى استضافة كأس العالم منذ عام 1994. ست محاولات. وست رفضات موجعة. ملعب الحسن الثاني الكبير هو التجسيد المادي لكل ما بنته عقود المثابرة هذه. يحمل الملعب اسم الملك الراحل الحسن الثاني، الشخصية الجامعة في التاريخ المغربي، وموقعه في المنصورية على بعد نحو 40 كيلومتراً من وسط الدار البيضاء اختيار مقصود. يشكّل الملعب نواة مجمع رياضي جديد بمساحة 200 هكتار، سيكون مركزاً إرثياً لألعاب القوى والتدريب والترفيه المجتمعي لفترة طويلة بعد صافرة نهاية بطولة 2030.",
        "لا يمكن المبالغة في أهمية هذا الصرح. فقد حدّده الفيفا كمستضيف لكل من مباراة الافتتاح ونهائي كأس العالم 2030. ستقام مراسم الافتتاح هنا أمام حشد من 115,000 متفرج، وبعد أسابيع ستدور ذروة البطولة على الأرضية ذاتها. لم يحمل أي ملعب في تاريخ كؤوس العالم طرفَي بطولة واحدة بهذا الحجم من قبل. أما بالنسبة للمغرب، فالرمزية لا لبس فيها: البلد الذي قيل له «لا» على مدى ثلاثين عاماً سيفتتح ويختتم أكبر عرض كروي في العالم.",
        "إلى جانب كرة القدم، يمثل ملعب الحسن الثاني الكبير أحد أهم استثمارات البنية التحتية في تاريخ المغرب. تُبنى حالياً وصلات طرقية جديدة، وامتداد للسكك الحديدية من الدار البيضاء، وممر نقل مخصص، وكل ذلك صُمم خصيصاً لنقل 115,000 متفرج إلى الملعب ومنه في أيام المباريات. سيضم المجمع الرياضي المحيط ملاعب تدريب ومركزاً للرياضات المائية ومتنزهاً عمومياً، مما يضمن بقاء الموقع حياً ونابضاً لفترة طويلة بعد 2030.",
      ],
      fr: [
        "Il y a des stades de football, et il y a le Grand Stade Hassan II. Émergeant des plaines boisées d'El Mansouria, à mi-chemin entre la côte atlantique et les premiers contreforts du Moyen Atlas, cette enceinte n'est pas qu'un simple site pour la Coupe du Monde 2030. C'est la déclaration d'intention du Maroc sur la scène mondiale. Avec ses 115 000 places, il dépassera le Narendra Modi Stadium d'Ahmedabad pour devenir le plus grand stade de football jamais construit, et il le fera avec une ambition architecturale qui élève le projet bien au-delà des simples chiffres.",
        "Le Maroc est candidat à l'organisation de la Coupe du Monde depuis 1994. Six tentatives. Six refus douloureux. Le Grand Stade Hassan II est l'incarnation physique de tout ce vers quoi ces décennies de persévérance tendaient. Il porte le nom du défunt roi Hassan II, figure fédératrice de l'histoire marocaine, et sa position à El Mansouria, à environ 40 kilomètres du centre de Casablanca, est délibérée. Le stade ancre un nouveau complexe sportif de 200 hectares qui servira de pôle d'héritage pour l'athlétisme, l'entraînement et les loisirs communautaires bien au-delà du coup de sifflet final du tournoi 2030.",
        "L'importance de cette enceinte ne saurait être exagérée. La FIFA l'a désigné pour accueillir à la fois le match d'ouverture et la finale de la Coupe du Monde 2030. La cérémonie d'ouverture s'y déroulera devant une foule de 115 000 personnes, et quelques semaines plus tard, l'apogée du tournoi aura lieu sur la même pelouse. Aucun stade dans l'histoire des Coupes du Monde n'aura porté les deux extrémités d'un même tournoi à cette échelle. Pour le Maroc, la symbolique est sans équivoque : le pays à qui l'on a dit « non » pendant trente ans ouvrira et clôturera le plus grand spectacle du football.",
        "Au-delà du football, le Grand Stade Hassan II représente l'un des investissements en infrastructures les plus importants de l'histoire du Maroc. De nouvelles liaisons autoroutières, une extension ferroviaire depuis Casablanca et un corridor de transport dédié sont en cours de construction spécifiquement pour acheminer 115 000 spectateurs vers et depuis le site les jours de match. Le complexe sportif environnant comprendra des terrains d'entraînement, un centre aquatique et des espaces verts publics, garantissant que le site vive et respire bien au-delà de 2030.",
      ],
    },
    architecture: {
      en: [
        "The design, conceived by Paris-based Moroccan architect Tarik Oualalou of OUALALOU+CHOI in collaboration with global stadium specialists Populous, draws its central concept from the moussem, the traditional Moroccan communal gathering. The result is a translucent aluminium lattice canopy that floats above the bowl like a monumental tent, evoking centuries of desert hospitality and shared ritual. Thirty-two grand stairways pierce the exterior skin, serving as both entry points and elevated botanical walkways 28 metres above ground level. The effect is part stadium, part garden, and entirely theatrical.",
        "Moroccan geometry and zellige tilework inform every surface. The roof structure, when closed, creates the largest covered stadium ever built, shielding spectators from Casablanca's summer heat while allowing natural ventilation through perforated lattice panels inspired by traditional mashrabiya screens. The retractable mechanism is an engineering marvel: a system of interlocking panels that can open or close in under twenty minutes, transforming the atmosphere from an open-air arena to an enclosed cauldron of sound.",
        "Sustainability is woven into the design at every level. Solar panels integrated into the roof structure will generate a significant portion of the stadium's energy needs. Rainwater harvesting systems will irrigate the natural grass pitch and surrounding landscaping. The aluminium lattice exterior provides passive cooling, reducing the need for mechanical air conditioning in hospitality areas. The architects have described the project as a demonstration that mega-scale infrastructure and environmental responsibility are not mutually exclusive.",
      ],
      ar: [
        "صُمّم المشروع على يد المهندس المعماري المغربي طارق الوعلالو، المقيم في باريس والمؤسس لمكتب OUALALOU+CHOI، بالتعاون مع متخصّصي الملاعب العالميين في Populous، ويستمد فكرته المحورية من الموسم، التجمّع المغربي التقليدي. والنتيجة مظلة شبكية من الألمنيوم الشفاف تطفو فوق الملعب كخيمة ضخمة، تستحضر قروناً من الكرم الصحراوي والطقوس الجماعية. اثنان وثلاثون درجاً عظيماً تخترق الغلاف الخارجي لتؤدي دور منافذ الدخول وممرات نباتية مرتفعة على علو 28 متراً فوق سطح الأرض في آن معاً. النتيجة ملعب جزئياً، وحديقة جزئياً، ومشهد مسرحي بالكامل.",
        "تُلهم الهندسة المغربية وفنون الزليج كل سطح في الملعب. يخلق هيكل السقف عند إغلاقه أكبر ملعب مسقوف بُني على الإطلاق، ليحمي المتفرجين من حرّ الدار البيضاء الصيفي مع السماح بالتهوية الطبيعية عبر ألواح شبكية مثقّبة مستوحاة من المشربيات التقليدية. آلية الطيّ معجزة هندسية: منظومة من الألواح المتشابكة يمكن أن تُفتح أو تُغلق في أقل من عشرين دقيقة، فتُحوّل الأجواء من ملعب مكشوف إلى قاعة مغلقة تعجّ بالصوت.",
        "الاستدامة منسوجة في التصميم على كل مستوى. ستُولّد الألواح الشمسية المدمجة في هيكل السقف جزءاً كبيراً من احتياجات الملعب من الطاقة. وستروي أنظمة تجميع مياه الأمطار أرضية العشب الطبيعي والمناظر الطبيعية المحيطة. ويوفّر الغلاف الخارجي الشبكي من الألمنيوم تبريداً سلبياً، مما يقلّل الحاجة إلى التكييف الميكانيكي في مناطق الضيافة. وصف المعماريون المشروع بأنه دليل على أن البنية التحتية بالحجم الهائل والمسؤولية البيئية ليستا متناقضتين.",
      ],
      fr: [
        "Le projet, conçu par l'architecte marocain Tarik Oualalou du cabinet parisien OUALALOU+CHOI en collaboration avec les spécialistes mondiaux des stades Populous, puise son concept central dans le moussem, le rassemblement communautaire traditionnel marocain. Le résultat est une canopée en résille d'aluminium translucide qui flotte au-dessus de la cuvette comme une tente monumentale, évoquant des siècles d'hospitalité du désert et de rituels partagés. Trente-deux grands escaliers percent la peau extérieure, servant à la fois de points d'accès et de promenades botaniques surélevées à 28 mètres au-dessus du sol. L'effet est à la fois stade, jardin et entièrement théâtral.",
        "La géométrie marocaine et l'art du zellige informent chaque surface. Fermée, la toiture crée le plus grand stade couvert jamais construit, protégeant les spectateurs de la chaleur estivale de Casablanca tout en permettant une ventilation naturelle à travers des panneaux en résille perforée inspirés des moucharabiehs traditionnels. Le mécanisme rétractable est une merveille d'ingénierie : un système de panneaux imbriqués qui peuvent s'ouvrir ou se fermer en moins de vingt minutes, transformant l'atmosphère d'une arène à ciel ouvert en un chaudron sonore fermé.",
        "La durabilité est tissée dans la conception à tous les niveaux. Les panneaux solaires intégrés à la structure du toit généreront une part significative des besoins énergétiques du stade. Des systèmes de récupération des eaux de pluie irrigueront la pelouse naturelle et les aménagements paysagers environnants. La peau extérieure en résille d'aluminium assure un refroidissement passif, réduisant le besoin de climatisation mécanique dans les zones d'hospitalité. Les architectes ont décrit le projet comme la démonstration que l'infrastructure à méga-échelle et la responsabilité environnementale ne sont pas mutuellement exclusives.",
      ],
    },
    matchday: {
      en: [
        { label: 'Atmosphere & Capacity', detail: 'Full 115,000 for the opening ceremony, opening match, and final. Three steep tiers at each end create a wall of sound. Five levels of hospitality accommodate over 12,000 premium seats flanking the Royal box.' },
        { label: 'VIP & Hospitality', detail: 'Twelve hospitality lounges, a VVIP Royal suite, two business clubs, and sky boxes ringing the upper tier. Dedicated VIP entrance tunnels with private parking.' },
        { label: 'Fan Zones', detail: 'A 200-hectare sports complex surrounds the stadium with dedicated fan festival areas, giant screens, food villages, and music stages. Expect a carnival atmosphere hours before kick-off.' },
        { label: 'Food & Drink', detail: 'Over 300 concession points inside the stadium serving Moroccan street food (msemen, brochettes, fresh-squeezed orange juice), international options, and beverages. Premium dining in hospitality suites.' },
      ],
      ar: [
        { label: 'الأجواء والسعة', detail: 'السعة الكاملة 115,000 لمراسم الافتتاح ومباراة الافتتاح والنهائي. ثلاث مدرجات شديدة الانحدار في كل طرف تخلق جداراً من الصوت. خمسة مستويات من الضيافة تستوعب أكثر من 12,000 مقعد مميز يحيط بالمقصورة الملكية.' },
        { label: 'كبار الشخصيات والضيافة', detail: 'اثنا عشر صالون ضيافة، جناح ملكي VVIP، ناديا أعمال، ومقصورات علوية تطوّق الطابق العلوي. أنفاق دخول VIP مخصصة مع مواقف خاصة.' },
        { label: 'مناطق المشجعين', detail: 'مجمع رياضي بمساحة 200 هكتار يحيط بالملعب ويضم مناطق احتفالية مخصصة للمشجعين وشاشات عملاقة وقرى للطعام ومنصات موسيقية. توقّع أجواء كرنفالية قبل ساعات من صافرة البداية.' },
        { label: 'الطعام والشراب', detail: 'أكثر من 300 نقطة بيع داخل الملعب تقدم أطعمة الشارع المغربية (المسمّن، البروشيت، عصير البرتقال الطازج) وخيارات عالمية ومشروبات. وجبات راقية في أجنحة الضيافة.' },
      ],
      fr: [
        { label: 'Ambiance & capacité', detail: "115 000 places pleines pour la cérémonie d'ouverture, le match d'ouverture et la finale. Trois tribunes abruptes à chaque extrémité créent un mur sonore. Cinq niveaux d'hospitalité accueillent plus de 12 000 places premium de part et d'autre de la loge royale." },
        { label: 'VIP & hospitalité', detail: "Douze salons d'hospitalité, une suite royale VVIP, deux clubs d'affaires et des loges d'altitude ceinturant le niveau supérieur. Tunnels d'accès VIP dédiés avec parking privé." },
        { label: 'Zones de supporters', detail: "Un complexe sportif de 200 hectares entoure le stade avec des aires festives dédiées aux supporters, des écrans géants, des villages gourmands et des scènes musicales. Attendez-vous à une ambiance de carnaval plusieurs heures avant le coup d'envoi." },
        { label: 'Restauration', detail: "Plus de 300 points de restauration à l'intérieur du stade servant la cuisine de rue marocaine (msemen, brochettes, jus d'orange pressé), des options internationales et des boissons. Restauration premium dans les salons d'hospitalité." },
      ],
    },
    gettingThere: {
      en: [
        { mode: 'Distance', detail: '40 km from Casablanca city centre (El Mansouria, Benslimane province)' },
        { mode: 'By Taxi', detail: 'Approximately 350-450 MAD ($35-45) from central Casablanca, 40-50 min outside match-day traffic' },
        { mode: 'By Train', detail: 'New rail extension from Casa-Voyageurs station planned for 2028. Al Boraq high-speed connects Casablanca to Tangier (2 hrs) and Rabat (34 min)' },
        { mode: 'By Bus/Shuttle', detail: 'Dedicated FIFA tournament shuttle buses from Casablanca centre, airport, and nearby cities on match days' },
        { mode: 'Parking', detail: 'Massive park-and-ride facilities planned adjacent to the sports complex with capacity for 25,000+ vehicles' },
      ],
      ar: [
        { mode: 'المسافة', detail: '40 كم من وسط الدار البيضاء (المنصورية، إقليم بن سليمان)' },
        { mode: 'بسيارة أجرة', detail: 'نحو 350-450 درهماً (35-45 دولاراً) من وسط الدار البيضاء، 40-50 دقيقة خارج ازدحام يوم المباراة' },
        { mode: 'بالقطار', detail: 'امتداد سكك حديدية جديد من محطة الدار البيضاء-المسافرون مخطّط له في 2028. يربط البراق فائق السرعة الدار البيضاء بطنجة (ساعتان) وبالرباط (34 دقيقة)' },
        { mode: 'بالحافلة/النقل المكوكي', detail: 'حافلات نقل مكوكية مخصصة لبطولة الفيفا من وسط الدار البيضاء والمطار والمدن المجاورة في أيام المباريات' },
        { mode: 'مواقف السيارات', detail: 'مرافق ضخمة للاصطفاف والركوب مخططة بجوار المجمع الرياضي بسعة تزيد عن 25,000 مركبة' },
      ],
      fr: [
        { mode: 'Distance', detail: '40 km du centre de Casablanca (El Mansouria, province de Benslimane)' },
        { mode: 'En taxi', detail: 'Environ 350-450 MAD (35-45 $) depuis le centre de Casablanca, 40-50 min hors trafic de match' },
        { mode: 'En train', detail: "Nouvelle extension ferroviaire depuis la gare de Casa-Voyageurs prévue pour 2028. L'Al Boraq à grande vitesse relie Casablanca à Tanger (2 h) et à Rabat (34 min)" },
        { mode: 'En bus/navette', detail: "Bus-navettes dédiés du tournoi FIFA depuis le centre de Casablanca, l'aéroport et les villes voisines les jours de match" },
        { mode: 'Stationnement', detail: 'Vastes installations de parcs relais prévues à proximité du complexe sportif, avec une capacité de plus de 25 000 véhicules' },
      ],
    },
    matchSchedule: {
      en: 'Opening Match, Group Stage, Round of 32, Round of 16, Quarter-final, Final',
      ar: 'مباراة الافتتاح، دور المجموعات، دور الـ32، دور الـ16، ربع النهائي، النهائي',
      fr: "Match d'ouverture, phase de groupes, seizièmes, huitièmes, quart de finale, finale",
    },
  },

  /* ═══════════════════════════════════════════════════════════════
     2. PRINCE MOULAY ABDELLAH STADIUM — Rabat
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: 'prince-moulay-abdellah',
    name: 'Prince Moulay Abdellah Stadium',
    city: { en: 'Rabat', ar: 'الرباط', fr: 'Rabat' },
    capacity: '68,000',
    status: 'complete',
    badge: {
      en: 'SEMI-FINAL VENUE',
      ar: 'ملعب نصف النهائي',
      fr: 'ENCEINTE DE DEMI-FINALE',
    },
    accent: 'var(--navy)',
    badgeColor: 'var(--navy)',
    venueId: 1103,
    geo: { latitude: 33.9680, longitude: -6.8450 },
    addressLocality: 'Hay Ryad, Rabat',
    facts: {
      en: [
        { label: 'Architect', value: 'Various (built 2000, fully renovated 2023)' },
        { label: 'Budget', value: '$200 million (2023 renovation)' },
        { label: 'Club Tenant', value: 'FUS Rabat & FAR Rabat (shared)' },
        { label: 'Location', value: 'Hay Ryad, central Rabat' },
        { label: 'Surface', value: 'Natural grass' },
        { label: 'Completed', value: '2023 (renovation)' },
      ],
      ar: [
        { label: 'المهندس المعماري', value: 'متعدّد (بُني في 2000، جُدّد بالكامل في 2023)' },
        { label: 'الميزانية', value: '200 مليون دولار (تجديد 2023)' },
        { label: 'النادي المقيم', value: 'الفتح الرباطي والجيش الملكي (بالتناوب)' },
        { label: 'الموقع', value: 'حي الرياض، وسط الرباط' },
        { label: 'أرضية الملعب', value: 'عشب طبيعي' },
        { label: 'تاريخ الإنجاز', value: '2023 (تجديد)' },
      ],
      fr: [
        { label: 'Architecte', value: 'Divers (construit en 2000, entièrement rénové en 2023)' },
        { label: 'Budget', value: '200 millions $ (rénovation 2023)' },
        { label: 'Club résident', value: 'FUS Rabat & FAR Rabat (partagé)' },
        { label: 'Emplacement', value: 'Hay Ryad, centre de Rabat' },
        { label: 'Pelouse', value: 'Gazon naturel' },
        { label: 'Achevé', value: '2023 (rénovation)' },
      ],
    },
    story: {
      en: [
        "Morocco's capital city demanded a stadium worthy of its stature, and the Prince Moulay Abdellah Stadium, comprehensively rebuilt and inaugurated in 2023, delivers exactly that. At 68,000 seats, it is the country's largest fully operational venue and the only one of Morocco's six World Cup stadiums that is already complete and match-ready. The speed of its reconstruction was itself a statement to the world: Morocco knows how to build, and knows how to deliver on time.",
        "The stadium sits in Hay Ryad, one of Rabat's most modern and well-connected districts. Rabat is not Casablanca. It is quieter, more measured, more administrative, the seat of the Moroccan government and the Royal Palace. But the Prince Moulay Abdellah gives the capital a sporting weight to match its political significance. When the lights come on here and 68,000 voices fill the bowl, the city transforms.",
        "This venue has already proven itself on the international stage. It hosted matches during the 2023 FIFA Club World Cup, welcoming clubs from across the globe and earning praise from FIFA for its facilities, sight lines, and operational readiness. That tournament served as a full-scale dress rehearsal for 2030, and the stadium passed every test. For the World Cup, it has been assigned some of the most prestigious fixtures outside of the final itself.",
        "Rabat's significance in 2030 extends far beyond the football. It is the administrative heart of the tournament, the city where FIFA's World Cup operations will be centred, where international delegations and heads of state will gather, and where the diplomatic dimension of the tournament will play out. Matches here will carry a ceremonial gravitas that complements the intensity on the pitch.",
      ],
      ar: [
        "تطلّبت العاصمة المغربية ملعباً يليق بمكانتها، وملعب الأمير مولاي عبد الله، الذي أُعيد بناؤه بشكل شامل ودُشّن في 2023، يقدّم ذلك تماماً. بسعة 68,000 مقعد، هو أكبر ملعب يعمل بالكامل في البلاد والوحيد من بين ملاعب كأس العالم الستة في المغرب الذي اكتمل فعلاً وأصبح جاهزاً لاستضافة المباريات. كانت سرعة إعادة بنائه في حد ذاتها رسالة إلى العالم: المغرب يعرف كيف يبني، ويعرف كيف يسلّم في الوقت المحدد.",
        "يقع الملعب في حي الرياض، أحد أحياء الرباط الأكثر حداثة وتواصلاً. الرباط ليست الدار البيضاء؛ فهي أهدأ وأكثر اتّزاناً وأكثر إدارية، مقرّ الحكومة المغربية والقصر الملكي. لكن ملعب الأمير مولاي عبد الله يمنح العاصمة ثقلاً رياضياً يوازي أهميتها السياسية. عندما تشتعل الأضواء هنا وتملأ 68,000 صوت المدرجات، تتحوّل المدينة.",
        "أثبت هذا الصرح نفسه على الساحة الدولية. استضاف مباريات خلال كأس العالم للأندية 2023، مرحّباً بأندية من مختلف أنحاء العالم وحاصلاً على إشادة الفيفا بمرافقه وخطوط رؤيته وجاهزيته التشغيلية. كانت تلك البطولة بروفة كاملة لـ 2030، واجتاز الملعب كل اختبار. وقد أُسندت إليه في كأس العالم بعض أبرز المواعيد خارج النهائي نفسه.",
        "تمتد أهمية الرباط في 2030 إلى ما هو أبعد من كرة القدم. إنها القلب الإداري للبطولة، المدينة التي ستتمركز فيها عمليات كأس العالم للفيفا، حيث ستتجمع الوفود الدولية ورؤساء الدول، وحيث سيتمظهر البُعد الدبلوماسي للبطولة. ستحمل المباريات هنا طابعاً احتفالياً يكمّل حدّة ما يجري على أرضية الملعب.",
      ],
      fr: [
        "La capitale du Maroc exigeait un stade digne de son statut, et le stade Prince Moulay Abdellah, entièrement reconstruit et inauguré en 2023, tient exactement cette promesse. Avec ses 68 000 places, c'est la plus grande enceinte pleinement opérationnelle du pays et la seule des six stades de la Coupe du Monde au Maroc à être déjà achevée et prête à accueillir des matchs. La vitesse de sa reconstruction était en soi une déclaration au monde : le Maroc sait construire, et sait livrer à temps.",
        "Le stade se dresse à Hay Ryad, l'un des quartiers les plus modernes et les mieux reliés de Rabat. Rabat n'est pas Casablanca. Elle est plus calme, plus mesurée, plus administrative, siège du gouvernement marocain et du Palais royal. Mais le stade Prince Moulay Abdellah donne à la capitale un poids sportif à la hauteur de son importance politique. Quand les lumières s'allument ici et que 68 000 voix emplissent la cuvette, la ville se transforme.",
        "Cette enceinte a déjà fait ses preuves sur la scène internationale. Elle a accueilli des matchs de la Coupe du Monde des Clubs 2023, recevant des équipes venues du monde entier et recueillant les éloges de la FIFA pour ses installations, ses lignes de visibilité et sa préparation opérationnelle. Ce tournoi a servi de répétition générale grandeur nature pour 2030, et le stade a passé chaque test. Pour la Coupe du Monde, on lui a confié certains des matchs les plus prestigieux en dehors de la finale elle-même.",
        "L'importance de Rabat en 2030 dépasse largement le football. Elle est le cœur administratif du tournoi, la ville où seront centrées les opérations de la Coupe du Monde de la FIFA, où se rassembleront les délégations internationales et les chefs d'État, et où se jouera la dimension diplomatique du tournoi. Les matchs y porteront une gravité cérémonielle qui complétera l'intensité sur le terrain.",
      ],
    },
    architecture: {
      en: [
        "The 2023 renovation transformed the Prince Moulay Abdellah from a dated multi-purpose ground into a modern, purpose-built football stadium. A full 360-degree roof now shields every seat from rain and wind while channelling crowd noise back toward the pitch. The athletics track that once created distance between fans and players has been removed, and the stands now press close to the touchline in a configuration that maximises atmosphere.",
        "The design prioritises clean, modern lines that reflect Rabat's identity as a contemporary capital city. The exterior is clad in a pale, luminous material that catches the Atlantic light, and the interior bowl uses a two-tier configuration that brings the upper deck as close to the action as structural engineering allows. New hospitality suites, media facilities, and broadcast infrastructure meet the latest FIFA standards.",
        "Sustainability features include LED floodlighting that reduces energy consumption by 40 percent compared to traditional systems, water-recycling infrastructure for pitch maintenance, and a ventilation system designed to work with Rabat's coastal breezes rather than against them. The result is a stadium that feels open and airy despite its enclosed roof structure.",
      ],
      ar: [
        "حوّل تجديد 2023 ملعب الأمير مولاي عبد الله من أرضية قديمة متعدّدة الاستخدامات إلى ملعب كرة قدم حديث مصمّم لهذا الغرض. يحمي سقف دائري كامل كل مقعد الآن من المطر والرياح بينما يعيد صدى هتاف الجماهير نحو أرضية الملعب. أُزيل المضمار الذي كان يخلق مسافة بين المشجعين واللاعبين، وباتت المدرجات قريبة من خطوط التماس في تهيئة تُعظّم الأجواء.",
        "تعطي التصميم الأولوية لخطوط نظيفة وحديثة تعكس هوية الرباط كعاصمة معاصرة. الواجهة مكسوّة بمادة شاحبة مضيئة تلتقط ضوء الأطلسي، أما الحوض الداخلي فيستخدم تهيئة من طبقتين تقرّب المدرج العلوي من الحدث بقدر ما تسمح به الهندسة الإنشائية. تلبّي أجنحة الضيافة الجديدة والمرافق الإعلامية والبنية التحتية للبث أحدث معايير الفيفا.",
        "تشمل ميزات الاستدامة إضاءة LED تقلّل استهلاك الطاقة بنسبة 40 في المئة مقارنة بالأنظمة التقليدية، وبنية تحتية لإعادة تدوير المياه لصيانة أرضية الملعب، ونظام تهوية مُصمّم ليعمل مع نسائم الرباط الأطلسية لا ضدّها. النتيجة ملعب يبدو مفتوحاً وهوائياً رغم هيكل سقفه المغلق.",
      ],
      fr: [
        "La rénovation de 2023 a transformé le Prince Moulay Abdellah d'un vieux terrain polyvalent en un stade de football moderne conçu sur mesure. Une toiture à 360 degrés protège désormais chaque siège de la pluie et du vent tout en renvoyant le bruit de la foule vers le terrain. La piste d'athlétisme qui créait auparavant une distance entre les supporters et les joueurs a été supprimée, et les tribunes se pressent désormais près de la ligne de touche dans une configuration qui maximise l'ambiance.",
        "Le design privilégie des lignes épurées et modernes qui reflètent l'identité de Rabat comme capitale contemporaine. L'extérieur est habillé d'un matériau pâle et lumineux qui capte la lumière atlantique, et la cuvette intérieure utilise une configuration à deux niveaux qui rapproche autant que possible la tribune supérieure de l'action. Les nouvelles suites d'hospitalité, les installations médias et l'infrastructure de diffusion répondent aux dernières normes FIFA.",
        "Les caractéristiques de durabilité comprennent un éclairage LED qui réduit la consommation d'énergie de 40 pour cent par rapport aux systèmes traditionnels, une infrastructure de recyclage de l'eau pour l'entretien de la pelouse, et un système de ventilation conçu pour travailler avec les brises atlantiques de Rabat plutôt que contre elles. Le résultat est un stade qui semble ouvert et aéré malgré sa structure de toit fermée.",
      ],
    },
    matchday: {
      en: [
        { label: 'Atmosphere & Capacity', detail: 'Full 68,000 for semi-finals and the third-place match. The enclosed roof traps sound and creates an intense, reverberating atmosphere even with Atlantic breezes.' },
        { label: 'VIP & Hospitality', detail: 'Expanded hospitality wing with six private suites, a presidential box, two corporate lounges, and 4,000 premium seats with waiter service.' },
        { label: 'Fan Zones', detail: "Hay Ryad's wide boulevards and parks provide natural fan gathering areas. A dedicated fan zone along Avenue Mohammed VI will feature screens and entertainment." },
        { label: 'Food & Drink', detail: "Over 150 concession points serving Moroccan and international cuisine. Rabat is famous for its pastilla and seafood, and local vendors will bring the city's culinary identity inside the stadium." },
      ],
      ar: [
        { label: 'الأجواء والسعة', detail: 'السعة الكاملة 68,000 لأدوار نصف النهائي ومباراة المركز الثالث. يحبس السقف المغلق الصوت ويخلق أجواء مكثّفة ومدوّية حتى مع نسائم الأطلسي.' },
        { label: 'كبار الشخصيات والضيافة', detail: 'جناح ضيافة موسّع بستة أجنحة خاصة، ومقصورة رئاسية، وصالتَي شركات، و4,000 مقعد مميز مع خدمة نادلين.' },
        { label: 'مناطق المشجعين', detail: 'توفّر شوارع حي الرياض الواسعة وحدائقه أماكن تجمّع طبيعية للمشجعين. ستضم منطقة مشجعين مخصصة على طول شارع محمد السادس شاشات وترفيهاً.' },
        { label: 'الطعام والشراب', detail: 'أكثر من 150 نقطة بيع تقدم المأكولات المغربية والعالمية. تشتهر الرباط بالبسطيلة والمأكولات البحرية، وسيجلب الباعة المحليون هوية المدينة الطهوية إلى داخل الملعب.' },
      ],
      fr: [
        { label: 'Ambiance & capacité', detail: '68 000 places pleines pour les demi-finales et le match pour la troisième place. Le toit fermé piège le son et crée une ambiance intense et résonnante même avec les brises atlantiques.' },
        { label: 'VIP & hospitalité', detail: "Aile hospitalité élargie avec six suites privées, une loge présidentielle, deux salons d'affaires et 4 000 places premium avec service à table." },
        { label: 'Zones de supporters', detail: "Les larges boulevards et les parcs de Hay Ryad offrent des aires de rassemblement naturelles. Une zone de supporters dédiée le long de l'avenue Mohammed VI proposera écrans et animations." },
        { label: 'Restauration', detail: "Plus de 150 points de restauration servant une cuisine marocaine et internationale. Rabat est réputée pour sa pastilla et ses fruits de mer, et les vendeurs locaux apporteront l'identité culinaire de la ville à l'intérieur du stade." },
      ],
    },
    gettingThere: {
      en: [
        { mode: 'Distance', detail: '6 km from Rabat city centre (Hay Ryad district)' },
        { mode: 'By Taxi', detail: 'Approximately 30-50 MAD ($3-5) from central Rabat, 15 min ride' },
        { mode: 'By Tram', detail: 'Rabat-Sale tram Line 2 connects the city centre directly to Hay Ryad. Frequent service on match days.' },
        { mode: 'By Train', detail: 'Al Boraq from Casablanca (34 min), from Tangier (90 min). Rabat Agdal station is closest.' },
        { mode: 'Parking', detail: 'Multi-storey parking within the Hay Ryad district. Limited on match days; public transport strongly recommended.' },
      ],
      ar: [
        { mode: 'المسافة', detail: '6 كم من وسط الرباط (حي الرياض)' },
        { mode: 'بسيارة أجرة', detail: 'نحو 30-50 درهماً (3-5 دولارات) من وسط الرباط، 15 دقيقة ركوب' },
        { mode: 'بالترامواي', detail: 'يربط الخط 2 لترامواي الرباط-سلا وسط المدينة مباشرة بحي الرياض. خدمة متواترة في أيام المباريات.' },
        { mode: 'بالقطار', detail: 'البراق من الدار البيضاء (34 دقيقة)، ومن طنجة (90 دقيقة). محطة الرباط أكدال هي الأقرب.' },
        { mode: 'مواقف السيارات', detail: 'مواقف متعددة الطوابق داخل حي الرياض. محدودة في أيام المباريات؛ يُنصح بشدّة باستخدام النقل العام.' },
      ],
      fr: [
        { mode: 'Distance', detail: '6 km du centre de Rabat (quartier de Hay Ryad)' },
        { mode: 'En taxi', detail: 'Environ 30-50 MAD (3-5 $) depuis le centre de Rabat, 15 min de trajet' },
        { mode: 'En tramway', detail: 'La ligne 2 du tramway Rabat-Salé relie directement le centre-ville à Hay Ryad. Service fréquent les jours de match.' },
        { mode: 'En train', detail: 'Al Boraq depuis Casablanca (34 min), depuis Tanger (90 min). La gare de Rabat-Agdal est la plus proche.' },
        { mode: 'Stationnement', detail: 'Parkings à plusieurs niveaux dans le quartier de Hay Ryad. Limités les jours de match ; les transports publics sont fortement recommandés.' },
      ],
    },
    matchSchedule: {
      en: 'Group Stage, Round of 32, Round of 16, Semi-final, Third-place Match',
      ar: 'دور المجموعات، دور الـ32، دور الـ16، نصف النهائي، مباراة المركز الثالث',
      fr: 'Phase de groupes, seizièmes, huitièmes, demi-finale, match pour la troisième place',
    },
  },

  /* ═══════════════════════════════════════════════════════════════
     3. GRAND STADE DE MARRAKECH
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: 'grand-stade-marrakech',
    name: 'Grand Stade de Marrakech',
    city: { en: 'Marrakech', ar: 'مراكش', fr: 'Marrakech' },
    capacity: '65,000',
    capacityNote: {
      en: 'Expanded from 45,000',
      ar: 'بعد توسعة من 45,000',
      fr: 'Agrandi depuis 45 000',
    },
    status: 'construction',
    badge: {
      en: 'QUARTER-FINAL VENUE',
      ar: 'ملعب ربع النهائي',
      fr: 'ENCEINTE DE QUART DE FINALE',
    },
    accent: 'var(--gold)',
    badgeColor: 'var(--gold)',
    venueId: 1107,
    geo: { latitude: 31.6640, longitude: -8.0530 },
    addressLocality: 'Route de Casablanca, Marrakech',
    facts: {
      en: [
        { label: 'Architect', value: 'Gregotti Associati (original), expansion TBC' },
        { label: 'Budget', value: '$350 million (expansion)' },
        { label: 'Club Tenant', value: 'Kawkab Marrakech' },
        { label: 'Location', value: 'Route de Casablanca, 12 km from city centre' },
        { label: 'Surface', value: 'Natural grass' },
        { label: 'Expected Completion', value: '2028 (expansion started 2025)' },
      ],
      ar: [
        { label: 'المهندس المعماري', value: 'Gregotti Associati (الأصلي)، التوسعة قيد التحديد' },
        { label: 'الميزانية', value: '350 مليون دولار (التوسعة)' },
        { label: 'النادي المقيم', value: 'الكوكب المراكشي' },
        { label: 'الموقع', value: 'طريق الدار البيضاء، 12 كم من وسط المدينة' },
        { label: 'أرضية الملعب', value: 'عشب طبيعي' },
        { label: 'الإنجاز المتوقع', value: '2028 (بدأت التوسعة 2025)' },
      ],
      fr: [
        { label: 'Architecte', value: 'Gregotti Associati (original), extension à confirmer' },
        { label: 'Budget', value: '350 millions $ (extension)' },
        { label: 'Club résident', value: 'Kawkab Marrakech' },
        { label: 'Emplacement', value: 'Route de Casablanca, 12 km du centre-ville' },
        { label: 'Pelouse', value: 'Gazon naturel' },
        { label: 'Achèvement prévu', value: '2028 (extension démarrée 2025)' },
      ],
    },
    story: {
      en: [
        "No city in Morocco will generate more conversation during the 2030 World Cup than Marrakech. Not because of its stadium, though the Grand Stade de Marrakech is a genuinely fine venue, but because of the city that surrounds it. Marrakech is Morocco's most visited destination, the city that has introduced millions of international travellers to the country's warmth, its extraordinary food, its labyrinthine medina, and the particular magic that descends on the Jemaa el-Fnaa square as the sun sets and the storytellers, musicians, and food vendors reclaim the space.",
        "The stadium itself, originally opened in 2011, was designed by Italian practice Gregotti Associati in collaboration with Moroccan architects. It was built to evoke the ochre walls and fortress-like solidity of the city's architecture, with thick walls, high elements, and earthy tones ranging from terracotta to deep amber. From the outside it reads as monumental, almost defensive, which is entirely appropriate for a city that has been walled since the 12th century Almoravid dynasty.",
        "Now undergoing a major expansion that began in 2025, the Grand Stade de Marrakech will grow from 45,000 to 65,000 seats. The expansion adds a complete new upper tier, significantly upgraded cooling systems to combat Marrakech's intense summer heat, modernised hospitality facilities, and enhanced accessibility throughout. The athletics track has been permanently removed to bring the stands directly to the pitch, transforming the matchday experience.",
        "The venue has already earned serious tournament credentials. It hosted back-to-back FIFA Club World Cup finals in 2013 and 2014, and AFCON 2025 quarter-finals followed. By 2030, it will be one of Africa's most experienced major tournament stadiums. Expect Marrakech's games to sell out first. The combination of high-level football with the world's most photogenic host city will be irresistible.",
      ],
      ar: [
        "لن تُثير أي مدينة في المغرب نقاشاً أكثر من مراكش خلال كأس العالم 2030. ليس بسبب ملعبها، رغم أن ملعب مراكش الكبير صرح متميز فعلاً، بل بسبب المدينة التي تحيط به. مراكش هي الوجهة الأكثر زيارة في المغرب، المدينة التي عرّفت ملايين المسافرين الدوليين بدفء البلد، وطعامه الاستثنائي، ومدينته العتيقة المتاهية، والسحر الخاص الذي يهبط على ساحة جامع الفنا مع غروب الشمس حين يستعيد الرواة والموسيقيون وباعة الطعام المكان.",
        "أما الملعب نفسه، الذي افتُتح أصلاً في 2011، فقد صممه المكتب الإيطالي Gregotti Associati بالتعاون مع معماريين مغاربة. بُني ليستحضر الجدران الترابية والصلابة الشبيهة بالقلاع لعمارة المدينة، بجدران سميكة وعناصر عالية وألوان ترابية تتراوح من الطوب الأحمر إلى العنبر العميق. من الخارج، يبدو فخماً ودفاعياً تقريباً، وهذا يناسب تماماً مدينة مُسوَّرة منذ القرن الثاني عشر على يد المرابطين.",
        "يخضع الملعب الآن لتوسيع كبير بدأ في 2025، سيرتفع به من 45,000 إلى 65,000 مقعد. تضيف التوسعة طبقة علوية جديدة كاملة، وأنظمة تبريد محسّنة بشكل جذري لمواجهة حرّ مراكش الصيفي القاسي، ومرافق ضيافة عصرية، وسهولة وصول معزّزة في كل مكان. أُزيل المضمار نهائياً لتقريب المدرجات من أرضية الملعب، مما يغيّر تجربة يوم المباراة.",
        "سبق أن حاز الملعب على اعتماد بطولات جادة. استضاف نهائيَيْن متتاليَيْن لكأس العالم للأندية في 2013 و2014، ثم تبعت ذلك أرباع نهائي كأس أفريقيا 2025. بحلول 2030، سيكون واحداً من أكثر ملاعب البطولات الكبرى خبرة في أفريقيا. توقّع أن تُباع تذاكر مباريات مراكش أولاً. مزيج كرة القدم الرفيعة مع مدينة المضيف الأكثر جاذبية للعدسة في العالم سيكون عصياً على المقاومة.",
      ],
      fr: [
        "Aucune ville du Maroc ne fera plus parler d'elle que Marrakech durant la Coupe du Monde 2030. Non pas pour son stade, bien que le Grand Stade de Marrakech soit une enceinte véritablement remarquable, mais pour la ville qui l'entoure. Marrakech est la destination la plus visitée du Maroc, la ville qui a fait découvrir à des millions de voyageurs internationaux la chaleur du pays, sa gastronomie extraordinaire, sa médina labyrinthique et la magie particulière qui descend sur la place Jemaa el-Fnaa au coucher du soleil, quand conteurs, musiciens et marchands ambulants reprennent possession des lieux.",
        "Le stade lui-même, inauguré en 2011, a été conçu par le cabinet italien Gregotti Associati en collaboration avec des architectes marocains. Il a été bâti pour évoquer les murs ocre et la solidité de forteresse de l'architecture de la ville, avec des murs épais, des éléments élevés et des tons terreux allant de la terracotta à l'ambre profond. De l'extérieur, il apparaît monumental, presque défensif, ce qui convient parfaitement à une ville enceinte de remparts depuis la dynastie almoravide du XIIe siècle.",
        "Le Grand Stade de Marrakech est actuellement en pleine expansion, lancée en 2025, qui le fera passer de 45 000 à 65 000 places. L'extension ajoute un niveau supérieur entièrement nouveau, des systèmes de refroidissement considérablement améliorés pour combattre la chaleur estivale intense de Marrakech, des installations d'hospitalité modernisées et une accessibilité renforcée dans tout l'ensemble. La piste d'athlétisme a été définitivement supprimée pour rapprocher les tribunes du terrain, transformant l'expérience du jour de match.",
        "L'enceinte a déjà acquis de sérieuses lettres de noblesse en matière de tournois. Elle a accueilli deux finales consécutives de la Coupe du Monde des Clubs en 2013 et 2014, puis les quarts de finale de la CAN 2025. D'ici 2030, elle sera l'un des stades de grand tournoi les plus expérimentés d'Afrique. Attendez-vous à ce que les matchs de Marrakech soient les premiers à afficher complet. La combinaison d'un football de haut niveau avec la ville hôte la plus photogénique au monde sera irrésistible.",
      ],
    },
    architecture: {
      en: [
        "The original Gregotti design drew heavily on Marrakech's architectural DNA. The stadium's exterior walls are finished in a warm, sandy render that deliberately echoes the city's famous ramparts, while geometric patterning in the facade references the intricate stucco work found in Marrakech's palaces and riads. The overall effect is a building that feels rooted in its city rather than dropped from a globalised architectural catalogue.",
        "The expansion, while respecting the original design language, introduces contemporary elements. The new upper tier features a lightweight steel-and-membrane roof that provides shade for every seat, a critical upgrade given that Marrakech regularly sees temperatures above 40 degrees Celsius in summer. Passive cooling channels built into the structure draw air from shaded external areas and circulate it through the seating bowl, reducing perceived temperatures by several degrees.",
        "Enhanced sustainability measures include solar panels on the roof structure, greywater recycling for pitch irrigation, and LED lighting throughout. The expansion also adds a new western entrance plaza with landscaped gardens and water features inspired by the great Saadian-era gardens of Marrakech, creating a welcoming gathering space for fans before and after matches.",
      ],
      ar: [
        "استند تصميم Gregotti الأصلي بقوة إلى الحمض النووي المعماري لمراكش. جدران الملعب الخارجية مكسوّة بطلاء ترابي دافئ يعكس عمداً أسوار المدينة الشهيرة، فيما يرجع النقش الهندسي على الواجهة إلى أعمال الجبس المتقنة الموجودة في قصور مراكش ورياضاتها. التأثير العام مبنى يبدو متجذراً في مدينته بدل أن يكون قد أُسقط من كتالوج معماري معولم.",
        "تحترم التوسعة لغة التصميم الأصلية، لكنها تُدخل عناصر معاصرة. تتميز الطبقة العلوية الجديدة بسقف خفيف من الفولاذ والغشاء يوفر الظل لكل مقعد، وهو تحسين حاسم نظراً لأن حرارة مراكش تتجاوز بانتظام 40 درجة مئوية في الصيف. قنوات تبريد سلبية مدمجة في الهيكل تسحب الهواء من المناطق الخارجية المظلّلة وتدوّره عبر الحوض المقعدي، فتقلّل درجات الحرارة المحسوسة بعدة درجات.",
        "تشمل تدابير الاستدامة المعزّزة ألواحاً شمسية على هيكل السقف، وإعادة تدوير المياه الرمادية لريّ أرضية الملعب، وإضاءة LED في كل المرافق. تضيف التوسعة أيضاً ساحة مدخل غربية جديدة بحدائق منسقة ومعالم مائية مستوحاة من حدائق العصر السعدي الكبرى في مراكش، ما يخلق مساحة تجمّع مرحّبة للمشجعين قبل المباريات وبعدها.",
      ],
      fr: [
        "La conception originale de Gregotti puisait abondamment dans l'ADN architectural de Marrakech. Les murs extérieurs du stade sont finis d'un enduit chaud et sablé qui fait délibérément écho aux célèbres remparts de la ville, tandis que les motifs géométriques de la façade renvoient au travail de stuc élaboré que l'on retrouve dans les palais et les riads de Marrakech. L'effet d'ensemble est celui d'un bâtiment qui semble ancré dans sa ville plutôt que parachuté d'un catalogue architectural mondialisé.",
        "L'extension, tout en respectant le langage de conception original, introduit des éléments contemporains. Le nouveau niveau supérieur est doté d'une toiture légère en acier et membrane qui procure de l'ombre à chaque siège, une amélioration critique étant donné que Marrakech dépasse régulièrement 40 degrés Celsius en été. Des canaux de refroidissement passif intégrés à la structure aspirent l'air des zones extérieures ombragées et le font circuler à travers la cuvette des gradins, réduisant de plusieurs degrés les températures ressenties.",
        "Les mesures de durabilité renforcée comprennent des panneaux solaires sur la structure du toit, le recyclage des eaux grises pour l'irrigation de la pelouse, et l'éclairage LED partout. L'extension ajoute également une nouvelle esplanade d'entrée ouest avec des jardins paysagers et des plans d'eau inspirés des grands jardins de l'époque saadienne de Marrakech, créant un espace de rassemblement accueillant pour les supporters avant et après les matchs.",
      ],
    },
    matchday: {
      en: [
        { label: 'Atmosphere & Capacity', detail: "Full 65,000 capacity for knockout rounds. Kawkab Marrakech's ultras are among Morocco's most passionate supporters, and the tight bowl amplifies every chant." },
        { label: 'VIP & Hospitality', detail: 'New hospitality wing with eight corporate suites, a rooftop terrace lounge with Atlas Mountain views, and 3,500 premium seats.' },
        { label: 'Fan Zones', detail: "Jemaa el-Fnaa square will serve as the city's unofficial fan zone, alive with screens, music, and food stalls. Dedicated zones near the stadium with entertainment." },
        { label: 'Food & Drink', detail: "Marrakech is Morocco's food capital. Expect tagine, tanjia (the city's signature slow-cooked dish), freshly baked msemen, and mint tea alongside international concessions." },
      ],
      ar: [
        { label: 'الأجواء والسعة', detail: 'السعة الكاملة 65,000 للأدوار الإقصائية. ألتراس الكوكب المراكشي من أكثر مشجعي المغرب حماسة، والحوض الضيق يضخّم كل هتاف.' },
        { label: 'كبار الشخصيات والضيافة', detail: 'جناح ضيافة جديد بثمانية أجنحة شركات، وصالون مسقوف بإطلالة على جبال الأطلس، و3,500 مقعد مميز.' },
        { label: 'مناطق المشجعين', detail: 'ستكون ساحة جامع الفنا منطقة المشجعين غير الرسمية للمدينة، نابضة بالشاشات والموسيقى وأكشاك الطعام. مناطق مخصصة بالقرب من الملعب مع ترفيه.' },
        { label: 'الطعام والشراب', detail: 'مراكش هي عاصمة الطعام في المغرب. توقّع الطاجين والطنجية (الطبق التقليدي المميز للمدينة) والمسمّن الطازج وأتاي النعناع إلى جانب خيارات عالمية.' },
      ],
      fr: [
        { label: 'Ambiance & capacité', detail: "65 000 places pleines pour les tours à élimination directe. Les ultras du Kawkab Marrakech comptent parmi les supporters les plus passionnés du Maroc, et la cuvette resserrée amplifie chaque chant." },
        { label: 'VIP & hospitalité', detail: "Nouvelle aile hospitalité avec huit suites d'entreprise, un salon-terrasse avec vue sur les montagnes de l'Atlas et 3 500 places premium." },
        { label: 'Zones de supporters', detail: "La place Jemaa el-Fnaa servira de zone de supporters officieuse de la ville, animée d'écrans, de musique et d'étals gastronomiques. Zones dédiées près du stade avec animations." },
        { label: 'Restauration', detail: "Marrakech est la capitale gastronomique du Maroc. Attendez-vous au tajine, à la tanjia (le plat signature mijoté de la ville), au msemen fraîchement préparé et au thé à la menthe aux côtés des options internationales." },
      ],
    },
    gettingThere: {
      en: [
        { mode: 'Distance', detail: '12 km from the medina, Route de Casablanca' },
        { mode: 'By Taxi', detail: 'Approximately 80-120 MAD ($8-12) from the medina, 20-30 min' },
        { mode: 'By Bus/Shuttle', detail: 'Tournament shuttle buses from medina, Gueliz, and Menara Airport on match days' },
        { mode: 'By Train', detail: 'Al Boraq high-speed extension to Marrakech expected by 2028. Current conventional train from Casablanca takes 3.5 hrs.' },
        { mode: 'Parking', detail: 'Expanded parking facilities with 8,000 spaces adjacent to the stadium. Park-and-ride from city outskirts recommended.' },
      ],
      ar: [
        { mode: 'المسافة', detail: '12 كم من المدينة العتيقة، طريق الدار البيضاء' },
        { mode: 'بسيارة أجرة', detail: 'نحو 80-120 درهماً (8-12 دولاراً) من المدينة العتيقة، 20-30 دقيقة' },
        { mode: 'بالحافلة/النقل المكوكي', detail: 'حافلات نقل البطولة المكوكية من المدينة العتيقة وكليز ومطار المنارة في أيام المباريات' },
        { mode: 'بالقطار', detail: 'امتداد البراق السريع إلى مراكش متوقع بحلول 2028. القطار التقليدي الحالي من الدار البيضاء يستغرق 3.5 ساعات.' },
        { mode: 'مواقف السيارات', detail: 'مرافق مواقف موسّعة بسعة 8,000 مكان بجوار الملعب. يُنصح بالاصطفاف والركوب من أطراف المدينة.' },
      ],
      fr: [
        { mode: 'Distance', detail: '12 km de la médina, Route de Casablanca' },
        { mode: 'En taxi', detail: 'Environ 80-120 MAD (8-12 $) depuis la médina, 20-30 min' },
        { mode: 'En bus/navette', detail: "Bus-navettes du tournoi depuis la médina, Guéliz et l'aéroport Ménara les jours de match" },
        { mode: 'En train', detail: "Extension Al Boraq à grande vitesse jusqu'à Marrakech prévue d'ici 2028. Le train conventionnel actuel depuis Casablanca prend 3h30." },
        { mode: 'Stationnement', detail: 'Installations de stationnement élargies avec 8 000 places adjacentes au stade. Parcs relais depuis la périphérie recommandés.' },
      ],
    },
    matchSchedule: {
      en: 'Group Stage, Round of 32, Quarter-final',
      ar: 'دور المجموعات، دور الـ32، ربع النهائي',
      fr: 'Phase de groupes, seizièmes, quart de finale',
    },
  },

  /* ═══════════════════════════════════════════════════════════════
     4. IBN BATOUTA STADIUM — Tangier
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: 'ibn-batouta-stadium',
    name: 'Ibn Batouta Stadium',
    city: { en: 'Tangier', ar: 'طنجة', fr: 'Tanger' },
    capacity: '77,000',
    capacityNote: {
      en: 'Expanded from 45,000',
      ar: 'بعد توسعة من 45,000',
      fr: 'Agrandi depuis 45 000',
    },
    status: 'construction',
    badge: {
      en: 'GATEWAY TO EUROPE',
      ar: 'بوابة أوروبا',
      fr: "PORTE DE L'EUROPE",
    },
    accent: 'var(--red)',
    badgeColor: 'var(--red)',
    venueId: 1106,
    geo: { latitude: 35.7300, longitude: -5.8470 },
    addressLocality: 'Route de Tetouan, Tangier',
    facts: {
      en: [
        { label: 'Architect', value: 'Populous (expansion design)' },
        { label: 'Budget', value: '$450 million' },
        { label: 'Club Tenant', value: 'Ittihad Tanger' },
        { label: 'Location', value: 'Route de Tetouan, Tangier' },
        { label: 'Surface', value: 'Natural grass' },
        { label: 'Expected Completion', value: '2028 (expansion started 2024)' },
      ],
      ar: [
        { label: 'المهندس المعماري', value: 'Populous (تصميم التوسعة)' },
        { label: 'الميزانية', value: '450 مليون دولار' },
        { label: 'النادي المقيم', value: 'اتحاد طنجة' },
        { label: 'الموقع', value: 'طريق تطوان، طنجة' },
        { label: 'أرضية الملعب', value: 'عشب طبيعي' },
        { label: 'الإنجاز المتوقع', value: '2028 (بدأت التوسعة 2024)' },
      ],
      fr: [
        { label: 'Architecte', value: "Populous (conception de l'extension)" },
        { label: 'Budget', value: '450 millions $' },
        { label: 'Club résident', value: 'Ittihad Tanger' },
        { label: 'Emplacement', value: 'Route de Tétouan, Tanger' },
        { label: 'Pelouse', value: 'Gazon naturel' },
        { label: 'Achèvement prévu', value: '2028 (extension démarrée 2024)' },
      ],
    },
    story: {
      en: [
        "Named after the greatest traveller of the medieval Islamic world, the 14th-century Moroccan explorer Ibn Battuta, who was born in Tangier and covered more than 117,000 kilometres across Africa, the Middle East, Central Asia, South Asia, and China, the Ibn Batouta Stadium carries the spirit of its city's extraordinary history. Tangier has always been a city of crossings, of cultures, of languages, and of restless, outward-looking ambition.",
        "Tangier is Morocco's most European city. Perched at the northern tip of the African continent, staring across the Strait of Gibraltar at the Spanish coastline just 14 kilometres away, it occupies one of the most strategically significant positions on earth. In the 20th century it was an international zone governed by multiple powers simultaneously, and its peculiar cosmopolitan status attracted writers and adventurers. That energy, literary and slightly bohemian, never entirely left.",
        "The stadium, originally built with a capacity of 45,000, is undergoing a dramatic expansion that began in 2024 and will lift it to 77,000 seats by 2028. The expansion, designed by global stadium specialists Populous, adds an entirely new upper tier and a sweeping roof structure that will transform the venue from a solid but unremarkable regional ground into one of Africa's most impressive arenas. Spain is a ferry crossing away. Fans arriving from Europe could watch a match in Tangier and be back in Madrid or Seville for dinner the following night.",
        "In 2023, the stadium hosted Morocco's emphatic 4-2 friendly victory over Brazil, a result that captured the confidence and footballing intelligence of Walid Regragui's team. That night in Tangier announced Morocco's arrival as a genuine World Cup contender. In 2030, the city will announce Morocco's arrival as a World Cup host. The proximity to Europe makes Tangier the most accessible World Cup venue for the estimated millions of European fans expected to attend.",
      ],
      ar: [
        "سُمّي الملعب على اسم أعظم رحّالة في العالم الإسلامي في العصور الوسطى، المستكشف المغربي في القرن الرابع عشر ابن بطوطة الذي وُلد في طنجة وقطع أكثر من 117,000 كيلومتر عبر أفريقيا والشرق الأوسط وآسيا الوسطى وجنوب آسيا والصين. يحمل ملعب ابن بطوطة روح التاريخ الاستثنائي لمدينته. كانت طنجة دائماً مدينة العبور والثقافات واللغات والطموح المتطلّع إلى الخارج الذي لا يهدأ.",
        "طنجة هي أكثر مدن المغرب أوروبية. تقع في الطرف الشمالي للقارة الأفريقية، تحدّق عبر مضيق جبل طارق نحو الساحل الإسباني على بعد 14 كيلومتراً فقط، وتحتل أحد أكثر المواقع أهمية استراتيجية على الأرض. في القرن العشرين كانت منطقة دولية تحكمها قوى متعددة في آن واحد، وجذبت حالتها الكوزموبوليتية الغريبة كتّاباً ومغامرين. تلك الطاقة، الأدبية والبوهيمية قليلاً، لم تغادرها كلياً قط.",
        "يخضع الملعب، الذي بُني أصلاً بسعة 45,000 مقعد، لتوسّع كبير بدأ في 2024 وسيرفعه إلى 77,000 مقعد بحلول 2028. تضيف التوسعة، التي صمّمها متخصّصو الملاعب العالميون Populous، طبقة علوية جديدة كاملة وهيكل سقف منحنٍ سيحوّل الصرح من أرضية إقليمية متينة لكن عادية إلى واحدة من أكثر الحلبات إثارة للإعجاب في أفريقيا. إسبانيا على بعد عبور عبّارة. يمكن للمشجعين القادمين من أوروبا مشاهدة مباراة في طنجة والعودة إلى مدريد أو إشبيلية لتناول العشاء في الليلة التالية.",
        "في 2023، استضاف الملعب فوز المغرب المدوّي 4-2 على البرازيل في مباراة ودية، وهي نتيجة جسّدت ثقة ووعي منتخب وليد الركراكي الكروي. أعلنت تلك الليلة في طنجة وصول المغرب كمرشّح حقيقي لكأس العالم. وفي 2030، ستعلن المدينة وصول المغرب كمضيف لكأس العالم. يجعل قربها من أوروبا طنجة أكثر ملاعب كأس العالم إمكانية للوصول لملايين المشجعين الأوروبيين المتوقّعين.",
      ],
      fr: [
        "Nommé d'après le plus grand voyageur du monde islamique médiéval, l'explorateur marocain du XIVe siècle Ibn Battuta, né à Tanger et qui a parcouru plus de 117 000 kilomètres à travers l'Afrique, le Moyen-Orient, l'Asie centrale, l'Asie du Sud et la Chine, le stade Ibn Batouta porte l'esprit de l'histoire extraordinaire de sa ville. Tanger a toujours été une ville de passages, de cultures, de langues et d'ambition inquiète tournée vers l'extérieur.",
        "Tanger est la ville la plus européenne du Maroc. Perchée à la pointe nord du continent africain, fixant la côte espagnole à seulement 14 kilomètres à travers le détroit de Gibraltar, elle occupe l'une des positions les plus stratégiquement significatives au monde. Au XXe siècle, elle fut une zone internationale gouvernée simultanément par plusieurs puissances, et son statut cosmopolite particulier attirait écrivains et aventuriers. Cette énergie, littéraire et légèrement bohème, ne l'a jamais entièrement quittée.",
        "Le stade, initialement construit avec une capacité de 45 000 places, fait l'objet d'une extension spectaculaire lancée en 2024 qui le portera à 77 000 places d'ici 2028. L'extension, conçue par les spécialistes mondiaux des stades Populous, ajoute un niveau supérieur entièrement nouveau et une toiture imposante qui transformeront l'enceinte d'un terrain régional solide mais sans éclat en l'une des arènes les plus impressionnantes d'Afrique. L'Espagne est à une traversée en ferry. Des supporters venus d'Europe pourraient regarder un match à Tanger et rentrer à Madrid ou Séville pour le dîner du lendemain.",
        "En 2023, le stade a accueilli la victoire éclatante 4-2 du Maroc contre le Brésil en match amical, un résultat qui a capturé la confiance et l'intelligence footballistique de l'équipe de Walid Regragui. Cette soirée à Tanger a annoncé l'arrivée du Maroc comme véritable prétendant à la Coupe du Monde. En 2030, la ville annoncera l'arrivée du Maroc comme pays hôte de la Coupe du Monde. Sa proximité avec l'Europe fait de Tanger le site de Coupe du Monde le plus accessible pour les millions de supporters européens attendus.",
      ],
    },
    architecture: {
      en: [
        "The expansion design by Populous introduces a dramatic new roof structure inspired by the sails of the ships that have crossed the Strait of Gibraltar for millennia. The lightweight tensile membrane canopy arcs above the stadium in sweeping curves, providing full coverage for the expanded 77,000 seats while allowing coastal breezes to circulate through the seating bowl. On clear days, spectators in the upper tier will enjoy views of the Mediterranean and, on the horizon, the outline of Spain.",
        "The new second tier is constructed in steel and precast concrete, designed to withstand Tangier's occasionally fierce Atlantic winds while maintaining an open, airy character. The exterior cladding uses perforated metal panels in shades of blue and white that reference Tangier's coastal identity and the whitewashed walls of the old medina. At night, integrated LED lighting transforms the exterior into a luminous beacon visible from the strait.",
        "Sustainability is a priority. The stadium's orientation has been optimised to take advantage of prevailing winds for natural ventilation, reducing energy costs. Photovoltaic panels integrated into the roof contribute to the venue's energy needs, and a comprehensive waste management system targets zero-landfill match-day operations. The surrounding landscape incorporates native Mediterranean planting that requires minimal irrigation.",
      ],
      ar: [
        "يُدخل تصميم Populous للتوسعة هيكل سقف جديداً مثيراً مستوحى من أشرعة السفن التي عبرت مضيق جبل طارق منذ آلاف السنين. تنحني المظلة الغشائية الخفيفة فوق الملعب بخطوط منحنية، وتوفر تغطية كاملة للمقاعد الموسّعة البالغة 77,000 فيما تسمح للنسائم الساحلية بالتدفق عبر حوض الجلوس. في الأيام الصافية، سيستمتع المتفرجون في الطبقة العلوية بمناظر البحر الأبيض المتوسط، وعند الأفق، معالم إسبانيا.",
        "الطبقة الثانية الجديدة مبنيّة من الفولاذ والخرسانة مسبقة الصبّ، صُمّمت لتصمد أمام رياح طنجة الأطلسية العنيفة أحياناً مع الحفاظ على طابع مفتوح وهوائي. تستخدم الكسوة الخارجية ألواحاً معدنية مثقّبة بدرجات الأزرق والأبيض التي تشير إلى هوية طنجة الساحلية والجدران المبيضة في المدينة القديمة. في الليل، تحوّل إضاءة LED المدمجة الواجهة الخارجية إلى منارة مضيئة تُرى من المضيق.",
        "الاستدامة أولوية. جرى تحسين توجيه الملعب للاستفادة من الرياح السائدة للتهوية الطبيعية، مما يقلّل تكاليف الطاقة. الألواح الكهروضوئية المدمجة في السقف تساهم في احتياجات الصرح من الطاقة، ويستهدف نظام شامل لإدارة النفايات عمليات يوم المباراة بدون نفايات مُدفّنة. تضم المناظر الطبيعية المحيطة نباتات متوسطية أصيلة تتطلب حدّاً أدنى من الريّ.",
      ],
      fr: [
        "La conception de l'extension par Populous introduit une nouvelle toiture spectaculaire inspirée des voiles des navires qui traversent le détroit de Gibraltar depuis des millénaires. La canopée membranaire légère s'arque au-dessus du stade en courbes amples, offrant une couverture complète aux 77 000 places élargies tout en laissant les brises côtières circuler dans la cuvette. Les jours clairs, les spectateurs du niveau supérieur profiteront de vues sur la Méditerranée et, à l'horizon, de la silhouette de l'Espagne.",
        "Le nouveau deuxième niveau est construit en acier et béton préfabriqué, conçu pour résister aux vents atlantiques parfois féroces de Tanger tout en conservant un caractère ouvert et aéré. Le bardage extérieur utilise des panneaux métalliques perforés dans des tons de bleu et de blanc qui renvoient à l'identité côtière de Tanger et aux murs blanchis à la chaux de la vieille médina. La nuit, un éclairage LED intégré transforme l'extérieur en un phare lumineux visible depuis le détroit.",
        "La durabilité est une priorité. L'orientation du stade a été optimisée pour tirer parti des vents dominants pour la ventilation naturelle, réduisant les coûts énergétiques. Les panneaux photovoltaïques intégrés au toit contribuent aux besoins énergétiques de l'enceinte, et un système complet de gestion des déchets vise des opérations de jour de match sans mise en décharge. Le paysage environnant intègre une végétation méditerranéenne locale nécessitant une irrigation minimale.",
      ],
    },
    matchday: {
      en: [
        { label: 'Atmosphere & Capacity', detail: "Full 77,000 for group stage and knockout matches. Tangier's fans are among the most vocal in Morocco, and the new roof will trap and amplify sound." },
        { label: 'VIP & Hospitality', detail: 'New hospitality level with ten corporate suites, a panoramic lounge with Strait of Gibraltar views, and 5,000 premium seats.' },
        { label: 'Fan Zones', detail: "The Corniche waterfront and the area around the Grand Socco will host fan festivals. Tangier's vibrant cafe culture makes the entire city a natural gathering point." },
        { label: 'Food & Drink', detail: "Tangier's cuisine blends Moroccan and Mediterranean influences. Expect fresh seafood, bocadillos, harira soup, and the city's famous mint tea at concession points." },
      ],
      ar: [
        { label: 'الأجواء والسعة', detail: 'السعة الكاملة 77,000 لمباريات دور المجموعات والأدوار الإقصائية. مشجعو طنجة من أكثر المشجعين صخباً في المغرب، والسقف الجديد سيحبس الصوت ويضخّمه.' },
        { label: 'كبار الشخصيات والضيافة', detail: 'مستوى ضيافة جديد بعشرة أجنحة شركات، وصالون بانورامي بإطلالة على مضيق جبل طارق، و5,000 مقعد مميز.' },
        { label: 'مناطق المشجعين', detail: 'ستستضيف واجهة الكورنيش البحرية والمنطقة المحيطة بالسوق الكبير احتفالات المشجعين. ثقافة مقاهي طنجة النابضة تجعل المدينة بأكملها نقطة تجمّع طبيعية.' },
        { label: 'الطعام والشراب', detail: 'يمزج مطبخ طنجة التأثيرات المغربية والمتوسطية. توقّع المأكولات البحرية الطازجة والبوكاديوس والحريرة وأتاي النعناع الشهير في المدينة في نقاط البيع.' },
      ],
      fr: [
        { label: 'Ambiance & capacité', detail: "77 000 places pleines pour les matchs de phase de groupes et à élimination directe. Les supporters de Tanger comptent parmi les plus vocaux du Maroc, et la nouvelle toiture piégera et amplifiera le son." },
        { label: 'VIP & hospitalité', detail: "Nouveau niveau d'hospitalité avec dix suites d'entreprise, un salon panoramique avec vue sur le détroit de Gibraltar et 5 000 places premium." },
        { label: 'Zones de supporters', detail: "Le front de mer de la Corniche et la zone autour du Grand Socco accueilleront des festivals de supporters. La culture des cafés vibrante de Tanger fait de la ville entière un point de rassemblement naturel." },
        { label: 'Restauration', detail: "La cuisine de Tanger mêle influences marocaines et méditerranéennes. Attendez-vous à des fruits de mer frais, des bocadillos, de la harira et le célèbre thé à la menthe de la ville dans les points de restauration." },
      ],
    },
    gettingThere: {
      en: [
        { mode: 'Distance', detail: 'Route de Tetouan, northern Tangier, close to Ibn Battuta Airport' },
        { mode: 'By Taxi', detail: 'Approximately 50-80 MAD ($5-8) from the city centre, 15-20 min' },
        { mode: 'By Train', detail: 'Al Boraq high-speed from Casablanca (2 hrs), from Rabat (90 min). Tanger-Ville station is well connected.' },
        { mode: 'By Ferry', detail: 'Ferries run to Tarifa and Algeciras in Spain throughout the day (35 min - 1 hr). Direct access from Europe.' },
        { mode: 'Parking', detail: 'Adjacent to Ibn Battuta Airport with large parking areas. Shuttle services from port and train station on match days.' },
      ],
      ar: [
        { mode: 'المسافة', detail: 'طريق تطوان، شمال طنجة، قرب مطار ابن بطوطة' },
        { mode: 'بسيارة أجرة', detail: 'نحو 50-80 درهماً (5-8 دولارات) من وسط المدينة، 15-20 دقيقة' },
        { mode: 'بالقطار', detail: 'البراق فائق السرعة من الدار البيضاء (ساعتان)، ومن الرباط (90 دقيقة). محطة طنجة المدينة متصلة جيداً.' },
        { mode: 'بالعبّارة', detail: 'تسير العبّارات إلى طريفة والجزيرة الخضراء في إسبانيا طوال اليوم (35 دقيقة - ساعة). وصول مباشر من أوروبا.' },
        { mode: 'مواقف السيارات', detail: 'بجوار مطار ابن بطوطة مع مناطق مواقف كبيرة. خدمات نقل مكوكي من الميناء ومحطة القطار في أيام المباريات.' },
      ],
      fr: [
        { mode: 'Distance', detail: "Route de Tétouan, nord de Tanger, à proximité de l'aéroport Ibn Battuta" },
        { mode: 'En taxi', detail: 'Environ 50-80 MAD (5-8 $) depuis le centre-ville, 15-20 min' },
        { mode: 'En train', detail: 'Al Boraq à grande vitesse depuis Casablanca (2 h), depuis Rabat (90 min). La gare de Tanger-Ville est bien desservie.' },
        { mode: 'En ferry', detail: 'Les ferries relient Tarifa et Algésiras en Espagne toute la journée (35 min - 1 h). Accès direct depuis l\'Europe.' },
        { mode: 'Stationnement', detail: "Adjacent à l'aéroport Ibn Battuta avec de vastes zones de stationnement. Services de navette depuis le port et la gare les jours de match." },
      ],
    },
    matchSchedule: {
      en: 'Group Stage, Round of 32',
      ar: 'دور المجموعات، دور الـ32',
      fr: 'Phase de groupes, seizièmes',
    },
  },

  /* ═══════════════════════════════════════════════════════════════
     5. GRAND STADE DE FES
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: 'grand-stade-fes',
    name: 'Grand Stade de Fes',
    city: { en: 'Fes', ar: 'فاس', fr: 'Fès' },
    capacity: '55,800',
    capacityNote: {
      en: 'Expanded from 45,000 (some sources cite 65,000 target)',
      ar: 'بعد توسعة من 45,000 (تشير بعض المصادر إلى 65,000 كهدف)',
      fr: 'Agrandi depuis 45 000 (certaines sources mentionnent un objectif de 65 000)',
    },
    status: 'construction',
    badge: {
      en: 'IMPERIAL CAPITAL',
      ar: 'العاصمة الإمبراطورية',
      fr: 'CAPITALE IMPÉRIALE',
    },
    accent: 'var(--green)',
    badgeColor: 'var(--green)',
    venueId: 2260,
    geo: { latitude: 34.0100, longitude: -4.9880 },
    addressLocality: "Route d'Immouzzer, Fes",
    facts: {
      en: [
        { label: 'Architect', value: 'TBC (Moroccan design consortium)' },
        { label: 'Budget', value: '$300 million' },
        { label: 'Club Tenant', value: 'MAS Fes & Wydad Fes' },
        { label: 'Location', value: "Route d'Immouzzer, southern Fes" },
        { label: 'Surface', value: 'Natural grass' },
        { label: 'Expected Completion', value: '2028 (expansion started 2025)' },
      ],
      ar: [
        { label: 'المهندس المعماري', value: 'قيد التحديد (تحالف تصميم مغربي)' },
        { label: 'الميزانية', value: '300 مليون دولار' },
        { label: 'النادي المقيم', value: 'المغرب الفاسي ووداد فاس' },
        { label: 'الموقع', value: 'طريق إيموزار، جنوب فاس' },
        { label: 'أرضية الملعب', value: 'عشب طبيعي' },
        { label: 'الإنجاز المتوقع', value: '2028 (بدأت التوسعة 2025)' },
      ],
      fr: [
        { label: 'Architecte', value: 'À confirmer (consortium de conception marocain)' },
        { label: 'Budget', value: '300 millions $' },
        { label: 'Club résident', value: 'MAS Fès & Wydad Fès' },
        { label: 'Emplacement', value: "Route d'Immouzzer, sud de Fès" },
        { label: 'Pelouse', value: 'Gazon naturel' },
        { label: 'Achèvement prévu', value: '2028 (extension démarrée 2025)' },
      ],
    },
    story: {
      en: [
        "If Casablanca is Morocco's economic heart and Rabat its political head, then Fes is its soul. Founded in the 9th century by Idris II, Fes is one of the world's oldest continuously inhabited cities. Its medina, the Fes el-Bali, is a UNESCO World Heritage Site of extraordinary density and complexity, a warren of 9,400 lanes and alleys that has functioned as a living city for over a millennium. The University of al-Qarawiyyin, founded in 859 AD and widely considered the oldest continuously operating university in the world, sits at its heart.",
        "Against this ancient backdrop, football arrives as something almost anachronistic, and yet the Grand Stade de Fes has been one of Morocco's most important venues for decades. The passionate supporters of MAS Fes and Wydad Fes fill the ground for derby matches with an intensity that rivals anything in the country. The expansion from 45,000 seats to approximately 55,800 is driven by Morocco's national stadium investment programme and the hosting requirements of the 2030 World Cup.",
        "Fes is the city where football feels most at odds with its surroundings, and that tension is precisely what makes it so compelling. To walk from the souks, the madrases, and the hammams of the medina to a World Cup stadium is to experience Morocco's duality at its most acute: a country simultaneously ancient and radically modern, traditional and fiercely ambitious. No other host city in the entire 2030 tournament offers that contrast so starkly.",
        "For visiting fans, Fes will demand more effort than Marrakech or Tangier. The medina is vast and deliberately difficult to navigate by anything other than your own feet and a willingness to get lost. But those who make the effort will find themselves in one of the most complete human environments anywhere on earth. The tanneries have been dyeing leather in the same stone vats using the same methods for a thousand years. The brass workers still hammer by hand. Allow at least three full days.",
      ],
      ar: [
        "إذا كانت الدار البيضاء قلب المغرب الاقتصادي والرباط رأسه السياسي، فإن فاس هي روحه. أسّسها إدريس الثاني في القرن التاسع، وفاس واحدة من أقدم المدن المأهولة باستمرار في العالم. مدينتها العتيقة، فاس البالي، موقع تراث عالمي لليونسكو بكثافة وتعقيد استثنائيَين، متاهة من 9,400 زقاق وحارة عملت كمدينة حية لأكثر من ألف عام. تقع في قلبها جامعة القرويين، التي تأسّست عام 859 ميلادي وتُعدّ على نطاق واسع أقدم جامعة عاملة باستمرار في العالم.",
        "وعلى هذه الخلفية القديمة، تصل كرة القدم كشيء يكاد يكون نشازاً، ومع ذلك كان ملعب فاس الكبير أحد أهم ملاعب المغرب لعقود. يملأ مناصرو المغرب الفاسي ووداد فاس المدرجات في مباريات الديربي بكثافة تنافس أي شيء في البلاد. التوسعة من 45,000 مقعد إلى نحو 55,800 مدفوعة ببرنامج الاستثمار الوطني للملاعب ومتطلبات استضافة كأس العالم 2030.",
        "فاس هي المدينة التي تبدو فيها كرة القدم أكثر تناقضاً مع محيطها، وهذا التوتر بالضبط ما يجعلها مثيرة للاهتمام إلى هذا الحد. أن تمشي من الأسواق والمدارس والحمامات في المدينة العتيقة إلى ملعب كأس العالم هو أن تعيش ازدواجية المغرب في أحدّ صورها: بلد قديم جداً ومتجدد بشكل راديكالي، تقليدي وطموح بشراسة، في آن واحد. لا مدينة مضيفة أخرى في كامل بطولة 2030 تقدم هذا التباين بمثل هذه الحدة.",
        "للمشجعين الزوار، ستتطلب فاس جهداً أكبر من مراكش أو طنجة. المدينة العتيقة شاسعة وصعبة التجوّل عمداً بأي شيء غير القدمين والاستعداد للضياع. لكن من يبذل الجهد سيجد نفسه في واحدة من أكثر البيئات الإنسانية اكتمالاً في العالم. تقوم دباغات الجلود بدباغة الجلد في نفس أحواض الحجر باستخدام نفس الأساليب منذ ألف عام. ولا يزال عمال النحاس يطرقون يدوياً. خصّص ما لا يقلّ عن ثلاثة أيام كاملة.",
      ],
      fr: [
        "Si Casablanca est le cœur économique du Maroc et Rabat sa tête politique, Fès est son âme. Fondée au IXe siècle par Idris II, Fès est l'une des plus anciennes villes continuellement habitées au monde. Sa médina, la Fès el-Bali, est un site du patrimoine mondial de l'UNESCO d'une densité et d'une complexité extraordinaires, un labyrinthe de 9 400 ruelles et impasses qui a fonctionné comme ville vivante pendant plus d'un millénaire. L'université al-Qarawiyyin, fondée en 859 après J.-C. et largement considérée comme la plus ancienne université en activité continue au monde, en occupe le cœur.",
        "Sur cette toile de fond ancienne, le football arrive comme quelque chose de presque anachronique, et pourtant le Grand Stade de Fès est l'une des enceintes les plus importantes du Maroc depuis des décennies. Les supporters passionnés du MAS Fès et du Wydad Fès remplissent le stade pour les matchs de derby avec une intensité qui rivalise avec tout ce qui se fait dans le pays. L'extension de 45 000 places à environ 55 800 est motivée par le programme national d'investissement dans les stades du Maroc et les exigences d'hébergement de la Coupe du Monde 2030.",
        "Fès est la ville où le football semble le plus en décalage avec son environnement, et cette tension est précisément ce qui la rend si fascinante. Passer des souks, des médersas et des hammams de la médina à un stade de Coupe du Monde, c'est vivre la dualité du Maroc dans sa forme la plus aiguë : un pays à la fois ancien et radicalement moderne, traditionnel et férocement ambitieux. Aucune autre ville hôte de l'ensemble du tournoi 2030 n'offre ce contraste avec une telle netteté.",
        "Pour les supporters en visite, Fès exigera plus d'efforts que Marrakech ou Tanger. La médina est vaste et délibérément difficile à parcourir autrement qu'à pied et avec une certaine volonté de se perdre. Mais ceux qui feront l'effort se retrouveront dans l'un des environnements humains les plus complets qui soient. Les tanneries teignent le cuir dans les mêmes cuves de pierre avec les mêmes méthodes depuis mille ans. Les dinandiers martèlent encore à la main. Prévoyez au moins trois jours pleins.",
      ],
    },
    architecture: {
      en: [
        "The expansion of the Grand Stade de Fes focuses on adding a new covered upper tier that wraps the entire bowl, increasing capacity while dramatically improving the spectator experience. The design integrates geometric motifs drawn from Fes's legendary zellij tilework and carved plaster traditions, ensuring the stadium speaks the visual language of its city. The colour palette draws from the blues and greens that define Fes's pottery and ceramic heritage.",
        "Modern facilities are being added throughout: new media and broadcast centres, expanded player and official areas, upgraded accessibility provisions, and a ring of commercial and hospitality spaces at concourse level. The roof structure, a steel-and-membrane design, provides full coverage for the upper tier and partial coverage for the lower bowl, protecting spectators from both Fes's fierce summer sun and its occasional winter rain.",
        "The expansion also integrates the stadium into a larger sports complex that will serve the city long after 2030. New training pitches, a multi-sport hall, and community recreation facilities are being built adjacent to the stadium, creating a sporting hub for a city whose cultural identity has historically been defined by learning, craftsmanship, and trade rather than athletics. The project represents a deliberate broadening of Fes's civic identity.",
      ],
      ar: [
        "تركز توسعة ملعب فاس الكبير على إضافة طبقة علوية مسقوفة جديدة تلف الحوض بأكمله، ما يزيد السعة ويحسّن تجربة المشاهدة بشكل كبير. يدمج التصميم عناصر هندسية مستوحاة من تقاليد فاس الأسطورية في الزليج وأعمال الجبس المنحوت، ليضمن أن يتحدث الملعب اللغة البصرية لمدينته. تستلهم لوحة الألوان من الأزرق والأخضر اللذين يعرفان فخار فاس وتراثها الخزفي.",
        "تُضاف مرافق حديثة في جميع الأنحاء: مراكز جديدة للإعلام والبث، مناطق موسّعة للاعبين والمسؤولين، تحسينات في سهولة الوصول، وحلقة من المساحات التجارية وأماكن الضيافة على مستوى الممرات. هيكل السقف، تصميم من الفولاذ والغشاء، يوفر تغطية كاملة للطبقة العلوية وتغطية جزئية للحوض السفلي، ما يحمي المتفرجين من شمس فاس الصيفية الشرسة ومن أمطارها الشتوية العرضية.",
        "تدمج التوسعة أيضاً الملعب في مجمع رياضي أكبر سيخدم المدينة لفترة طويلة بعد 2030. تُبنى ملاعب تدريب جديدة وقاعة رياضية متعددة التخصصات ومرافق ترفيه مجتمعي بجوار الملعب، لخلق مركز رياضي في مدينة تعرّفت هويتها الثقافية تاريخياً بالتعلم والحرفية والتجارة أكثر من الرياضة. يمثل المشروع توسيعاً متعمّداً لهوية فاس المدنية.",
      ],
      fr: [
        "L'extension du Grand Stade de Fès se concentre sur l'ajout d'un nouveau niveau supérieur couvert qui enveloppe toute la cuvette, augmentant la capacité tout en améliorant considérablement l'expérience des spectateurs. Le design intègre des motifs géométriques puisés dans les traditions légendaires de zellige et de plâtre sculpté de Fès, garantissant que le stade parle le langage visuel de sa ville. La palette de couleurs s'inspire des bleus et des verts qui définissent la poterie et l'héritage céramique de Fès.",
        "Des installations modernes sont ajoutées partout : nouveaux centres médias et de diffusion, espaces élargis pour les joueurs et les officiels, dispositifs d'accessibilité améliorés, et un anneau d'espaces commerciaux et d'hospitalité au niveau du concourse. La structure du toit, une conception en acier et membrane, offre une couverture complète pour le niveau supérieur et une couverture partielle pour la cuvette inférieure, protégeant les spectateurs à la fois du soleil estival féroce de Fès et de ses pluies hivernales occasionnelles.",
        "L'extension intègre également le stade dans un complexe sportif plus vaste qui servira la ville bien au-delà de 2030. De nouveaux terrains d'entraînement, une salle polyvalente et des installations de loisirs communautaires sont construits à côté du stade, créant un pôle sportif pour une ville dont l'identité culturelle a historiquement été définie par l'apprentissage, l'artisanat et le commerce plutôt que par l'athlétisme. Le projet représente un élargissement délibéré de l'identité civique de Fès.",
      ],
    },
    matchday: {
      en: [
        { label: 'Atmosphere & Capacity', detail: "Full 55,800 for group stage matches. Fes's passionate ultras, particularly the MAS supporters, create an atmosphere rooted in deep local pride." },
        { label: 'VIP & Hospitality', detail: 'New hospitality wing with four corporate suites, a rooftop terrace, and 2,000 premium seats with traditional Fassi hospitality service.' },
        { label: 'Fan Zones', detail: 'The area around Bab Boujloud (the famous Blue Gate) and the Ville Nouvelle will host fan gathering areas with screens and cultural programming.' },
        { label: 'Food & Drink', detail: "Fes is the gastronomic capital of Morocco. Expect pastilla (the city's signature pie), slow-cooked tanjia, incredible pastries, and fresh pomegranate juice at concession points." },
      ],
      ar: [
        { label: 'الأجواء والسعة', detail: 'السعة الكاملة 55,800 لمباريات دور المجموعات. ألتراس فاس المتحمّسون، وخاصة مناصرو المغرب الفاسي، يخلقون أجواء متجذّرة في فخر محلي عميق.' },
        { label: 'كبار الشخصيات والضيافة', detail: 'جناح ضيافة جديد بأربعة أجنحة شركات، وشرفة مسقوفة، و2,000 مقعد مميز مع خدمة الضيافة الفاسية التقليدية.' },
        { label: 'مناطق المشجعين', detail: 'ستستضيف المنطقة حول باب بوجلود (البوابة الزرقاء الشهيرة) والمدينة الجديدة مناطق تجمّع للمشجعين مع شاشات وبرامج ثقافية.' },
        { label: 'الطعام والشراب', detail: 'فاس هي العاصمة الغذائية للمغرب. توقّع البسطيلة (الفطيرة المميزة للمدينة) والطنجية البطيئة الطهي والحلويات المدهشة وعصير الرمّان الطازج في نقاط البيع.' },
      ],
      fr: [
        { label: 'Ambiance & capacité', detail: "55 800 places pleines pour les matchs de phase de groupes. Les ultras passionnés de Fès, particulièrement les supporters du MAS, créent une ambiance enracinée dans une profonde fierté locale." },
        { label: 'VIP & hospitalité', detail: "Nouvelle aile hospitalité avec quatre suites d'entreprise, une terrasse sur le toit et 2 000 places premium avec le service d'hospitalité fassi traditionnel." },
        { label: 'Zones de supporters', detail: "La zone autour de Bab Boujloud (la fameuse Porte Bleue) et la Ville Nouvelle accueilleront des aires de rassemblement avec écrans et programmation culturelle." },
        { label: 'Restauration', detail: "Fès est la capitale gastronomique du Maroc. Attendez-vous à la pastilla (la tourte signature de la ville), la tanjia mijotée, des pâtisseries incroyables et du jus de grenade frais aux points de restauration." },
      ],
    },
    gettingThere: {
      en: [
        { mode: 'Distance', detail: "Route d'Immouzzer, southern Fes, approximately 8 km from the medina" },
        { mode: 'By Taxi', detail: 'Approximately 40-60 MAD ($4-6) from the medina, 15-20 min' },
        { mode: 'By Bus', detail: 'City bus routes serve the stadium area. Dedicated tournament shuttles from medina and Ville Nouvelle on match days.' },
        { mode: 'By Train', detail: 'Fes railway station connects to Casablanca (3.5 hrs), Rabat (2.5 hrs), and Meknes (40 min). High-speed extension under discussion for post-2028.' },
        { mode: 'Parking', detail: 'Stadium parking for 5,000 vehicles. Overflow parking at designated park-and-ride points with shuttle service.' },
      ],
      ar: [
        { mode: 'المسافة', detail: 'طريق إيموزار، جنوب فاس، على بعد نحو 8 كم من المدينة العتيقة' },
        { mode: 'بسيارة أجرة', detail: 'نحو 40-60 درهماً (4-6 دولارات) من المدينة العتيقة، 15-20 دقيقة' },
        { mode: 'بالحافلة', detail: 'خطوط الحافلات الحضرية تخدم منطقة الملعب. حافلات نقل مكوكية مخصصة من المدينة العتيقة والمدينة الجديدة في أيام المباريات.' },
        { mode: 'بالقطار', detail: 'محطة قطار فاس تربط بالدار البيضاء (3.5 ساعات)، الرباط (2.5 ساعة)، ومكناس (40 دقيقة). امتداد البراق السريع قيد النقاش لما بعد 2028.' },
        { mode: 'مواقف السيارات', detail: 'مواقف الملعب لـ 5,000 مركبة. مواقف فائضة في نقاط الاصطفاف والركوب المخصصة مع خدمة مكوكية.' },
      ],
      fr: [
        { mode: 'Distance', detail: "Route d'Immouzzer, sud de Fès, à environ 8 km de la médina" },
        { mode: 'En taxi', detail: 'Environ 40-60 MAD (4-6 $) depuis la médina, 15-20 min' },
        { mode: 'En bus', detail: "Les lignes de bus urbains desservent la zone du stade. Navettes dédiées depuis la médina et la Ville Nouvelle les jours de match." },
        { mode: 'En train', detail: "La gare de Fès est reliée à Casablanca (3h30), Rabat (2h30) et Meknès (40 min). Extension à grande vitesse en discussion pour après 2028." },
        { mode: 'Stationnement', detail: 'Stationnement du stade pour 5 000 véhicules. Parking de débordement à des points de parcs relais désignés avec service de navette.' },
      ],
    },
    matchSchedule: {
      en: 'Group Stage',
      ar: 'دور المجموعات',
      fr: 'Phase de groupes',
    },
  },

  /* ═══════════════════════════════════════════════════════════════
     6. ADRAR STADIUM — Agadir
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: 'adrar-stadium',
    name: 'Adrar Stadium',
    city: { en: 'Agadir', ar: 'أكادير', fr: 'Agadir' },
    capacity: '70,000',
    capacityNote: {
      en: 'Expanded from 45,000',
      ar: 'بعد توسعة من 45,000',
      fr: 'Agrandi depuis 45 000',
    },
    status: 'design',
    badge: {
      en: 'ATLANTIC RIVIERA',
      ar: 'الريفييرا الأطلسية',
      fr: 'RIVIERA ATLANTIQUE',
    },
    accent: 'var(--navy)',
    badgeColor: 'var(--navy)',
    venueId: 1105,
    geo: { latitude: 30.3980, longitude: -9.5320 },
    addressLocality: 'Boulevard Mohammed V, Agadir',
    facts: {
      en: [
        { label: 'Architect', value: 'TBC' },
        { label: 'Budget', value: '$400 million' },
        { label: 'Club Tenant', value: 'Hassania Agadir' },
        { label: 'Location', value: 'Boulevard Mohammed V, Agadir' },
        { label: 'Surface', value: 'Natural grass' },
        { label: 'Expected Completion', value: '2028 (design phase)' },
      ],
      ar: [
        { label: 'المهندس المعماري', value: 'قيد التحديد' },
        { label: 'الميزانية', value: '400 مليون دولار' },
        { label: 'النادي المقيم', value: 'حسنية أكادير' },
        { label: 'الموقع', value: 'شارع محمد الخامس، أكادير' },
        { label: 'أرضية الملعب', value: 'عشب طبيعي' },
        { label: 'الإنجاز المتوقع', value: '2028 (مرحلة التصميم)' },
      ],
      fr: [
        { label: 'Architecte', value: 'À confirmer' },
        { label: 'Budget', value: '400 millions $' },
        { label: 'Club résident', value: 'Hassania Agadir' },
        { label: 'Emplacement', value: 'Boulevard Mohammed V, Agadir' },
        { label: 'Pelouse', value: 'Gazon naturel' },
        { label: 'Achèvement prévu', value: '2028 (phase de conception)' },
      ],
    },
    story: {
      en: [
        "Agadir is the city Morocco rebuilt from nothing. In February 1960, an earthquake measuring 5.7 on the Richter scale destroyed 70 percent of the city in 15 seconds and killed more than 12,000 people. The old Agadir, a layered medina of Arab, Berber, and Portuguese history, ceased to exist. What replaced it over the following decades was a planned, modern city designed to serve its greatest natural assets: 10 kilometres of golden beach, 300 days of sunshine per year, and a climate so reliably warm that Agadir became Morocco's premier resort destination.",
        "The Adrar Stadium, its name taken from the Tachelhit Berber word for mountain, referring to the Adrar peak that rises above the city, was built in a city that had rebuilt itself. Perhaps that accounts for its particular confidence. Situated on Boulevard Mohammed V, the venue commands a position where the Souss plain stretches inland toward the Atlas Mountains while the Atlantic glitters beyond the promenade. It is one of the more dramatically situated football grounds anywhere in Africa.",
        "The planned expansion from 45,000 to 70,000 seats represents the most transformative project of all six World Cup venues. The current Adrar is a solid but modest ground. The expanded version will be a genuine 70,000-seat arena, the third-largest in the tournament behind the Grand Stade Hassan II and Ibn Batouta Stadium. The design phase is currently underway, with construction expected to begin once plans are finalised.",
        "Agadir's matches in 2030 will be the most climatically pleasant of any World Cup venue in the entire tournament. The Atlantic coast moderates temperatures year-round, meaning that even in summer, match-day conditions are significantly cooler than inland venues like Marrakech or Fes. For fans, the combination of World Cup football and one of Africa's finest beaches will be a compelling proposition. The fish restaurants on the port are the finest in Morocco. And the football, in that setting and under that Atlantic light, should be something worth crossing continents for.",
      ],
      ar: [
        "أكادير هي المدينة التي أعاد المغرب بناءها من الصفر. في فبراير 1960، دمّر زلزال بقوة 5.7 على مقياس ريختر 70 في المئة من المدينة في 15 ثانية وقتل أكثر من 12,000 شخص. أكادير القديمة، مدينة عتيقة متعددة الطبقات من التاريخ العربي والأمازيغي والبرتغالي، زالت من الوجود. ما حلّ محلّها على مدى العقود التالية مدينة حديثة مخطّطة صُمّمت لخدمة أعظم أصولها الطبيعية: 10 كيلومترات من الشاطئ الذهبي، 300 يوم من أشعة الشمس سنوياً، ومناخ دافئ بانتظام إلى درجة جعلت أكادير الوجهة السياحية الأولى في المغرب.",
        "بُني ملعب أدرار، الذي يأخذ اسمه من كلمة تاشلحيت الأمازيغية التي تعني الجبل، في إشارة إلى قمة أدرار التي ترتفع فوق المدينة، في مدينة أعادت بناء نفسها. ربما هذا ما يفسّر ثقته الخاصة. يقع على شارع محمد الخامس، ويحتلّ الملعب موقعاً يمتد فيه سهل سوس داخلياً نحو جبال الأطلس فيما يلمع الأطلسي وراء الواجهة البحرية. إنه واحد من أكثر ملاعب كرة القدم إثارة للإعجاب من الناحية الموقعية في أي مكان في أفريقيا.",
        "تمثل التوسعة المخطّطة من 45,000 إلى 70,000 مقعد أكثر المشاريع تحوّلاً من بين ملاعب كأس العالم الستة. ملعب أدرار الحالي أرضية متينة لكن متواضعة. أما النسخة الموسّعة فستكون حلبة حقيقية من 70,000 مقعد، ثالث أكبر ملعب في البطولة بعد ملعب الحسن الثاني الكبير وملعب ابن بطوطة. تجري مرحلة التصميم حالياً، ومن المتوقع أن يبدأ البناء بمجرد اكتمال الخطط.",
        "ستكون مباريات أكادير في 2030 الأكثر ملاءمة من حيث المناخ لأي ملعب كأس عالم في البطولة بأكملها. يعتدل الساحل الأطلسي درجات الحرارة على مدار السنة، ما يعني أنه حتى في الصيف، ستكون ظروف يوم المباراة أبرد بشكل ملحوظ من الملاعب الداخلية مثل مراكش أو فاس. للمشجعين، سيكون الجمع بين كرة قدم كأس العالم وواحد من أجمل شواطئ أفريقيا اقتراحاً مُغرياً. مطاعم الأسماك في الميناء هي الأجود في المغرب. وكرة القدم، في ذلك المشهد وتحت ذلك الضوء الأطلسي، يجب أن تكون شيئاً يستحق عبور القارات.",
      ],
      fr: [
        "Agadir est la ville que le Maroc a reconstruite à partir de rien. En février 1960, un tremblement de terre de magnitude 5,7 sur l'échelle de Richter a détruit 70 pour cent de la ville en 15 secondes et tué plus de 12 000 personnes. L'ancienne Agadir, une médina superposée d'histoire arabe, berbère et portugaise, a cessé d'exister. Ce qui l'a remplacée au fil des décennies suivantes fut une ville moderne planifiée, conçue pour servir ses plus grands atouts naturels : 10 kilomètres de plage dorée, 300 jours de soleil par an et un climat si fiablement chaud qu'Agadir est devenue la première destination balnéaire du Maroc.",
        "Le stade Adrar, dont le nom vient du mot tachelhit amazighe pour montagne, en référence au mont Adrar qui s'élève au-dessus de la ville, a été construit dans une ville qui s'était elle-même reconstruite. C'est peut-être ce qui explique sa confiance particulière. Situé sur le boulevard Mohammed V, l'enceinte occupe une position où la plaine du Souss s'étend à l'intérieur des terres vers les montagnes de l'Atlas tandis que l'Atlantique scintille au-delà de la promenade. C'est l'un des terrains de football les plus spectaculairement situés de toute l'Afrique.",
        "L'extension prévue de 45 000 à 70 000 places représente le projet le plus transformateur des six sites de la Coupe du Monde. L'actuel Adrar est un terrain solide mais modeste. La version élargie sera une véritable arène de 70 000 places, la troisième plus grande du tournoi après le Grand Stade Hassan II et le stade Ibn Batouta. La phase de conception est actuellement en cours, et la construction devrait commencer une fois les plans finalisés.",
        "Les matchs d'Agadir en 2030 seront les plus agréables climatiquement de tout site de la Coupe du Monde du tournoi. La côte atlantique modère les températures toute l'année, ce qui signifie que même en été, les conditions des jours de match sont sensiblement plus fraîches que dans les sites intérieurs comme Marrakech ou Fès. Pour les supporters, la combinaison du football de Coupe du Monde et de l'une des plus belles plages d'Afrique sera une proposition convaincante. Les restaurants de poisson du port sont les meilleurs du Maroc. Et le football, dans ce cadre et sous cette lumière atlantique, devrait valoir la peine de traverser des continents.",
      ],
    },
    architecture: {
      en: [
        "While the expansion design is still being finalised, the ambition is clear: to transform a 45,000-seat regional ground into a 70,000-seat arena worthy of the World Cup. The existing stadium's open, airy character, well-suited to Agadir's benign climate, will be preserved and enhanced. The expansion will add a full upper tier, a new roof structure providing shade for all seats, and significantly upgraded facilities throughout.",
        "The architectural brief calls for a design that reflects Agadir's identity as a modern, resort city with deep Amazigh (Berber) cultural roots. Expect geometric motifs drawn from Amazigh art and textile traditions, a colour palette inspired by the ochre of the surrounding landscape and the blue of the Atlantic, and an openness to the sky and sea that distinguishes Agadir from Morocco's more enclosed inland venues.",
        "Sustainability will be central to the design. Agadir's abundant sunshine makes solar energy generation a natural fit, and the stadium's coastal location allows for passive cooling through sea breezes. Water management, always critical in southern Morocco, will incorporate the latest recycling and conservation technologies. The expanded stadium is intended to anchor a broader urban regeneration project along Boulevard Mohammed V.",
      ],
      ar: [
        "بينما لا يزال تصميم التوسعة قيد الإنجاز، فإن الطموح واضح: تحويل أرضية إقليمية بسعة 45,000 مقعد إلى حلبة من 70,000 مقعد تليق بكأس العالم. سيُحافَظ على طابع الملعب الحالي المفتوح والهوائي، الملائم لمناخ أكادير الودود، ويُعزَّز. ستضيف التوسعة طبقة علوية كاملة وهيكل سقف جديد يوفر الظل لكل المقاعد ومرافق محسّنة بشكل كبير في جميع الأنحاء.",
        "يدعو التوجيه المعماري إلى تصميم يعكس هوية أكادير كمدينة عصرية ومنتجع ذي جذور ثقافية أمازيغية عميقة. توقّع عناصر هندسية مستوحاة من الفن الأمازيغي وتقاليد النسيج، ولوحة ألوان مستلهمة من لون الطوب الأحمر للمناظر الطبيعية المحيطة وزرقة الأطلسي، وانفتاحاً على السماء والبحر يميز أكادير عن ملاعب المغرب الداخلية الأكثر انغلاقاً.",
        "ستكون الاستدامة في صلب التصميم. تجعل أشعة الشمس الوفيرة في أكادير توليد الطاقة الشمسية خياراً طبيعياً، ويسمح الموقع الساحلي للملعب بالتبريد السلبي عبر نسائم البحر. إدارة المياه، الحرجة دائماً في جنوب المغرب، ستدمج أحدث تقنيات إعادة التدوير والحفاظ. الهدف من الملعب الموسّع هو أن يكون نواة مشروع تجديد حضري أوسع على طول شارع محمد الخامس.",
      ],
      fr: [
        "Bien que la conception de l'extension soit encore en cours de finalisation, l'ambition est claire : transformer un terrain régional de 45 000 places en une arène de 70 000 places digne de la Coupe du Monde. Le caractère ouvert et aéré du stade actuel, bien adapté au climat bienveillant d'Agadir, sera préservé et enrichi. L'extension ajoutera un niveau supérieur complet, une nouvelle structure de toit offrant de l'ombre à tous les sièges et des installations considérablement améliorées partout.",
        "Le cahier des charges architectural appelle à un design qui reflète l'identité d'Agadir comme ville moderne et balnéaire aux racines culturelles amazighes profondes. Attendez-vous à des motifs géométriques inspirés de l'art amazighe et des traditions textiles, à une palette de couleurs inspirée de l'ocre du paysage environnant et du bleu de l'Atlantique, et à une ouverture sur le ciel et la mer qui distingue Agadir des enceintes plus enfermées de l'intérieur du Maroc.",
        "La durabilité sera au cœur du design. L'abondant ensoleillement d'Agadir rend la production d'énergie solaire naturelle, et l'emplacement côtier du stade permet un refroidissement passif grâce aux brises marines. La gestion de l'eau, toujours critique dans le sud du Maroc, intégrera les dernières technologies de recyclage et de conservation. Le stade élargi est destiné à ancrer un projet plus large de régénération urbaine le long du boulevard Mohammed V.",
      ],
    },
    matchday: {
      en: [
        { label: 'Atmosphere & Capacity', detail: "Full 70,000 for group stage matches. Hassania Agadir's supporters are fiercely loyal, and the Atlantic breeze creates unique open-air conditions." },
        { label: 'VIP & Hospitality', detail: 'Planned hospitality areas with ocean-facing terraces, six corporate suites, and 3,000 premium seats. VIP areas will showcase Souss-Massa regional cuisine.' },
        { label: 'Fan Zones', detail: "The beachfront promenade and Marina district will host massive fan festivals. Agadir's resort infrastructure makes it naturally suited to hosting large crowds of international visitors." },
        { label: 'Food & Drink', detail: "Agadir is Morocco's seafood capital. Expect grilled sardines, fresh fish tagine, argan oil-drizzled salads, and Atlantic oysters alongside standard concessions." },
      ],
      ar: [
        { label: 'الأجواء والسعة', detail: 'السعة الكاملة 70,000 لمباريات دور المجموعات. مشجعو حسنية أكادير موالون بشدة، والنسائم الأطلسية تخلق ظروفاً مفتوحة فريدة.' },
        { label: 'كبار الشخصيات والضيافة', detail: 'مناطق ضيافة مخطّطة بشرفات تطلّ على المحيط، وستة أجنحة شركات، و3,000 مقعد مميز. ستعرض مناطق VIP مأكولات جهة سوس-ماسة الإقليمية.' },
        { label: 'مناطق المشجعين', detail: 'واجهة الشاطئ البحرية وحي المارينا سيستضيفان مهرجانات مشجعين ضخمة. بنية أكادير السياحية التحتية تجعلها مهيأة طبيعياً لاستقبال حشود كبيرة من الزوار الدوليين.' },
        { label: 'الطعام والشراب', detail: 'أكادير هي عاصمة المأكولات البحرية في المغرب. توقّع السردين المشوي وطاجين السمك الطازج والسلطات المرشوشة بزيت الأركان والمحار الأطلسي إلى جانب نقاط البيع الاعتيادية.' },
      ],
      fr: [
        { label: 'Ambiance & capacité', detail: "70 000 places pleines pour les matchs de phase de groupes. Les supporters du Hassania Agadir sont d'une loyauté farouche, et la brise atlantique crée des conditions uniques en plein air." },
        { label: 'VIP & hospitalité', detail: "Zones d'hospitalité prévues avec terrasses face à l'océan, six suites d'entreprise et 3 000 places premium. Les espaces VIP mettront en valeur la cuisine régionale du Souss-Massa." },
        { label: 'Zones de supporters', detail: "La promenade du front de mer et le quartier de la marina accueilleront d'immenses festivals de supporters. L'infrastructure balnéaire d'Agadir la rend naturellement adaptée à l'accueil de grandes foules de visiteurs internationaux." },
        { label: 'Restauration', detail: "Agadir est la capitale des fruits de mer du Maroc. Attendez-vous aux sardines grillées, au tajine de poisson frais, aux salades arrosées d'huile d'argan et aux huîtres atlantiques aux côtés des options habituelles." },
      ],
    },
    gettingThere: {
      en: [
        { mode: 'Distance', detail: 'Boulevard Mohammed V, central Agadir' },
        { mode: 'By Taxi', detail: 'Approximately 20-40 MAD ($2-4) from most hotels and the beach area, 5-10 min' },
        { mode: 'By Bus', detail: 'City buses and tournament shuttles from beach hotels, Marina, and Souss-Massa region' },
        { mode: 'By Air', detail: 'Al Massira Airport (23 km east) has direct year-round flights to Paris, London, Amsterdam, Brussels, Frankfurt, and dozens of European cities' },
        { mode: 'Parking', detail: 'Stadium parking being expanded as part of the renovation. Overflow parking with shuttle services from beach area.' },
      ],
      ar: [
        { mode: 'المسافة', detail: 'شارع محمد الخامس، وسط أكادير' },
        { mode: 'بسيارة أجرة', detail: 'نحو 20-40 درهماً (2-4 دولارات) من معظم الفنادق ومنطقة الشاطئ، 5-10 دقائق' },
        { mode: 'بالحافلة', detail: 'الحافلات الحضرية وحافلات نقل البطولة من فنادق الشاطئ والمارينا ومنطقة سوس-ماسة' },
        { mode: 'عن طريق الجو', detail: 'مطار المسيرة (23 كم شرقاً) يخدم رحلات مباشرة طوال العام إلى باريس ولندن وأمستردام وبروكسل وفرانكفورت وعشرات المدن الأوروبية' },
        { mode: 'مواقف السيارات', detail: 'مواقف الملعب قيد التوسّع كجزء من التجديد. مواقف فائضة مع خدمات نقل مكوكي من منطقة الشاطئ.' },
      ],
      fr: [
        { mode: 'Distance', detail: "Boulevard Mohammed V, centre d'Agadir" },
        { mode: 'En taxi', detail: 'Environ 20-40 MAD (2-4 $) depuis la plupart des hôtels et la zone de la plage, 5-10 min' },
        { mode: 'En bus', detail: 'Bus urbains et navettes du tournoi depuis les hôtels de plage, la marina et la région du Souss-Massa' },
        { mode: 'Par avion', detail: "L'aéroport Al Massira (23 km à l'est) offre des vols directs toute l'année vers Paris, Londres, Amsterdam, Bruxelles, Francfort et des dizaines de villes européennes" },
        { mode: 'Stationnement', detail: "Le stationnement du stade est en cours d'extension dans le cadre de la rénovation. Parking de débordement avec services de navette depuis la zone de plage." },
      ],
    },
    matchSchedule: {
      en: 'Group Stage',
      ar: 'دور المجموعات',
      fr: 'Phase de groupes',
    },
  },
]

/**
 * Build a localised `Place` / `StadiumOrArena` JSON-LD object for a
 * single venue. Called once per venue per page render, with the
 * current page locale.
 *
 * Localised fields: description (first story paragraph), address
 * locality display, inLanguage.
 *
 * Stable fields: name (canonical EN proper noun), capacity (numeric),
 * geo coordinates, image, addressRegion (street-level locality kept
 * in EN for Schema.org consistency).
 */
export function venueJsonLd(venue: WC2030Venue, lang: Lang = 'en') {
  const story = pickLocale(venue.story, lang)
  const cityDisplay = pickLocale(venue.city, lang)
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    additionalType: 'https://schema.org/StadiumOrArena',
    inLanguage: lang,
    name: venue.name,
    description: story[0],
    maximumAttendeeCapacity: Number(venue.capacity.replace(/[^0-9]/g, '')) || undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityDisplay,
      addressRegion: venue.addressLocality,
      addressCountry: 'MA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: venue.geo.latitude,
      longitude: venue.geo.longitude,
    },
    ...(venue.venueId ? {
      image: `https://media.api-sports.io/football/venues/${venue.venueId}.png`,
    } : {}),
  }
}
