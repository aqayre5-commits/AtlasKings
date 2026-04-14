/**
 * /world-cup-2030/construction — infrastructure tracker.
 * ─────────────────────────────────────────────────────────────────────
 *
 * Phase D conversion (§6): client → server component.
 *
 * Changes vs the previous client version:
 *   - Strip 'use client' — this is pure static content
 *   - Derive lang from the route param instead of usePathname()
 *   - Add generateMetadata via pageMetadata('world-cup-2030/construction')
 *   - Add shared Breadcrumb at the top
 *   - Add revalidate = 86400 (static content, daily refresh)
 *
 * NOT changed in Phase D:
 *   - Data structures (STADIUMS, TIMELINE, TRANSIT_PROJECTS, RAIL_EXTENSIONS,
 *     AIRPORTS, HOTEL_CITIES, T) are already fully localised for EN/AR/FR
 *   - Page visual layout — no redesign, just the shell around it
 *
 * Future pass: merge the local STADIUMS array into the shared
 * WC2030_VENUES module so construction + stadiums + hub share one
 * source of truth. Deferred for now so Phase D stays minimal.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { pageMetadata } from '@/lib/seo/pageMetadata'
import type { Lang } from '@/lib/i18n/config'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return pageMetadata('world-cup-2030/construction', lang, '/world-cup-2030/construction')
}

export const revalidate = 86400

const T = {
  en: {
    topLabel: 'FIFA World Cup 2030 Morocco',
    title: 'Construction & Infrastructure Updates',
    subtitle: 'Tracking Morocco\u2019s $16 billion investment in stadiums, transport, and hospitality infrastructure for the 2030 FIFA World Cup. Six stadiums, three high-speed rail extensions, five airport expansions, and a national hotel capacity programme \u2014 the largest infrastructure project in North African history.',
    programmeOverview: 'Programme Overview',
    overviewP1: 'Morocco\u2019s preparation for the 2030 FIFA World Cup represents the most ambitious infrastructure programme ever undertaken by an African nation. The total investment \u2014 estimated at $16 billion across stadiums, transport networks, hospitality, and urban development \u2014 spans a construction timeline from 2024 to 2029, with the goal of delivering a tournament-ready country a full year before the opening match.',
    overviewP2: 'The programme is overseen by the Royal Commission for World Cup Preparation, established by King Mohammed VI in 2024, working in coordination with the Ministry of Equipment, Transport, Logistics and Water, the Ministry of Tourism, and the Moroccan Football Federation (FRMF). FIFA\u2019s own infrastructure assessment team conducts quarterly reviews of all six venues and associated transport corridors.',
    overviewP3: 'Construction is organised across four parallel streams: stadium builds and renovations, transport infrastructure, hospitality and accommodation, and urban development. Each stream operates under independent project management with a unified reporting structure to the Royal Commission.',
    overviewP4: 'As of early 2026, the programme is broadly on schedule. The Grand Stade Hassan II in Casablanca \u2014 the flagship project \u2014 has reached the structural frame stage. Four of the five renovation and expansion projects are underway. Transport infrastructure, particularly the TGV high-speed rail extensions, represents the most complex and highest-risk element of the timeline.',
    totalInvestment: 'Total Investment',
    stadiums: 'Stadiums',
    timeline: 'Timeline',
    totalCapacity: 'Total Capacity',
    stadiumProjects: 'Stadium Construction Projects',
    capacity: 'Capacity',
    budget: 'Budget',
    architect: 'Architect',
    expectedCompletion: 'Expected Completion',
    transportInfrastructure: 'Transport Infrastructure',
    tgvTitle: 'TGV High-Speed Rail Extensions',
    tgvDesc: 'Morocco\u2019s Al Boraq high-speed rail network \u2014 Africa\u2019s only operational TGV service since 2018 \u2014 forms the backbone of the World Cup transport strategy. The existing Tangier-Casablanca line already connects two host cities at 320 km/h. Two critical extensions are under construction to link the remaining venues into a unified high-speed corridor.',
    airportExpansions: 'Airport Expansions',
    airportHeaders: ['Airport', 'City', 'Current Capacity', 'Target Capacity', 'Status'],
    highwaysUrban: 'Highways & Urban Transit',
    highwaysDesc: 'Morocco\u2019s autoroute network \u2014 already one of the most developed in Africa \u2014 is receiving targeted upgrades to ensure all six host cities are connected by high-capacity motorway. The A3 Casablanca-Marrakech corridor is being widened to three lanes in each direction. The A1 Casablanca-Rabat motorway is adding dedicated event-day lanes. New sections between Agadir and the national network are closing the final gaps in the southern corridor.',
    hotelHospitality: 'Hotel & Hospitality Infrastructure',
    hotelP1: 'Morocco\u2019s Ministry of Tourism has set a target of doubling the country\u2019s classified hotel capacity by 2029, from approximately 140,000 rooms to 280,000 rooms across all six host cities. The programme \u2014 branded \u201cHospitality 2030\u201d \u2014 combines new hotel construction, conversion of existing buildings, and development of entirely new accommodation zones on the periphery of each host city.',
    hotelP2: 'FIFA requires a minimum of 60,000 hotel rooms within 60 minutes of each venue by tournament date. Morocco\u2019s current supply already meets this threshold in Marrakech and Agadir \u2014 the two established tourism centres \u2014 but significant development is required in Casablanca, Fes, Tangier, and Rabat to reach the target.',
    rooms: 'rooms',
    fanZones: 'FIFA Fan Zones',
    fanZonesDesc: 'Each of the six host cities will feature a dedicated FIFA Fan Zone capable of accommodating 20,000 to 40,000 visitors. Prime locations have been designated: the Corniche in Casablanca, the Bouregreg waterfront in Rabat, the Jemaa el-Fnaa perimeter in Marrakech, the new marina district in Tangier, the Bab Boujloud plaza in Fes, and the beachfront promenade in Agadir. Construction of permanent staging infrastructure begins in 2028.',
    trainingFacilities: 'Training Facilities',
    trainingDesc: 'FIFA mandates a minimum of 80 team training sites for the 48-nation World Cup. Morocco has identified 92 potential facilities across the six host regions, including 24 new purpose-built training complexes currently in various stages of construction.',
    constructionTimeline: 'Construction Timeline 2024-2030',
    stadiumGuidesLink: 'Stadium Guides',
    cityGuidesLink: 'City Guides',
    travelGuideLink: 'Travel Guide',
  },
  ar: {
    topLabel: 'كأس العالم 2030 FIFA المغرب',
    title: 'تحديثات البناء والبنية التحتية',
    subtitle: 'متابعة استثمار المغرب البالغ 16 مليار دولار في الملاعب والنقل والبنية التحتية للضيافة لكأس العالم 2030. ستة ملاعب، ثلاثة امتدادات للقطار فائق السرعة، خمسة توسعات مطارات، وبرنامج وطني للطاقة الفندقية.',
    programmeOverview: 'نظرة عامة على البرنامج',
    overviewP1: 'يمثل استعداد المغرب لكأس العالم 2030 أطموح برنامج بنية تحتية تقوم به دولة أفريقية على الإطلاق. إجمالي الاستثمار — المقدر بـ 16 مليار دولار عبر الملاعب وشبكات النقل والضيافة والتنمية الحضرية — يمتد من 2024 إلى 2029.',
    overviewP2: 'يشرف على البرنامج اللجنة الملكية للتحضير لكأس العالم، التي أنشأها الملك محمد السادس في 2024، بالتنسيق مع وزارة التجهيز والنقل ووزارة السياحة والجامعة الملكية المغربية لكرة القدم.',
    overviewP3: 'ينظم البناء عبر أربعة مسارات متوازية: بناء الملاعب وتجديدها، البنية التحتية للنقل، الضيافة والإقامة، والتنمية الحضرية.',
    overviewP4: 'اعتباراً من أوائل 2026، البرنامج يسير وفق الجدول الزمني بشكل عام. ملعب الحسن الثاني الكبير في الدار البيضاء وصل إلى مرحلة الهيكل الإنشائي.',
    totalInvestment: 'إجمالي الاستثمار',
    stadiums: 'الملاعب',
    timeline: 'الجدول الزمني',
    totalCapacity: 'السعة الإجمالية',
    stadiumProjects: 'مشاريع بناء الملاعب',
    capacity: 'السعة',
    budget: 'الميزانية',
    architect: 'المهندس المعماري',
    expectedCompletion: 'الإنجاز المتوقع',
    transportInfrastructure: 'البنية التحتية للنقل',
    tgvTitle: 'امتدادات القطار فائق السرعة TGV',
    tgvDesc: 'تشكل شبكة القطار فائق السرعة البراق — الخدمة الوحيدة من نوعها في أفريقيا منذ 2018 — العمود الفقري لاستراتيجية النقل لكأس العالم. يربط الخط الحالي طنجة-الدار البيضاء مدينتين مضيفتين بسرعة 320 كم/ساعة.',
    airportExpansions: 'توسعات المطارات',
    airportHeaders: ['المطار', 'المدينة', 'السعة الحالية', 'السعة المستهدفة', 'الحالة'],
    highwaysUrban: 'الطرق السريعة والنقل الحضري',
    highwaysDesc: 'تتلقى شبكة الطرق السريعة المغربية — واحدة من أكثر الشبكات تطوراً في أفريقيا — تحديثات مستهدفة لضمان ربط جميع المدن المضيفة الست بطرق سريعة عالية السعة.',
    hotelHospitality: 'البنية التحتية الفندقية والضيافة',
    hotelP1: 'حددت وزارة السياحة المغربية هدفاً لمضاعفة الطاقة الفندقية المصنفة بحلول 2029، من حوالي 140,000 غرفة إلى 280,000 غرفة عبر جميع المدن المضيفة الست.',
    hotelP2: 'يتطلب FIFA حداً أدنى من 60,000 غرفة فندقية في نطاق 60 دقيقة من كل ملعب بحلول موعد البطولة.',
    rooms: 'غرفة',
    fanZones: 'مناطق المشجعين FIFA',
    fanZonesDesc: 'ستضم كل مدينة من المدن المضيفة الست منطقة مشجعين مخصصة تتسع لـ 20,000 إلى 40,000 زائر.',
    trainingFacilities: 'مرافق التدريب',
    trainingDesc: 'يتطلب FIFA حداً أدنى من 80 موقع تدريب للفرق لكأس العالم المكون من 48 منتخباً. حدد المغرب 92 منشأة محتملة.',
    constructionTimeline: 'الجدول الزمني للبناء 2024-2030',
    stadiumGuidesLink: 'دليل الملاعب',
    cityGuidesLink: 'دليل المدن',
    travelGuideLink: 'دليل السفر',
  },
  fr: {
    topLabel: 'Coupe du Monde FIFA 2030 Maroc',
    title: 'Construction & mises \u00e0 jour des infrastructures',
    subtitle: 'Suivi de l\'investissement de 16 milliards de dollars du Maroc dans les stades, les transports et l\'infrastructure hôtelière pour la Coupe du Monde FIFA 2030. Six stades, trois extensions de TGV, cinq agrandissements d\'aéroports et un programme national de capacité hôtelière.',
    programmeOverview: 'Vue d\'ensemble du programme',
    overviewP1: 'La préparation du Maroc pour la Coupe du Monde FIFA 2030 représente le programme d\'infrastructure le plus ambitieux jamais entrepris par une nation africaine. L\'investissement total — estimé à 16 milliards de dollars — s\'étend de 2024 à 2029.',
    overviewP2: 'Le programme est supervisé par la Commission Royale de Préparation de la Coupe du Monde, créée par le Roi Mohammed VI en 2024, en coordination avec le Ministère de l\'Équipement et du Transport, le Ministère du Tourisme et la FRMF.',
    overviewP3: 'La construction s\'organise autour de quatre axes parallèles : construction et rénovation des stades, infrastructure de transport, hôtellerie et hébergement, et développement urbain.',
    overviewP4: 'Début 2026, le programme est globalement dans les temps. Le Grand Stade Hassan II à Casablanca a atteint le stade de la structure porteuse.',
    totalInvestment: 'Investissement total',
    stadiums: 'Stades',
    timeline: 'Calendrier',
    totalCapacity: 'Capacité totale',
    stadiumProjects: 'Projets de construction des stades',
    capacity: 'Capacité',
    budget: 'Budget',
    architect: 'Architecte',
    expectedCompletion: 'Achèvement prévu',
    transportInfrastructure: 'Infrastructure de transport',
    tgvTitle: 'Extensions du TGV',
    tgvDesc: 'Le réseau TGV Al Boraq — le seul service à grande vitesse opérationnel en Afrique depuis 2018 — constitue l\'épine dorsale de la stratégie de transport de la Coupe du Monde. La ligne existante Tanger-Casablanca relie déjà deux villes hôtes à 320 km/h.',
    airportExpansions: 'Agrandissements des aéroports',
    airportHeaders: ['Aéroport', 'Ville', 'Capacité actuelle', 'Capacité cible', 'Statut'],
    highwaysUrban: 'Autoroutes & transport urbain',
    highwaysDesc: 'Le réseau autoroutier marocain — déjà l\'un des plus développés d\'Afrique — bénéficie de mises à niveau ciblées pour garantir la connexion des six villes hôtes par autoroute à haute capacité.',
    hotelHospitality: 'Infrastructure hôtelière & hospitalité',
    hotelP1: 'Le Ministère du Tourisme a fixé l\'objectif de doubler la capacité hôtelière classée d\'ici 2029, de 140 000 chambres à 280 000 chambres dans les six villes hôtes.',
    hotelP2: 'La FIFA exige un minimum de 60 000 chambres d\'hôtel à moins de 60 minutes de chaque stade à la date du tournoi.',
    rooms: 'chambres',
    fanZones: 'Zones de supporters FIFA',
    fanZonesDesc: 'Chacune des six villes hôtes disposera d\'une zone de supporters dédiée pouvant accueillir de 20 000 à 40 000 visiteurs.',
    trainingFacilities: 'Centres d\'entraînement',
    trainingDesc: 'La FIFA exige un minimum de 80 sites d\'entraînement pour la Coupe du Monde à 48 nations. Le Maroc a identifié 92 installations potentielles.',
    constructionTimeline: 'Calendrier de construction 2024-2030',
    stadiumGuidesLink: 'Guide des stades',
    cityGuidesLink: 'Guide des villes',
    travelGuideLink: 'Guide de voyage',
  },
}

const STADIUMS = [
  {
    name: 'Grand Stade Hassan II',
    city: { en: 'Casablanca', ar: 'الدار البيضاء', fr: 'Casablanca' },
    currentCapacity: 'New build',
    targetCapacity: '115,000',
    budget: '$1.2 billion',
    architect: 'Tarik Oualalou (OUALALOU+CHOI) / Populous',
    status: { en: 'Under Construction', ar: 'قيد البناء', fr: 'En construction' },
    statusColor: '#f59e0b',
    statusIcon: '\u{1F7E1}',
    completion: '2028',
    description: {
      en: 'The centrepiece of Morocco\'s 2030 World Cup programme and, upon completion, the largest football stadium in the world. Rising from the forested plains of El Mansouria, 40 kilometres from central Casablanca, the Grand Stade Hassan II is designed around the concept of the moussem \u2014 the traditional Moroccan communal gathering. A translucent aluminium lattice canopy floats above the bowl, supported by thirty-two grand stairways that double as elevated botanical walkways. Three steep tiers at each end are engineered to bring 115,000 spectators as close to the pitch as the geometry allows. Morocco has designed this stadium specifically for the World Cup final.',
      ar: 'المشروع الرئيسي لبرنامج كأس العالم 2030 المغربي، وعند اكتماله سيكون أكبر ملعب كرة قدم في العالم. يرتفع من سهول المنصورية المشجرة، على بعد 40 كيلومتراً من وسط الدار البيضاء. صُمم ملعب الحسن الثاني الكبير حول مفهوم الموسم \u2014 التجمع المجتمعي المغربي التقليدي. مظلة شبكية من الألمنيوم الشفاف تطفو فوق الملعب.',
      fr: 'La pièce maîtresse du programme Coupe du Monde 2030 du Maroc et, une fois achevé, le plus grand stade de football au monde. S\'élevant des plaines boisées d\'El Mansouria, à 40 km du centre de Casablanca, le Grand Stade Hassan II est conçu autour du concept du moussem \u2014 le rassemblement communautaire traditionnel marocain.',
    },
  },
  {
    name: 'Prince Moulay Abdellah Stadium',
    city: { en: 'Rabat', ar: 'الرباط', fr: 'Rabat' },
    currentCapacity: '68,000',
    targetCapacity: '68,000',
    budget: '$45 million (FIFA upgrades)',
    architect: 'Bouygues Construction (original)',
    status: { en: 'Complete', ar: 'مكتمل', fr: 'Achevé' },
    statusColor: '#22c55e',
    statusIcon: '\u{1F7E2}',
    completion: '2023 (upgrades 2025-2028)',
    description: {
      en: 'Morocco\'s capital venue was built in just 24 months and inaugurated in 2023, making it the most advanced stadium in the country\'s current portfolio. The 68,000-seat ground in the Hay Riad district requires only minor FIFA-standard upgrades \u2014 improved broadcast infrastructure, enhanced hospitality suites, and upgraded accessibility provisions \u2014 all scheduled between 2025 and 2028.',
      ar: 'بُني ملعب العاصمة المغربية في 24 شهراً فقط وافتُتح في 2023، مما يجعله أكثر الملاعب تقدماً في المغرب حالياً. يحتاج الملعب ذو 68,000 مقعد في حي الرياض إلى تحسينات طفيفة فقط وفق معايير FIFA.',
      fr: 'Le stade de la capitale marocaine a été construit en seulement 24 mois et inauguré en 2023. Le stade de 68 000 places dans le quartier Hay Riad ne nécessite que des améliorations mineures selon les normes FIFA.',
    },
  },
  {
    name: 'Grand Stade de Marrakech',
    city: { en: 'Marrakech', ar: 'مراكش', fr: 'Marrakech' },
    currentCapacity: '45,000+',
    targetCapacity: '65,000',
    budget: '$180 million (expansion)',
    architect: 'Gregotti Associati / Saad Benkirane',
    status: { en: 'In Progress', ar: 'قيد التنفيذ', fr: 'En cours' },
    statusColor: '#f59e0b',
    statusIcon: '\u{1F7E1}',
    completion: '2028',
    description: {
      en: 'The Grand Stade de Marrakech enters its second major renovation phase, expanding from 45,000 to approximately 65,000 seats. The athletics track has been removed to bring the stands directly to the pitch, transforming the bowl into a purpose-built football arena.',
      ar: 'يدخل ملعب مراكش الكبير مرحلته الثانية من التجديد الرئيسي، ليتوسع من 45,000 إلى حوالي 65,000 مقعد. تمت إزالة مضمار ألعاب القوى لتقريب المدرجات من أرضية الملعب.',
      fr: 'Le Grand Stade de Marrakech entre dans sa deuxième phase majeure de rénovation, passant de 45 000 à environ 65 000 places. La piste d\'athlétisme a été supprimée pour rapprocher les tribunes du terrain.',
    },
  },
  {
    name: 'Ibn Batouta Stadium',
    city: { en: 'Tangier', ar: 'طنجة', fr: 'Tanger' },
    currentCapacity: '68,000',
    targetCapacity: '77,000',
    budget: '$200 million (expansion)',
    architect: 'Tarik Oualalou (original design)',
    status: { en: 'In Progress', ar: 'قيد التنفيذ', fr: 'En cours' },
    statusColor: '#f59e0b',
    statusIcon: '\u{1F7E1}',
    completion: '2028',
    description: {
      en: 'Named after the 14th-century Moroccan explorer, Tangier\'s stadium is undergoing a significant expansion from 68,000 to 77,000 seats. Work began in 2024 with the addition of a new upper tier on the southern stand and enhanced corner sections.',
      ar: 'سُمي على اسم الرحالة المغربي في القرن الرابع عشر، يخضع ملعب طنجة لتوسعة كبيرة من 68,000 إلى 77,000 مقعد. بدأت الأعمال في 2024 بإضافة طبقة علوية جديدة.',
      fr: 'Nommé d\'après l\'explorateur marocain du XIVe siècle, le stade de Tanger fait l\'objet d\'un agrandissement important de 68 000 à 77 000 places. Les travaux ont commencé en 2024.',
    },
  },
  {
    name: 'Grand Stade de Fes',
    city: { en: 'Fes', ar: 'فاس', fr: 'Fès' },
    currentCapacity: '35,500',
    targetCapacity: '65,000',
    budget: '$250 million (expansion)',
    architect: 'Moroccan design consortium',
    status: { en: 'In Progress', ar: 'قيد التنفيذ', fr: 'En cours' },
    statusColor: '#f59e0b',
    statusIcon: '\u{1F7E1}',
    completion: '2028',
    description: {
      en: 'The most ambitious expansion in the programme relative to its starting point, the Grand Stade de Fes is nearly doubling in capacity from 35,500 to 65,000 seats. Work began in 2025 with demolition of the original upper sections.',
      ar: 'التوسعة الأكثر طموحاً في البرنامج نسبةً لنقطة البداية، يتضاعف ملعب فاس الكبير تقريباً من 35,500 إلى 65,000 مقعد. بدأت الأعمال في 2025.',
      fr: 'L\'expansion la plus ambitieuse du programme par rapport à son point de départ, le Grand Stade de Fès double presque sa capacité de 35 500 à 65 000 places. Les travaux ont commencé en 2025.',
    },
  },
  {
    name: 'Adrar Stadium',
    city: { en: 'Agadir', ar: 'أكادير', fr: 'Agadir' },
    currentCapacity: '45,000',
    targetCapacity: '70,000',
    budget: '$220 million (expansion)',
    architect: 'Populous (original) / expansion consortium',
    status: { en: 'Design Phase', ar: 'مرحلة التصميم', fr: 'Phase de conception' },
    statusColor: '#3b82f6',
    statusIcon: '\u{1F535}',
    completion: '2028',
    description: {
      en: 'Agadir\'s Adrar Stadium \u2014 named from the Tachelhit Berber word for mountain \u2014 is in the advanced design phase for its expansion from 45,000 to 70,000 seats.',
      ar: 'ملعب أدرار بأكادير \u2014 المسمى بالكلمة الأمازيغية التي تعني الجبل \u2014 في مرحلة التصميم المتقدمة لتوسعته من 45,000 إلى 70,000 مقعد.',
      fr: 'Le stade Adrar d\'Agadir \u2014 du mot amazigh signifiant montagne \u2014 est en phase de conception avancée pour son extension de 45 000 à 70 000 places.',
    },
  },
]

const TIMELINE = [
  { year: '2024', quarter: 'Q1', event: { en: 'FIFA officially confirms Morocco, Spain and Portugal as 2030 hosts', ar: 'FIFA يؤكد رسمياً المغرب وإسبانيا والبرتغال كمضيفين 2030', fr: 'La FIFA confirme officiellement le Maroc, l\'Espagne et le Portugal comme hôtes 2030' }, accent: 'var(--green)' },
  { year: '2024', quarter: 'Q2', event: { en: 'Grand Stade Hassan II ground-breaking ceremony in El Mansouria', ar: 'حفل وضع حجر الأساس لملعب الحسن الثاني الكبير في المنصورية', fr: 'Cérémonie de pose de la première pierre du Grand Stade Hassan II' }, accent: 'var(--green)' },
  { year: '2024', quarter: 'Q3', event: { en: 'Ibn Batouta Stadium expansion works commence in Tangier', ar: 'بدء أعمال توسعة ملعب ابن بطوطة في طنجة', fr: 'Début des travaux d\'agrandissement du stade Ibn Batouta à Tanger' }, accent: 'var(--gold)' },
  { year: '2024', quarter: 'Q4', event: { en: 'Royal Commission approves $16 billion infrastructure master plan', ar: 'اللجنة الملكية تعتمد المخطط الشامل للبنية التحتية بقيمة 16 مليار دولار', fr: 'La Commission Royale approuve le plan directeur de 16 milliards $' }, accent: 'var(--gold)' },
  { year: '2025', quarter: 'Q1', event: { en: 'Grand Stade de Marrakech renovation phase two begins', ar: 'بدء المرحلة الثانية من تجديد ملعب مراكش الكبير', fr: 'Début de la phase deux de rénovation du Grand Stade de Marrakech' }, accent: 'var(--gold)' },
  { year: '2025', quarter: 'Q2', event: { en: 'Grand Stade de Fes expansion works commence', ar: 'بدء أعمال توسعة ملعب فاس الكبير', fr: 'Début des travaux d\'expansion du Grand Stade de Fès' }, accent: 'var(--gold)' },
  { year: '2025', quarter: 'Q3', event: { en: 'TGV Marrakech-Agadir route construction begins', ar: 'بدء بناء خط TGV مراكش-أكادير', fr: 'Début de la construction de la ligne TGV Marrakech-Agadir' }, accent: 'var(--navy)' },
  { year: '2025', quarter: 'Q4', event: { en: 'Mohammed V Airport Terminal 3 construction starts', ar: 'بدء بناء المحطة 3 في مطار محمد الخامس', fr: 'Début de la construction du Terminal 3 de l\'aéroport Mohammed V' }, accent: 'var(--navy)' },
  { year: '2026', quarter: 'Q1', event: { en: 'Adrar Stadium expansion ground-breaking in Agadir', ar: 'وضع حجر الأساس لتوسعة ملعب أدرار في أكادير', fr: 'Pose de la première pierre de l\'extension du stade Adrar à Agadir' }, accent: 'var(--gold)' },
  { year: '2026', quarter: 'Q2', event: { en: 'Grand Stade Hassan II structural frame reaches 50% completion', ar: 'الهيكل الإنشائي لملعب الحسن الثاني الكبير يصل 50%', fr: 'La structure du Grand Stade Hassan II atteint 50%' }, accent: 'var(--green)' },
  { year: '2026', quarter: 'Q4', event: { en: 'Highway upgrades between all six host cities completed', ar: 'اكتمال تحديث الطرق السريعة بين جميع المدن المضيفة الست', fr: 'Achèvement des mises à niveau routières entre les six villes hôtes' }, accent: 'var(--navy)' },
  { year: '2027', quarter: 'Q1', event: { en: 'Marrakech-Menara Airport expansion completed', ar: 'اكتمال توسعة مطار مراكش المنارة', fr: 'Achèvement de l\'extension de l\'aéroport de Marrakech-Ménara' }, accent: 'var(--navy)' },
  { year: '2027', quarter: 'Q2', event: { en: 'Grand Stade Hassan II roof canopy installation begins', ar: 'بدء تركيب مظلة سقف ملعب الحسن الثاني الكبير', fr: 'Début de l\'installation de la canopée du Grand Stade Hassan II' }, accent: 'var(--green)' },
  { year: '2027', quarter: 'Q4', event: { en: 'Urban tram extensions completed in Casablanca and Rabat', ar: 'اكتمال امتدادات الترام الحضري في الدار البيضاء والرباط', fr: 'Achèvement des extensions de tramway à Casablanca et Rabat' }, accent: 'var(--navy)' },
  { year: '2028', quarter: 'Q1', event: { en: 'Grand Stade de Marrakech and Ibn Batouta Stadium completed', ar: 'اكتمال ملعب مراكش الكبير وملعب ابن بطوطة', fr: 'Achèvement du Grand Stade de Marrakech et du stade Ibn Batouta' }, accent: 'var(--green)' },
  { year: '2028', quarter: 'Q2', event: { en: 'Grand Stade de Fes and Adrar Stadium completed', ar: 'اكتمال ملعب فاس الكبير وملعب أدرار', fr: 'Achèvement du Grand Stade de Fès et du stade Adrar' }, accent: 'var(--green)' },
  { year: '2028', quarter: 'Q3', event: { en: 'Grand Stade Hassan II construction completed', ar: 'اكتمال بناء ملعب الحسن الثاني الكبير', fr: 'Achèvement de la construction du Grand Stade Hassan II' }, accent: 'var(--green)' },
  { year: '2028', quarter: 'Q4', event: { en: 'TGV Marrakech-Agadir line operational', ar: 'تشغيل خط TGV مراكش-أكادير', fr: 'Mise en service de la ligne TGV Marrakech-Agadir' }, accent: 'var(--navy)' },
  { year: '2029', quarter: 'Q1', event: { en: 'All six stadiums pass FIFA inspection', ar: 'جميع الملاعب الستة تجتاز تفتيش FIFA', fr: 'Les six stades passent l\'inspection FIFA' }, accent: 'var(--green)' },
  { year: '2029', quarter: 'Q2', event: { en: 'Hotel capacity targets met across all host cities', ar: 'تحقيق أهداف الطاقة الفندقية في جميع المدن المضيفة', fr: 'Objectifs de capacité hôtelière atteints dans toutes les villes' }, accent: 'var(--red)' },
  { year: '2029', quarter: 'Q3', event: { en: 'FIFA fan zones and training facilities operational', ar: 'تشغيل مناطق المشجعين ومرافق التدريب', fr: 'Zones de supporters et centres d\'entraînement opérationnels' }, accent: 'var(--red)' },
  { year: '2029', quarter: 'Q4', event: { en: 'Final infrastructure readiness review by FIFA delegation', ar: 'المراجعة النهائية لجاهزية البنية التحتية من وفد FIFA', fr: 'Revue finale de préparation par la délégation FIFA' }, accent: 'var(--green)' },
  { year: '2030', quarter: 'Q2', event: { en: 'FIFA World Cup 2030 kicks off in Morocco', ar: 'انطلاق كأس العالم 2030 في المغرب', fr: 'La Coupe du Monde FIFA 2030 commence au Maroc' }, accent: 'var(--green)' },
]

const TRANSIT_PROJECTS = {
  en: [
    { title: 'Casablanca Tram Extension', detail: 'Three new tram lines connecting the city centre to the Grand Stade Hassan II corridor, with dedicated World Cup express services planned for match days.' },
    { title: 'Rabat-Sale Metro', detail: 'Expansion of the existing tram network with two new lines serving the Hay Riad stadium district and Rabat-Sale airport, completing a 52 km urban transit network.' },
    { title: 'Marrakech Bus Rapid Transit', detail: 'A new BRT system with dedicated lanes connecting the airport, city centre, and Grand Stade de Marrakech \u2014 Marrakech\'s first mass transit system.' },
    { title: 'Tangier Urban Rail', detail: 'A light rail connection between Tangier Ville station, the new marina district, and Ibn Batouta Stadium, integrating with the Al Boraq high-speed network.' },
  ],
  ar: [
    { title: 'امتداد ترام الدار البيضاء', detail: 'ثلاثة خطوط ترام جديدة تربط وسط المدينة بممر ملعب الحسن الثاني الكبير، مع خدمات سريعة مخصصة أيام المباريات.' },
    { title: 'مترو الرباط-سلا', detail: 'توسيع شبكة الترام الحالية بخطين جديدين يخدمان منطقة ملعب حي الرياض ومطار الرباط-سلا.' },
    { title: 'حافلات النقل السريع بمراكش', detail: 'نظام BRT جديد بمسارات مخصصة يربط المطار ووسط المدينة وملعب مراكش الكبير.' },
    { title: 'السكك الحديدية الحضرية بطنجة', detail: 'خط سكة حديدية خفيفة يربط محطة طنجة المدينة ومنطقة المارينا الجديدة وملعب ابن بطوطة.' },
  ],
  fr: [
    { title: 'Extension du tramway de Casablanca', detail: 'Trois nouvelles lignes de tramway reliant le centre-ville au Grand Stade Hassan II, avec des services express dédiés les jours de match.' },
    { title: 'Métro Rabat-Salé', detail: 'Extension du réseau de tramway existant avec deux nouvelles lignes desservant le quartier du stade Hay Riad et l\'aéroport.' },
    { title: 'Bus à haut niveau de service de Marrakech', detail: 'Un nouveau système BRT avec des voies dédiées reliant l\'aéroport, le centre-ville et le Grand Stade de Marrakech.' },
    { title: 'Rail urbain de Tanger', detail: 'Une liaison ferroviaire légère entre la gare de Tanger Ville, le nouveau quartier de la marina et le stade Ibn Batouta.' },
  ],
}

const RAIL_EXTENSIONS = {
  en: [
    { route: 'Marrakech-Agadir Extension', distance: '~230 km', status: 'Construction started Q3 2025', detail: 'Connects Morocco\'s tourist capital to the southern Atlantic coast. Journey time target: 1 hour 20 minutes. Estimated cost: $4.5 billion. Operational target: late 2028.' },
    { route: 'Casablanca-Marrakech Extension', distance: '~220 km', status: 'Construction started 2024', detail: 'Extends the Al Boraq from its current Casablanca terminus south to Marrakech. Journey time target: 1 hour 10 minutes. This segment connects three host city corridors into a single high-speed spine.' },
    { route: 'Tangier-Tetouan Spur', distance: '~60 km', status: 'Design phase', detail: 'A branch line from the existing Al Boraq mainline to Tetouan, improving connectivity in the northern Rif region.' },
  ],
  ar: [
    { route: 'امتداد مراكش-أكادير', distance: '~230 كم', status: 'بدأ البناء الربع الثالث 2025', detail: 'يربط العاصمة السياحية بالساحل الأطلسي الجنوبي. هدف وقت الرحلة: ساعة و20 دقيقة. التكلفة المقدرة: 4.5 مليار دولار.' },
    { route: 'امتداد الدار البيضاء-مراكش', distance: '~220 كم', status: 'بدأ البناء 2024', detail: 'يمتد البراق من محطة الدار البيضاء الحالية جنوباً إلى مراكش. هدف وقت الرحلة: ساعة و10 دقائق.' },
    { route: 'فرع طنجة-تطوان', distance: '~60 كم', status: 'مرحلة التصميم', detail: 'خط فرعي من الخط الرئيسي للبراق إلى تطوان، لتحسين الربط في منطقة الريف الشمالية.' },
  ],
  fr: [
    { route: 'Extension Marrakech-Agadir', distance: '~230 km', status: 'Construction démarrée T3 2025', detail: 'Relie la capitale touristique à la côte atlantique sud. Objectif de temps de trajet : 1h20. Coût estimé : 4,5 milliards $.' },
    { route: 'Extension Casablanca-Marrakech', distance: '~220 km', status: 'Construction démarrée 2024', detail: 'Prolonge l\'Al Boraq de Casablanca vers le sud jusqu\'à Marrakech. Objectif de temps de trajet : 1h10.' },
    { route: 'Embranchement Tanger-Tétouan', distance: '~60 km', status: 'Phase de conception', detail: 'Un embranchement depuis la ligne principale Al Boraq vers Tétouan, améliorant la connectivité dans la région du Rif.' },
  ],
}

const AIRPORTS = [
  { airport: 'Mohammed V International', city: { en: 'Casablanca', ar: 'الدار البيضاء', fr: 'Casablanca' }, current: '14M pax/yr', target: '24M pax/yr', status: { en: 'Terminal 3 under construction', ar: 'المحطة 3 قيد البناء', fr: 'Terminal 3 en construction' } },
  { airport: 'Marrakech Menara', city: { en: 'Marrakech', ar: 'مراكش', fr: 'Marrakech' }, current: '9M pax/yr', target: '16M pax/yr', status: { en: 'New terminal in progress', ar: 'محطة جديدة قيد التنفيذ', fr: 'Nouveau terminal en cours' } },
  { airport: 'Ibn Battuta', city: { en: 'Tangier', ar: 'طنجة', fr: 'Tanger' }, current: '3M pax/yr', target: '7M pax/yr', status: { en: 'Expansion started 2025', ar: 'بدأت التوسعة 2025', fr: 'Expansion commencée 2025' } },
  { airport: 'Fes-Saiss', city: { en: 'Fes', ar: 'فاس', fr: 'Fès' }, current: '2.5M pax/yr', target: '5M pax/yr', status: { en: 'Design phase', ar: 'مرحلة التصميم', fr: 'Phase de conception' } },
  { airport: 'Al Massira', city: { en: 'Agadir', ar: 'أكادير', fr: 'Agadir' }, current: '3.5M pax/yr', target: '7M pax/yr', status: { en: 'Expansion started 2025', ar: 'بدأت التوسعة 2025', fr: 'Expansion commencée 2025' } },
]

const HOTEL_CITIES = [
  { city: { en: 'Casablanca', ar: 'الدار البيضاء', fr: 'Casablanca' }, current: '18,000', target: '38,000' },
  { city: { en: 'Rabat', ar: 'الرباط', fr: 'Rabat' }, current: '8,500', target: '20,000' },
  { city: { en: 'Marrakech', ar: 'مراكش', fr: 'Marrakech' }, current: '45,000', target: '65,000' },
  { city: { en: 'Tangier', ar: 'طنجة', fr: 'Tanger' }, current: '12,000', target: '28,000' },
  { city: { en: 'Fes', ar: 'فاس', fr: 'Fès' }, current: '9,000', target: '22,000' },
  { city: { en: 'Agadir', ar: 'أكادير', fr: 'Agadir' }, current: '32,000', target: '50,000' },
]

export default async function ConstructionPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params
  const lang: Lang = (['en', 'ar', 'fr'].includes(rawLang) ? rawLang : 'en') as Lang
  const t = T[lang]
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const p = lang === 'en' ? '' : `/${lang}`

  return (
    <main dir={dir}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 20px 80px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 32, fontWeight: 800, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.1, marginBottom: 12 }}>
            {t.title}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.7, color: 'var(--text-sec)', maxWidth: 640 }}>
            {t.subtitle}
          </p>
        </div>

        {/* SECTION 1: OVERVIEW */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{
            fontFamily: 'var(--font-head)',
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text)',
            marginBottom: 4,
          }}>
            {t.programmeOverview}
          </h2>
          <div style={{ width: 40, height: 3, background: 'var(--green, #0a5229)', borderRadius: 2, marginBottom: 20 }} />
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.85, color: 'var(--text-sec)' }}>
              <p style={{ marginBottom: '1.2rem' }}>{t.overviewP1}</p>
              <p style={{ marginBottom: '1.2rem' }}>{t.overviewP2}</p>
              <p style={{ marginBottom: '1.2rem' }}>{t.overviewP3}</p>
              <p style={{ marginBottom: 0 }}>{t.overviewP4}</p>
            </div>

            {/* Key figures */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginTop: 24 }}>
              {[
                { label: t.totalInvestment, value: '$16B' },
                { label: t.stadiums, value: '6' },
                { label: t.timeline, value: '2024-2029' },
                { label: t.totalCapacity, value: '460,000+' },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: 'var(--card)', padding: '14px 12px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--green)', lineHeight: 1 }}>{value}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 6 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: STADIUM PROJECTS */}
        <div style={{ marginBottom: 48 }}>
          <div className="matchday-header" style={{ marginBottom: 24 }}>
            <span style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)' }}>
              {t.stadiumProjects}
            </span>
          </div>

          {STADIUMS.map((s) => (
            <div key={s.name} className="card" style={{ marginBottom: 20, padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.1, marginBottom: 2 }}>
                    {s.name}
                  </h3>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {s.city[lang]}
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', background: s.statusColor, padding: '4px 12px', borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap' }}>
                  {s.statusIcon} {s.status[lang]}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, background: 'var(--border)', borderBottom: '1px solid var(--border)' }}>
                {[
                  { label: t.capacity, value: s.currentCapacity === 'New build' ? `New build \u2192 ${s.targetCapacity}` : `${s.currentCapacity} \u2192 ${s.targetCapacity}` },
                  { label: t.budget, value: s.budget },
                  { label: t.architect, value: s.architect },
                  { label: t.expectedCompletion, value: s.completion },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: 'var(--card)', padding: '10px 16px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-faint)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text)', lineHeight: 1.4 }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '16px 20px' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.8, color: 'var(--text-sec)', margin: 0 }}>
                  {s.description[lang]}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION 3: TRANSPORT INFRASTRUCTURE */}
        <div style={{ marginBottom: 48 }}>
          <div className="matchday-header" style={{ marginBottom: 24 }}>
            <span style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)' }}>
              {t.transportInfrastructure}
            </span>
          </div>

          {/* TGV */}
          <div className="card" style={{ marginBottom: 20, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <div className="sec-head" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
                <div className="sec-bar b-navy" />
                <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)' }}>
                  {t.tgvTitle}
                </h3>
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.8, color: 'var(--text-sec)', marginBottom: '1.2rem' }}>
                {t.tgvDesc}
              </p>
              <div style={{ display: 'grid', gap: 12 }}>
                {RAIL_EXTENSIONS[lang].map((r) => (
                  <div key={r.route} style={{ background: 'var(--card-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{r.route}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--navy)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{r.distance}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', marginBottom: 8 }}>{r.status}</div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.7, color: 'var(--text-sec)', margin: 0 }}>{r.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Airport Expansions */}
          <div className="card" style={{ marginBottom: 20, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <div className="sec-head" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
                <div className="sec-bar b-red" />
                <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)' }}>
                  {t.airportExpansions}
                </h3>
              </div>
            </div>
            <div style={{ padding: '0' }}>
              <div className="data-table">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {t.airportHeaders.map((h) => (
                        <th key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-faint)', padding: '10px 14px', textAlign: lang === 'ar' ? 'right' : 'left', borderBottom: '1px solid var(--border)' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {AIRPORTS.map((a, i) => (
                      <tr key={a.airport} style={{ borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                        <td style={{ fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 700, color: 'var(--text)', padding: '10px 14px' }}>{a.airport}</td>
                        <td style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-sec)', padding: '10px 14px' }}>{a.city[lang]}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)', padding: '10px 14px' }}>{a.current}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--green)', padding: '10px 14px' }}>{a.target}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', padding: '10px 14px' }}>{a.status[lang]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Highways & Urban Transit */}
          <div className="card" style={{ marginBottom: 20, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <div className="sec-head" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
                <div className="sec-bar b-gold" />
                <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)' }}>
                  {t.highwaysUrban}
                </h3>
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.8, color: 'var(--text-sec)', marginBottom: '1.2rem' }}>
                {t.highwaysDesc}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {TRANSIT_PROJECTS[lang].map((tp) => (
                  <div key={tp.title} style={{ background: 'var(--card-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 16px' }}>
                    <div style={{ fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{tp.title}</div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.6, color: 'var(--text-sec)', margin: 0 }}>{tp.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: HOTEL & HOSPITALITY */}
        <div style={{ marginBottom: 48 }}>
          <div className="matchday-header" style={{ marginBottom: 24 }}>
            <span style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)' }}>
              {t.hotelHospitality}
            </span>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '24px' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.85, color: 'var(--text-sec)', marginBottom: '1.2rem' }}>
                {t.hotelP1}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.8, color: 'var(--text-sec)', marginBottom: '1.2rem' }}>
                {t.hotelP2}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 24 }}>
                {HOTEL_CITIES.map((c) => (
                  <div key={c.city.en} style={{ background: 'var(--card)', padding: '12px 14px' }}>
                    <div style={{ fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{c.city[lang]}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-sec)' }}>
                      {c.current} <span style={{ color: 'var(--text-faint)' }}>{'\u2192'}</span> <span style={{ color: 'var(--green)', fontWeight: 700 }}>{c.target}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-faint)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>{t.rooms}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ background: 'var(--navy-light)', border: '1px solid #c8d4f0', borderRadius: 'var(--radius)', padding: '16px 20px' }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: 8 }}>
                    {t.fanZones}
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-sec)', lineHeight: 1.7, margin: 0 }}>
                    {t.fanZonesDesc}
                  </p>
                </div>
                <div style={{ background: 'var(--card-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px' }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 8 }}>
                    {t.trainingFacilities}
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-sec)', lineHeight: 1.7, margin: 0 }}>
                    {t.trainingDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: TIMELINE */}
        <div style={{ marginBottom: 48 }}>
          <div className="matchday-header" style={{ marginBottom: 24 }}>
            <span style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)' }}>
              {t.constructionTimeline}
            </span>
          </div>

          <div className="card" style={{ padding: '24px 20px' }}>
            <div style={{ position: 'relative', paddingLeft: lang === 'ar' ? 0 : 28, paddingRight: lang === 'ar' ? 28 : 0 }}>
              <div style={{ position: 'absolute', [lang === 'ar' ? 'right' : 'left']: 7, top: 8, bottom: 8, width: 2, background: 'var(--border)' }} />

              {TIMELINE.map((tl, i) => {
                const prevYear = i > 0 ? TIMELINE[i - 1].year : null
                const showYear = tl.year !== prevYear

                return (
                  <div key={`${tl.year}-${tl.quarter}-${i}`} style={{ position: 'relative', marginBottom: i < TIMELINE.length - 1 ? 20 : 0 }}>
                    <div style={{
                      position: 'absolute', [lang === 'ar' ? 'right' : 'left']: -24,
                      top: showYear ? 28 : 4,
                      width: 16, height: 16, borderRadius: '50%',
                      background: tl.accent, border: '3px solid var(--card)',
                      boxShadow: '0 0 0 1px var(--border)',
                    }} />

                    {showYear && (
                      <div style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 800, color: 'var(--text)', lineHeight: 1, marginBottom: 10 }}>
                        {tl.year}
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', background: tl.accent, padding: '2px 8px', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}>
                        {tl.quarter}
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-sec)', lineHeight: 1.5 }}>
                        {tl.event[lang]}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom navigation */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={`${p}/world-cup-2030/stadiums`} style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold)', background: 'var(--gold-light)', border: '1px solid #e0c88a', borderRadius: 'var(--radius-sm)', padding: '10px 20px', textDecoration: 'none' }}>
            {t.stadiumGuidesLink} {'\u2192'}
          </Link>
          <Link href={`${p}/world-cup-2030/cities`} style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--green)', background: 'var(--green-light)', border: '1px solid #b0d8c0', borderRadius: 'var(--radius-sm)', padding: '10px 20px', textDecoration: 'none' }}>
            {t.cityGuidesLink} {'\u2192'}
          </Link>
          <Link href={`${p}/world-cup-2030/travel`} style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--navy)', background: 'var(--navy-light)', border: '1px solid #c8d4f0', borderRadius: 'var(--radius-sm)', padding: '10px 20px', textDecoration: 'none' }}>
            {t.travelGuideLink} {'\u2192'}
          </Link>
        </div>
      </div>
    </main>
  )
}
