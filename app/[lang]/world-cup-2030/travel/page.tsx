/**
 * /world-cup-2030/travel — fan travel guide.
 * ─────────────────────────────────────────────────────────────────────
 *
 * Phase F conversion (§6): client → server component.
 *
 * Changes vs the previous client version:
 *   - Strip 'use client' — this is pure static content
 *   - Derive lang from the route param instead of usePathname()
 *   - Add generateMetadata via pageMetadata('world-cup-2030/travel')
 *     (entry pre-positioned in Phase B.1b)
 *   - Add shared Breadcrumb at the top
 *   - Add revalidate = 86400 (static content, daily refresh)
 *
 * NOT changed in Phase F:
 *   - The T dict + all data structures (AIRPORTS, EMERGENCY_CONTACTS,
 *     etc.) are already localised for EN/AR/FR. No body translations
 *     in this phase.
 *   - Page visual layout — no redesign, just the shell around it.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { pageMetadata } from '@/lib/seo/pageMetadata'
import type { Lang } from '@/lib/i18n/config'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return pageMetadata('world-cup-2030/travel', lang, '/world-cup-2030/travel')
}

export const revalidate = 86400

const T = {
  en: {
    topLabel: 'World Cup 2030 Travel Guide',
    title: 'Welcome to Morocco',
    intro: 'In 2030, Morocco becomes the first African nation to host the FIFA World Cup on home soil. Six cities, six stadiums, one extraordinary country. This is your comprehensive guide to travelling to Morocco for the tournament \u2014 from visa requirements to where to find the best tagine at midnight.',
    introP2: 'Morocco has been preparing for this moment for decades. Four previous bids refined the infrastructure, sharpened the vision, and deepened the national determination. The 2030 tournament, shared with Spain and Portugal but with Morocco hosting the majority of group-stage and knockout matches, represents the fulfilment of a generational ambition.',
    introP3: 'For football fans, Morocco offers something unique among World Cup host nations: genuine warmth, staggering cultural depth, excellent food at every price point, reliable transport infrastructure that has been upgraded specifically for 2030, and a climate that \u2014 while hot in the south \u2014 is moderated along the Atlantic coast where most venues are located.',
    visaTitle: 'Visa & Entry Requirements',
    visaP1: 'Morocco maintains a generous visa-free policy for citizens of over 65 countries, allowing stays of up to 90 days without a prior visa. This covers most major football nations, including the entire European Union, the United Kingdom, the United States, Canada, Australia, Japan, South Korea, Brazil, Argentina, and most of Sub-Saharan Africa.',
    visaFreeLabel: 'Visa-Free Entry (90 Days) \u2014 Selected Countries',
    visaFreeList: 'All EU member states, United Kingdom, United States, Canada, Australia, New Zealand, Japan, South Korea, Brazil, Argentina, Mexico, Chile, Peru, Turkey, Russia, South Africa, Nigeria, Senegal, Ivory Coast, Ghana, Gabon, DR Congo, Tunisia, Algeria, Libya, UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, and others.',
    visaP2: 'Citizens of countries not on the visa-free list can apply for an e-visa through Morocco\u2019s online portal. For the 2030 World Cup, Morocco is expected to introduce a FIFA Fan ID system which may grant visa-free or expedited entry for ticket holders from all countries.',
    important: 'Important',
    visaImportant: 'Your passport must be valid for at least six months beyond your planned departure date. No specific vaccinations are required for entry into Morocco, though routine vaccinations should be up to date. Travel insurance is strongly recommended but not legally mandatory.',
    airportsTitle: 'Getting There \u2014 Airports',
    airportsP1: 'Morocco has six international airports serving the six host cities. Mohammed V International in Casablanca is the primary hub, handling the majority of long-haul traffic, but Marrakech and Agadir are also well-served by European budget carriers.',
    distanceToStadium: 'Distance to Stadium',
    transportConnections: 'Transport & Connections',
    gettingAround: 'Getting Around Morocco',
    gettingAroundP1: 'Morocco\u2019s domestic transport network has been transformed in the decade leading up to 2030. The Al Boraq high-speed rail line, Africa\u2019s first TGV service, is the backbone of inter-city travel.',
    alBoraqTitle: 'Al Boraq High-Speed Rail (TGV)',
    alBoraqDesc: 'Africa\u2019s only high-speed train connects Tangier, Kenitra, Rabat, and Casablanca at speeds up to 320 km/h. The Tangier-Casablanca journey takes approximately 2 hours 10 minutes. An extension to Marrakech is under construction. Tickets: 200-350 MAD (18-32 EUR) one-way.',
    whereToStay: 'Where to Stay',
    whereToStayP1: 'Morocco offers accommodation at every price point, from dormitory hostels at 80 MAD per night to palatial five-star riads at 5,000 MAD and above. During the World Cup, prices will rise significantly. Book as early as possible.',
    budgetLabel: 'Budget',
    midRangeLabel: 'Mid-Range',
    luxuryLabel: 'Luxury',
    bestNeighbourhoods: 'Best Neighbourhoods by City',
    foodDrink: 'Food & Drink',
    foodP1: 'Moroccan cuisine is one of the great cuisines of the world \u2014 a complex layering of Arab, Berber, Andalusian, and French influences. Eating well in Morocco is easy at every budget.',
    mustTryDishes: 'Must-Try Dishes',
    whereToEatLabel: 'Where to Eat',
    whereToEatP1: 'Street food stalls and market eateries offer complete meals for 20-50 MAD. Neighbourhood restaurants charge 50-120 MAD per person. Upscale restaurants range from 200-600 MAD per person.',
    dietaryNotes: 'Dietary Notes',
    dietaryText: 'All meat in Morocco is halal. Vegetarian options are plentiful. Vegan travellers should specify \u201cbla lham, bla halib\u201d (no meat, no dairy). Gluten-free options are limited but improving.',
    drinksTipping: 'Drinks & Tipping',
    drinksText: 'Mint tea (\u201catay\u201d) is the national drink. Fresh orange juice costs 5-10 MAD. Alcohol is available in licensed restaurants, hotels, and supermarkets. Tip 10-15% in restaurants; round up for taxis.',
    cultureEtiquette: 'Culture & Etiquette',
    cultureP1: 'Morocco is a Muslim-majority country with a deeply hospitable culture and a long history of welcoming visitors. A few basic courtesies will significantly improve your experience.',
    dressCode: 'Dress Code',
    dressText: 'Casual Western clothing is fine in modern city areas. In medinas and rural areas, cover shoulders and knees. Swimwear only at beaches and pools.',
    photography: 'Photography',
    photoText: 'Ask before photographing people. Street performers may request payment. Never photograph military or police installations.',
    bargaining: 'Bargaining',
    bargainText: 'Expected in souks and markets. Start at 40-50% of asking price. Fixed prices in supermarkets and modern shops.',
    ramadan: 'Ramadan',
    ramadanText: 'If the World Cup overlaps with Ramadan, be aware of fasting hours. Eating in public during fasting hours is discouraged. Tourist restaurants remain open.',
    darijaPhrases: 'Darija Phrases for Football Fans',
    safety: 'Safety',
    safetyText: 'Morocco is generally safe for tourists. Petty crime exists in busy areas \u2014 use normal precautions. Tourist police (Brigade Touristique) can assist in multiple languages.',
    weatherTitle: 'Weather \u2014 June & July 2030',
    weatherP1: 'The 2030 World Cup is expected in June and July. Coastal cities are comfortable; inland cities can be genuinely hot.',
    whatToPack: 'What to Pack',
    whatToPackText: 'Light, breathable clothing. A light jacket for AC and evening breezes. Comfortable walking shoes. Sunscreen SPF 50+, sunglasses, hat. Reusable water bottle. Small daypack for match days. Modest clothing for traditional areas.',
    moneyBudget: 'Money & Budget',
    moneyP1: 'The Moroccan Dirham (MAD) is the official currency. Bring euros/pounds/dollars and exchange on arrival, or use ATMs. Credit cards accepted in hotels and restaurants.',
    currency: 'Currency',
    currencyVal: 'Moroccan Dirham (MAD)',
    currencySub: '1 EUR ~ 11 MAD | 1 USD ~ 10 MAD | 1 GBP ~ 13 MAD',
    atms: 'ATMs',
    atmsVal: 'Widely available',
    atmsSub: 'All major cities. Visa/Mastercard accepted.',
    cards: 'Cards',
    cardsVal: 'Hotels & restaurants',
    cardsSub: 'Visa and Mastercard preferred. Cash essential for markets.',
    dailyBudget: 'Daily Budget Estimates',
    budgetDaily: '400-700 MAD/day',
    budgetEur: '~36-63 EUR',
    budgetIncludes: 'Hostel/budget hotel, street food, public transport',
    midDaily: '1,000-2,000 MAD/day',
    midEur: '~90-180 EUR',
    midIncludes: 'Good riad or 3-star hotel, restaurant meals, taxis, tours',
    luxDaily: '3,000-6,000+ MAD/day',
    luxEur: '~270-540+ EUR',
    luxIncludes: 'Boutique riad or 5-star hotel, fine dining, premium experiences',
    contacts: 'Useful Contacts & Emergency Numbers',
    embassies: 'Embassies & Consulates',
    embassiesText: 'Most major countries maintain embassies in Rabat and consulates in Casablanca. Register with your embassy before travelling.',
    hostCityGuides: 'Host City Guides',
    stadiumGuides: 'Stadium Guides',
    wc2030Hub: 'WC 2030 Hub',
  },
  ar: {
    topLabel: 'دليل السفر لكأس العالم 2030',
    title: 'مرحباً بكم في المغرب',
    intro: 'في 2030، يصبح المغرب أول دولة أفريقية تستضيف كأس العالم FIFA على أرضها. ست مدن، ستة ملاعب، بلد استثنائي واحد. هذا دليلك الشامل للسفر إلى المغرب للبطولة.',
    introP2: 'يستعد المغرب لهذه اللحظة منذ عقود. أربع ترشيحات سابقة صقلت البنية التحتية وعمّقت العزيمة الوطنية. بطولة 2030، المشتركة مع إسبانيا والبرتغال، تمثل تحقيق طموح جيل كامل.',
    introP3: 'للمشجعين، يقدم المغرب شيئاً فريداً: دفء حقيقي، عمق ثقافي مذهل، طعام ممتاز بكل ميزانية، وبنية تحتية للنقل تم تطويرها خصيصاً لـ 2030.',
    visaTitle: 'متطلبات التأشيرة والدخول',
    visaP1: 'يحتفظ المغرب بسياسة إعفاء سخية من التأشيرة لمواطني أكثر من 65 دولة، مما يسمح بإقامات تصل إلى 90 يوماً.',
    visaFreeLabel: 'دخول بدون تأشيرة (90 يوماً) \u2014 دول مختارة',
    visaFreeList: 'جميع دول الاتحاد الأوروبي، المملكة المتحدة، الولايات المتحدة، كندا، أستراليا، نيوزيلندا، اليابان، كوريا الجنوبية، البرازيل، الأرجنتين، المكسيك، تشيلي، تركيا، روسيا، جنوب أفريقيا، نيجيريا، السنغال، تونس، الجزائر، الإمارات، السعودية، قطر وغيرها.',
    visaP2: 'يمكن لمواطني الدول غير المدرجة التقدم للحصول على تأشيرة إلكترونية. من المتوقع أن يقدم المغرب نظام Fan ID لكأس العالم 2030.',
    important: 'مهم',
    visaImportant: 'يجب أن يكون جواز سفرك صالحاً لمدة ستة أشهر على الأقل بعد تاريخ المغادرة المخطط. لا تُطلب تطعيمات محددة. يُنصح بشدة بتأمين السفر.',
    airportsTitle: 'الوصول \u2014 المطارات',
    airportsP1: 'يمتلك المغرب ستة مطارات دولية تخدم المدن المضيفة الست. مطار محمد الخامس الدولي في الدار البيضاء هو المحور الرئيسي.',
    distanceToStadium: 'المسافة إلى الملعب',
    transportConnections: 'النقل والمواصلات',
    gettingAround: 'التنقل في المغرب',
    gettingAroundP1: 'تم تحويل شبكة النقل المحلية للمغرب في العقد السابق لـ 2030. خط القطار فائق السرعة البراق هو العمود الفقري للتنقل بين المدن.',
    alBoraqTitle: 'القطار فائق السرعة البراق (TGV)',
    alBoraqDesc: 'القطار الوحيد فائق السرعة في أفريقيا يربط طنجة والقنيطرة والرباط والدار البيضاء بسرعة تصل إلى 320 كم/ساعة. رحلة طنجة-الدار البيضاء: ساعتان و10 دقائق. التذاكر: 200-350 درهم.',
    whereToStay: 'أين تقيم',
    whereToStayP1: 'يقدم المغرب إقامة بكل مستوى سعري. خلال كأس العالم سترتفع الأسعار بشكل كبير. احجز مبكراً قدر الإمكان.',
    budgetLabel: 'اقتصادي',
    midRangeLabel: 'متوسط',
    luxuryLabel: 'فاخر',
    bestNeighbourhoods: 'أفضل الأحياء حسب المدينة',
    foodDrink: 'الطعام والشراب',
    foodP1: 'المطبخ المغربي من أعظم المطابخ في العالم \u2014 مزيج معقد من التأثيرات العربية والأمازيغية والأندلسية والفرنسية.',
    mustTryDishes: 'أطباق يجب تجربتها',
    whereToEatLabel: 'أين تأكل',
    whereToEatP1: 'أكشاك الطعام تقدم وجبات كاملة بـ 20-50 درهم. المطاعم المحلية 50-120 درهم. المطاعم الراقية 200-600 درهم.',
    dietaryNotes: 'ملاحظات غذائية',
    dietaryText: 'جميع اللحوم في المغرب حلال. خيارات نباتية وفيرة. للنباتيين الصرف: قولوا \u201cبلا لحم، بلا حليب\u201d.',
    drinksTipping: 'المشروبات والإكراميات',
    drinksText: 'الشاي بالنعناع هو المشروب الوطني. عصير البرتقال الطازج 5-10 دراهم. الكحول متوفر في المطاعم والفنادق المرخصة. الإكرامية 10-15%.',
    cultureEtiquette: 'الثقافة والآداب',
    cultureP1: 'المغرب بلد ذو أغلبية مسلمة بثقافة ضيافة عميقة وتاريخ طويل في استقبال الزوار.',
    dressCode: 'قواعد اللباس',
    dressText: 'الملابس الغربية مقبولة في المناطق الحديثة. في المدن القديمة، غطّوا الأكتاف والركبتين.',
    photography: 'التصوير',
    photoText: 'اطلب الإذن قبل تصوير الناس. لا تصوّر المنشآت العسكرية أو الشرطية.',
    bargaining: 'المساومة',
    bargainText: 'متوقعة في الأسواق. ابدأ بـ 40-50% من السعر المطلوب. أسعار ثابتة في المتاجر الحديثة.',
    ramadan: 'رمضان',
    ramadanText: 'إذا تزامن كأس العالم مع رمضان، كن على دراية بساعات الصيام. يُفضل عدم الأكل علناً خلال ساعات الصيام.',
    darijaPhrases: 'عبارات دارجة لمشجعي كرة القدم',
    safety: 'الأمان',
    safetyText: 'المغرب آمن بشكل عام للسياح. توجد جرائم صغيرة في المناطق المزدحمة. الشرطة السياحية متوفرة بعدة لغات.',
    weatherTitle: 'الطقس \u2014 يونيو ويوليو 2030',
    weatherP1: 'من المتوقع إقامة كأس العالم 2030 في يونيو ويوليو. المدن الساحلية مريحة؛ المدن الداخلية قد تكون حارة جداً.',
    whatToPack: 'ما يجب حمله',
    whatToPackText: 'ملابس خفيفة. جاكيت خفيف للمكيفات. أحذية مشي مريحة. واقي شمس SPF 50+، نظارات شمسية، قبعة. زجاجة مياه قابلة لإعادة الاستخدام.',
    moneyBudget: 'المال والميزانية',
    moneyP1: 'الدرهم المغربي (MAD) هو العملة الرسمية. أحضر يورو/جنيه/دولار واستبدلها عند الوصول، أو استخدم الصرافات الآلية.',
    currency: 'العملة',
    currencyVal: 'الدرهم المغربي (MAD)',
    currencySub: '1 EUR ~ 11 MAD | 1 USD ~ 10 MAD | 1 GBP ~ 13 MAD',
    atms: 'الصرافات الآلية',
    atmsVal: 'متوفرة على نطاق واسع',
    atmsSub: 'جميع المدن الكبرى. فيزا/ماستركارد مقبولة.',
    cards: 'البطاقات',
    cardsVal: 'الفنادق والمطاعم',
    cardsSub: 'فيزا وماستركارد. النقد ضروري للأسواق.',
    dailyBudget: 'تقديرات الميزانية اليومية',
    budgetDaily: '400-700 MAD/يوم',
    budgetEur: '~36-63 EUR',
    budgetIncludes: 'نزل/فندق اقتصادي، طعام شارع، نقل عام',
    midDaily: '1,000-2,000 MAD/يوم',
    midEur: '~90-180 EUR',
    midIncludes: 'رياض جيد أو فندق 3 نجوم، وجبات مطاعم، تاكسي',
    luxDaily: '3,000-6,000+ MAD/يوم',
    luxEur: '~270-540+ EUR',
    luxIncludes: 'رياض فاخر أو فندق 5 نجوم، مطاعم راقية',
    contacts: 'أرقام مفيدة وطوارئ',
    embassies: 'السفارات والقنصليات',
    embassiesText: 'معظم الدول الكبرى لديها سفارات في الرباط وقنصليات في الدار البيضاء. سجّل لدى سفارتك قبل السفر.',
    hostCityGuides: 'دليل المدن المضيفة',
    stadiumGuides: 'دليل الملاعب',
    wc2030Hub: 'مركز كأس العالم 2030',
  },
  fr: {
    topLabel: 'Guide de voyage Coupe du Monde 2030',
    title: 'Bienvenue au Maroc',
    intro: 'En 2030, le Maroc devient la premi\u00e8re nation africaine \u00e0 accueillir la Coupe du Monde FIFA sur son sol. Six villes, six stades, un pays extraordinaire. Voici votre guide complet pour voyager au Maroc.',
    introP2: 'Le Maroc se pr\u00e9pare \u00e0 ce moment depuis des d\u00e9cennies. Quatre candidatures pr\u00e9c\u00e9dentes ont affin\u00e9 l\'infrastructure et renforc\u00e9 la d\u00e9termination nationale. Le tournoi 2030, partag\u00e9 avec l\'Espagne et le Portugal, repr\u00e9sente l\'accomplissement d\'une ambition g\u00e9n\u00e9rationnelle.',
    introP3: 'Pour les supporters, le Maroc offre quelque chose d\'unique : une chaleur humaine authentique, une profondeur culturelle saisissante, une cuisine excellente \u00e0 tous les prix, et une infrastructure de transport modernis\u00e9e sp\u00e9cifiquement pour 2030.',
    visaTitle: 'Visa & conditions d\'entr\u00e9e',
    visaP1: 'Le Maroc maintient une politique g\u00e9n\u00e9reuse d\'exemption de visa pour les citoyens de plus de 65 pays, permettant des s\u00e9jours jusqu\'\u00e0 90 jours.',
    visaFreeLabel: 'Entr\u00e9e sans visa (90 jours) \u2014 Pays s\u00e9lectionn\u00e9s',
    visaFreeList: 'Tous les \u00c9tats membres de l\'UE, Royaume-Uni, \u00c9tats-Unis, Canada, Australie, Nouvelle-Z\u00e9lande, Japon, Cor\u00e9e du Sud, Br\u00e9sil, Argentine, Mexique, Chili, Turquie, Russie, Afrique du Sud, Nigeria, S\u00e9n\u00e9gal, Tunisie, Alg\u00e9rie, \u00c9mirats, Arabie Saoudite, Qatar et autres.',
    visaP2: 'Les citoyens des pays non exempt\u00e9s peuvent demander un e-visa. Le Maroc devrait introduire un syst\u00e8me Fan ID pour 2030.',
    important: 'Important',
    visaImportant: 'Votre passeport doit \u00eatre valide au moins six mois apr\u00e8s votre date de d\u00e9part pr\u00e9vue. Aucune vaccination sp\u00e9cifique n\'est requise. L\'assurance voyage est fortement recommand\u00e9e.',
    airportsTitle: 'Comment y arriver \u2014 A\u00e9roports',
    airportsP1: 'Le Maroc dispose de six a\u00e9roports internationaux. Mohammed V \u00e0 Casablanca est le principal hub.',
    distanceToStadium: 'Distance au stade',
    transportConnections: 'Transport & connexions',
    gettingAround: 'Se d\u00e9placer au Maroc',
    gettingAroundP1: 'Le r\u00e9seau de transport marocain a \u00e9t\u00e9 transform\u00e9 dans la d\u00e9cennie pr\u00e9c\u00e9dant 2030. Le TGV Al Boraq est l\'\u00e9pine dorsale du transport interurbain.',
    alBoraqTitle: 'TGV Al Boraq',
    alBoraqDesc: 'Le seul train \u00e0 grande vitesse d\'Afrique relie Tanger, K\u00e9nitra, Rabat et Casablanca \u00e0 320 km/h. Trajet Tanger-Casablanca : 2h10. Billets : 200-350 MAD (18-32 EUR).',
    whereToStay: 'O\u00f9 s\u00e9journer',
    whereToStayP1: 'Le Maroc offre un h\u00e9bergement \u00e0 tous les prix. Pendant la Coupe du Monde, les prix augmenteront significativement. R\u00e9servez le plus t\u00f4t possible.',
    budgetLabel: 'Budget',
    midRangeLabel: 'Moyen de gamme',
    luxuryLabel: 'Luxe',
    bestNeighbourhoods: 'Meilleurs quartiers par ville',
    foodDrink: 'Nourriture & boissons',
    foodP1: 'La cuisine marocaine est l\'une des grandes cuisines du monde \u2014 un m\u00e9lange complexe d\'influences arabes, berb\u00e8res, andalouses et fran\u00e7aises.',
    mustTryDishes: 'Plats incontournables',
    whereToEatLabel: 'O\u00f9 manger',
    whereToEatP1: 'Les stands de rue offrent des repas complets pour 20-50 MAD. Restaurants de quartier : 50-120 MAD. Restaurants gastronomiques : 200-600 MAD.',
    dietaryNotes: 'Notes di\u00e9t\u00e9tiques',
    dietaryText: 'Toute la viande au Maroc est halal. Les options v\u00e9g\u00e9tariennes sont abondantes. Pour les v\u00e9gans : \u00ab bla lham, bla halib \u00bb (sans viande, sans lait).',
    drinksTipping: 'Boissons & pourboires',
    drinksText: 'Le th\u00e9 \u00e0 la menthe est la boisson nationale. Jus d\'orange frais : 5-10 MAD. L\'alcool est disponible dans les restaurants et h\u00f4tels agr\u00e9\u00e9s. Pourboire : 10-15%.',
    cultureEtiquette: 'Culture & \u00e9tiquette',
    cultureP1: 'Le Maroc est un pays \u00e0 majorit\u00e9 musulmane avec une culture d\'hospitalit\u00e9 profonde et une longue tradition d\'accueil des visiteurs.',
    dressCode: 'Code vestimentaire',
    dressText: 'Tenue d\u00e9contract\u00e9e acceptée dans les zones modernes. Dans les m\u00e9dinas, couvrir \u00e9paules et genoux.',
    photography: 'Photographie',
    photoText: 'Demandez avant de photographier les gens. Ne photographiez jamais les installations militaires.',
    bargaining: 'Marchandage',
    bargainText: 'Attendu dans les souks. Commencez \u00e0 40-50% du prix demand\u00e9. Prix fixes dans les magasins modernes.',
    ramadan: 'Ramadan',
    ramadanText: 'Si la Coupe du Monde co\u00efncide avec le Ramadan, soyez conscient des heures de je\u00fbne. Les restaurants touristiques restent ouverts.',
    darijaPhrases: 'Phrases en darija pour les supporters',
    safety: 'S\u00e9curit\u00e9',
    safetyText: 'Le Maroc est g\u00e9n\u00e9ralement s\u00fbr pour les touristes. La police touristique (Brigade Touristique) parle plusieurs langues.',
    weatherTitle: 'M\u00e9t\u00e9o \u2014 Juin & Juillet 2030',
    weatherP1: 'La Coupe du Monde 2030 est pr\u00e9vue en juin et juillet. Les villes c\u00f4ti\u00e8res sont agr\u00e9ables ; les villes int\u00e9rieures peuvent \u00eatre tr\u00e8s chaudes.',
    whatToPack: 'Quoi emporter',
    whatToPackText: 'V\u00eatements l\u00e9gers. Une veste l\u00e9g\u00e8re pour la climatisation. Chaussures de marche confortables. Cr\u00e8me solaire SPF 50+, lunettes de soleil, chapeau.',
    moneyBudget: 'Argent & budget',
    moneyP1: 'Le Dirham marocain (MAD) est la monnaie officielle. Apportez des euros et changez sur place, ou utilisez les distributeurs.',
    currency: 'Devise',
    currencyVal: 'Dirham marocain (MAD)',
    currencySub: '1 EUR ~ 11 MAD | 1 USD ~ 10 MAD | 1 GBP ~ 13 MAD',
    atms: 'Distributeurs',
    atmsVal: 'Largement disponibles',
    atmsSub: 'Toutes les grandes villes. Visa/Mastercard accept\u00e9s.',
    cards: 'Cartes',
    cardsVal: 'H\u00f4tels & restaurants',
    cardsSub: 'Visa et Mastercard privil\u00e9gi\u00e9s. Esp\u00e8ces n\u00e9cessaires pour les march\u00e9s.',
    dailyBudget: 'Budget quotidien estim\u00e9',
    budgetDaily: '400-700 MAD/jour',
    budgetEur: '~36-63 EUR',
    budgetIncludes: 'Auberge, street food, transport public',
    midDaily: '1,000-2,000 MAD/jour',
    midEur: '~90-180 EUR',
    midIncludes: 'Bon riad ou h\u00f4tel 3 \u00e9toiles, restaurants, taxis',
    luxDaily: '3,000-6,000+ MAD/jour',
    luxEur: '~270-540+ EUR',
    luxIncludes: 'Riad boutique ou 5 \u00e9toiles, gastronomie, exp\u00e9riences premium',
    contacts: 'Contacts utiles & num\u00e9ros d\'urgence',
    embassies: 'Ambassades & consulats',
    embassiesText: 'La plupart des pays maintiennent des ambassades \u00e0 Rabat et des consulats \u00e0 Casablanca. Enregistrez-vous aupr\u00e8s de votre ambassade avant de voyager.',
    hostCityGuides: 'Guides des villes h\u00f4tes',
    stadiumGuides: 'Guides des stades',
    wc2030Hub: 'Hub CM 2030',
  },
}

/* Data arrays — these keep English descriptive text, with labels translated */

const AIRPORTS = [
  { city: 'Casablanca', name: 'Mohammed V International Airport', iata: 'CMN', distanceToStadium: '~30 km to Grand Stade Hassan II (El Mansouria)', transport: 'ONCF train to Casa Voyageurs (35 min), taxis, shuttle buses. The busiest international gateway into Morocco with direct flights from every continent.' },
  { city: 'Marrakech', name: 'Marrakech-Menara Airport', iata: 'RAK', distanceToStadium: '~12 km to Grand Stade de Marrakech', transport: 'Taxis (20 min to Gueliz, 30 min to Medina), airport bus No. 19 to Jemaa el-Fnaa. Well-served by European low-cost carriers.' },
  { city: 'Tangier', name: 'Tangier Ibn Battouta Airport', iata: 'TNG', distanceToStadium: '~12 km to Ibn Batouta Stadium', transport: 'Taxis to city centre (20 min), limited bus service. Also reachable by ferry from Tarifa or Algeciras in Spain (35-90 min).' },
  { city: 'Fes', name: 'Fes-Saiss Airport', iata: 'FEZ', distanceToStadium: '~18 km to Grand Stade de Fes', transport: 'Taxis (25 min to Ville Nouvelle, 35 min to Medina), bus No. 16.' },
  { city: 'Agadir', name: 'Agadir Al Massira Airport', iata: 'AGA', distanceToStadium: '~25 km to Adrar Stadium', transport: 'Taxis and hotel shuttles (30-40 min). Popular with European charter flights.' },
  { city: 'Rabat', name: 'Rabat-Sale Airport', iata: 'RBA', distanceToStadium: '~10 km to Prince Moulay Abdellah Stadium', transport: 'Taxis (20 min to Agdal). Most Rabat-bound fans will fly into CMN and take the 90-minute Al Boraq train.' },
]

const NEIGHBOURHOODS = [
  { city: 'Casablanca', areas: [
    { name: 'Corniche / Ain Diab', desc: 'Seafront strip with beach clubs, restaurants, and mid-range to luxury hotels.' },
    { name: 'Gauthier / Maarif', desc: 'Central business district with good dining, shopping, and transport links.' },
    { name: 'Anfa', desc: 'Upscale residential area with premium hotels and a quieter atmosphere.' },
  ]},
  { city: 'Rabat', areas: [
    { name: 'Agdal', desc: 'Modern district close to the stadium with cafes, restaurants, and tram access.' },
    { name: 'Hassan / Centre', desc: 'Near the landmark Hassan Tower and the medina. Good mid-range options.' },
  ]},
  { city: 'Marrakech', areas: [
    { name: 'Gueliz', desc: 'The modern new city. Convenient, well-connected, with international restaurants.' },
    { name: 'Hivernage', desc: 'Upscale hotel district between Gueliz and the Medina.' },
    { name: 'Medina Riads', desc: 'Traditional courtyard guesthouses inside the old walls. Book 12 months ahead.' },
  ]},
  { city: 'Tangier', areas: [
    { name: 'City Centre / Boulevard', desc: 'Close to the medina and port with a wide range of hotels.' },
    { name: 'Malabata', desc: 'Beach area east of the centre with resort-style hotels and sea views.' },
  ]},
  { city: 'Fes', areas: [
    { name: 'Ville Nouvelle', desc: 'The modern city with standard hotels. Practical base for match days.' },
    { name: 'Medina Riads', desc: 'Some of Morocco\'s most extraordinary riads. Navigation is challenging.' },
  ]},
  { city: 'Agadir', areas: [
    { name: 'Beach / Marina', desc: 'The main tourist strip with all-inclusive resorts and the marina.' },
    { name: 'Taghazout', desc: 'Surf village 20 km north. Laid-back with boutique guesthouses.' },
  ]},
]

const DISHES = [
  { name: 'Tagine', desc: 'Slow-cooked stew in a conical clay pot. Lamb with prunes, chicken with preserved lemon, or vegetable versions.' },
  { name: 'Couscous', desc: 'Steamed semolina with vegetables and meat, traditionally served on Fridays.' },
  { name: 'Pastilla (B\'stilla)', desc: 'Layered pastry with pigeon or chicken, almonds, and cinnamon.' },
  { name: 'Harira', desc: 'Rich tomato-based soup with lentils, chickpeas, and herbs.' },
  { name: 'Msemen', desc: 'Square Moroccan flatbread, crispy outside, soft inside.' },
  { name: 'Mechoui', desc: 'Whole lamb slow-roasted in a clay pit for hours.' },
  { name: 'Tanjia', desc: 'Meat marinated with spices, sealed in an urn, slow-cooked in hammam embers.' },
  { name: 'Rfissa', desc: 'Shredded msemen with lentils and chicken in fenugreek sauce.' },
]

const DARIJA_PHRASES = [
  { phrase: 'Salam / Salaam alaikum', meaning: { en: 'Hello / Peace be upon you', ar: 'مرحباً / السلام عليكم', fr: 'Bonjour / Paix sur vous' } },
  { phrase: 'Labas?', meaning: { en: 'How are you? / All good?', ar: 'كيف حالك؟', fr: 'Comment allez-vous ?' } },
  { phrase: 'Shukran', meaning: { en: 'Thank you', ar: 'شكراً', fr: 'Merci' } },
  { phrase: 'Bslama', meaning: { en: 'Goodbye', ar: 'مع السلامة', fr: 'Au revoir' } },
  { phrase: 'Bshhal?', meaning: { en: 'How much?', ar: 'بكم؟', fr: 'Combien ?' } },
  { phrase: 'Daba', meaning: { en: 'Now', ar: 'الآن', fr: 'Maintenant' } },
  { phrase: 'Fin kayn l-match?', meaning: { en: 'Where is the match?', ar: 'أين المباراة؟', fr: 'O\u00f9 est le match ?' } },
  { phrase: 'Dima Maghrib!', meaning: { en: 'Always Morocco! (common chant)', ar: 'ديما مغرب! (هتاف شائع)', fr: 'Toujours le Maroc ! (chant populaire)' } },
  { phrase: 'Hanya', meaning: { en: 'Chill / relaxed', ar: 'هادئ / مسترخي', fr: 'Tranquille / d\u00e9tendu' } },
  { phrase: 'Inshallah', meaning: { en: 'God willing', ar: 'إن شاء الله', fr: 'Si Dieu le veut' } },
  { phrase: 'Allah y3tik saha', meaning: { en: 'May God give you health', ar: 'الله يعطيك الصحة', fr: 'Que Dieu vous donne la sant\u00e9' } },
]

const WEATHER = [
  { city: 'Casablanca', june: '22-27 C', july: '24-29 C', note: { en: 'Atlantic breeze, comfortable', ar: 'نسيم أطلسي، مريح', fr: 'Brise atlantique, confortable' } },
  { city: 'Rabat', june: '21-27 C', july: '23-29 C', note: { en: 'Similar to Casablanca, slightly cooler', ar: 'مشابه للدار البيضاء، أبرد قليلاً', fr: 'Similaire \u00e0 Casablanca, un peu plus frais' } },
  { city: 'Marrakech', june: '25-38 C', july: '27-40 C', note: { en: 'Hot. Carry water. Seek shade midday.', ar: 'حار. احمل الماء. ابحث عن الظل.', fr: 'Chaud. Portez de l\'eau. Cherchez l\'ombre.' } },
  { city: 'Tangier', june: '20-27 C', july: '22-30 C', note: { en: 'Mediterranean-Atlantic, pleasant', ar: 'متوسطي-أطلسي، لطيف', fr: 'M\u00e9diterran\u00e9o-atlantique, agr\u00e9able' } },
  { city: 'Fes', june: '23-35 C', july: '26-38 C', note: { en: 'Inland heat. The medina traps warmth.', ar: 'حرارة داخلية. المدينة القديمة تحبس الحرارة.', fr: 'Chaleur int\u00e9rieure. La m\u00e9dina retient la chaleur.' } },
  { city: 'Agadir', june: '20-27 C', july: '21-28 C', note: { en: 'Ocean-moderated, ideal beach weather', ar: 'معتدل بفضل المحيط، طقس شاطئ مثالي', fr: 'Temp\u00e9r\u00e9 par l\'oc\u00e9an, id\u00e9al pour la plage' } },
]

const TRANSPORT_MODES = {
  en: [
    { title: 'ONCF Trains', desc: 'The conventional rail network connects all major cities. First class is inexpensive and recommended.' },
    { title: 'CTM / Supratours Buses', desc: 'Reliable, air-conditioned long-distance coaches. Book online or at stations.' },
    { title: 'Petit Taxi', desc: 'Small, metered taxis within city limits. Insist on the meter. 15-40 MAD.' },
    { title: 'Grand Taxi', desc: 'Shared Mercedes sedans on fixed routes. Negotiate price before boarding.' },
    { title: 'Ride-Hailing Apps', desc: 'Careem and InDrive operate in major cities. Download both before arrival.' },
    { title: 'Rental Cars', desc: 'Available at all airports. Drive on the right. Avoid driving in medinas.' },
  ],
  ar: [
    { title: 'قطارات ONCF', desc: 'شبكة القطارات التقليدية تربط جميع المدن الكبرى. الدرجة الأولى رخيصة ومُوصى بها.' },
    { title: 'حافلات CTM / سوبراتور', desc: 'حافلات مكيفة وموثوقة. احجز عبر الإنترنت أو في المحطات.' },
    { title: 'بيتي تاكسي', desc: 'تاكسي صغير بعداد داخل المدينة. أصر على العداد. 15-40 درهم.' },
    { title: 'غراند تاكسي', desc: 'سيارات مرسيدس مشتركة بمسارات ثابتة. تفاوض على السعر قبل الركوب.' },
    { title: 'تطبيقات النقل', desc: 'كريم وInDrive تعمل في المدن الكبرى. حمّل كليهما قبل الوصول.' },
    { title: 'تأجير السيارات', desc: 'متوفر في جميع المطارات. القيادة على اليمين. تجنب القيادة في المدن القديمة.' },
  ],
  fr: [
    { title: 'Trains ONCF', desc: 'Le r\u00e9seau ferroviaire classique relie toutes les grandes villes. La premi\u00e8re classe est bon march\u00e9.' },
    { title: 'Bus CTM / Supratours', desc: 'Autocars fiables et climatis\u00e9s. R\u00e9servez en ligne ou en gare.' },
    { title: 'Petit Taxi', desc: 'Taxis \u00e0 compteur en ville. Insistez sur le compteur. 15-40 MAD.' },
    { title: 'Grand Taxi', desc: 'Mercedes partag\u00e9es sur des trajets fixes. N\u00e9gociez avant de monter.' },
    { title: 'VTC', desc: 'Careem et InDrive op\u00e8rent dans les grandes villes. T\u00e9l\u00e9chargez les deux avant d\'arriver.' },
    { title: 'Location de voiture', desc: 'Disponible dans tous les a\u00e9roports. Conduisez \u00e0 droite. \u00c9vitez les m\u00e9dinas.' },
  ],
}

const CONTACTS = [
  { label: { en: 'Emergency (Police)', ar: 'طوارئ (الشرطة)', fr: 'Urgence (Police)' }, value: '19', note: { en: 'National police in urban areas', ar: 'الشرطة الوطنية في المناطق الحضرية', fr: 'Police nationale en zones urbaines' } },
  { label: { en: 'Emergency (Gendarmerie)', ar: 'طوارئ (الدرك)', fr: 'Urgence (Gendarmerie)' }, value: '177', note: { en: 'Rural areas and highways', ar: 'المناطق الريفية والطرق السريعة', fr: 'Zones rurales et autoroutes' } },
  { label: { en: 'Fire / Ambulance', ar: 'إطفاء / إسعاف', fr: 'Pompiers / Ambulance' }, value: '15', note: { en: 'Nationwide emergency services', ar: 'خدمات الطوارئ الوطنية', fr: 'Services d\'urgence nationaux' } },
  { label: { en: 'Tourist Police', ar: 'الشرطة السياحية', fr: 'Police touristique' }, value: '0524-384601', note: { en: 'Brigade Touristique (Marrakech)', ar: 'الفرقة السياحية (مراكش)', fr: 'Brigade Touristique (Marrakech)' } },
  { label: { en: 'SAMU (Medical)', ar: 'SAMU (طبي)', fr: 'SAMU (M\u00e9dical)' }, value: '141', note: { en: 'Medical emergencies', ar: 'حالات الطوارئ الطبية', fr: 'Urgences m\u00e9dicales' } },
  { label: { en: 'Royal Air Maroc', ar: 'الخطوط الملكية المغربية', fr: 'Royal Air Maroc' }, value: '+212 5 22 48 97 97', note: { en: 'National carrier', ar: 'الناقل الوطني', fr: 'Compagnie nationale' } },
  { label: { en: 'ONCF Rail Info', ar: 'معلومات ONCF للقطارات', fr: 'Info ONCF' }, value: '2255', note: { en: 'Train schedules', ar: 'جداول القطارات', fr: 'Horaires des trains' } },
  { label: { en: 'FIFA Contact', ar: 'اتصال FIFA', fr: 'Contact FIFA' }, value: 'fifa.com/2030', note: { en: 'Official tournament website', ar: 'الموقع الرسمي للبطولة', fr: 'Site officiel du tournoi' } },
]

export default async function TravelGuidePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params
  const lang: Lang = (['en', 'ar', 'fr'].includes(rawLang) ? rawLang : 'en') as Lang
  const t = T[lang]
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const p = lang === 'en' ? '' : `/${lang}`

  const sectionHeadStyle = { fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 800 as const, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text)', marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid var(--border)' }
  const bodyStyle = { fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.8, color: 'var(--text-sec)', marginBottom: 20 }
  const labelStyle = { fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 4 }
  const cardStyle = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '18px 20px', marginBottom: 16 }
  const tipBoxStyle = { background: 'var(--green-light)', border: '1px solid #b0d8c0', borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: 20 }

  return (
    <main dir={dir}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 20px 80px' }}>

        {/* SECTION 1: Welcome */}
        <div style={{ marginBottom: 56 }}>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 34, fontWeight: 800, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.1, marginBottom: 16 }}>{t.title}</h1>
          <p style={{ ...bodyStyle, fontStyle: 'italic', borderLeft: lang === 'ar' ? 'none' : '3px solid var(--green)', borderRight: lang === 'ar' ? '3px solid var(--green)' : 'none', paddingLeft: lang === 'ar' ? 0 : 20, paddingRight: lang === 'ar' ? 20 : 0, fontSize: 17 }}>{t.intro}</p>
          <p style={bodyStyle}>{t.introP2}</p>
          <p style={bodyStyle}>{t.introP3}</p>
        </div>

        {/* SECTION 2: Visa */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={sectionHeadStyle}>{t.visaTitle}</h2>
          <p style={bodyStyle}>{t.visaP1}</p>
          <div style={cardStyle}>
            <div style={{ ...labelStyle, marginBottom: 10 }}>{t.visaFreeLabel}</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-sec)', lineHeight: 1.7, margin: 0 }}>{t.visaFreeList}</p>
          </div>
          <p style={bodyStyle}>{t.visaP2}</p>
          <div style={tipBoxStyle}>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 8 }}>{t.important}</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-sec)', lineHeight: 1.7, margin: 0 }}>{t.visaImportant}</p>
          </div>
        </div>

        {/* SECTION 3: Airports */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={sectionHeadStyle}>{t.airportsTitle}</h2>
          <p style={bodyStyle}>{t.airportsP1}</p>
          {AIRPORTS.map((airport) => (
            <div key={airport.iata} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{airport.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)' }}>{airport.city}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--green)', background: 'var(--green-light)', border: '1px solid #b0d8c0', borderRadius: 'var(--radius-sm)', padding: '4px 10px' }}>{airport.iata}</div>
              </div>
              <div style={labelStyle}>{t.distanceToStadium}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text)', marginBottom: 4 }}>{airport.distanceToStadium}</div>
              <div style={labelStyle}>{t.transportConnections}</div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-sec)', lineHeight: 1.7, margin: 0 }}>{airport.transport}</p>
            </div>
          ))}
        </div>

        {/* SECTION 4: Getting Around */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={sectionHeadStyle}>{t.gettingAround}</h2>
          <p style={bodyStyle}>{t.gettingAroundP1}</p>
          <div style={{ background: 'var(--navy-light)', border: '1px solid #c8d4f0', borderRadius: 'var(--radius)', padding: '18px 20px', marginBottom: 20 }}>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 800, color: 'var(--navy)', marginBottom: 10 }}>{t.alBoraqTitle}</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.7, margin: 0 }}>{t.alBoraqDesc}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 20 }}>
            {TRANSPORT_MODES[lang].map(item => (
              <div key={item.title} style={cardStyle}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{item.title}</div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-sec)', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: Where to Stay */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={sectionHeadStyle}>{t.whereToStay}</h2>
          <p style={bodyStyle}>{t.whereToStayP1}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 24, boxShadow: 'var(--shadow-sm)' }}>
            {[
              { label: t.budgetLabel, range: '80-400 MAD', eur: '7-36 EUR / night', desc: lang === 'ar' ? 'نزل، بيوت ضيافة، فنادق اقتصادية' : lang === 'fr' ? 'Auberges, maisons d\'h\u00f4tes, h\u00f4tels budget' : 'Hostels, basic guesthouses, budget hotels' },
              { label: t.midRangeLabel, range: '400-1,500 MAD', eur: '36-135 EUR / night', desc: lang === 'ar' ? 'رياضات جيدة، فنادق 3 نجوم' : lang === 'fr' ? 'Bons riads, h\u00f4tels 3 \u00e9toiles' : 'Good riads, 3-star hotels, Airbnb apartments' },
              { label: t.luxuryLabel, range: '1,500-5,000+ MAD', eur: '135-450+ EUR / night', desc: lang === 'ar' ? 'رياضات فاخرة، فنادق 5 نجوم' : lang === 'fr' ? 'Riads boutique, h\u00f4tels 5 \u00e9toiles' : 'Boutique riads, 5-star hotels, resort properties' },
            ].map(tier => (
              <div key={tier.label} style={{ background: 'var(--card)', padding: '14px 16px' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>{tier.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--green)', marginBottom: 2 }}>{tier.range}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', marginBottom: 6 }}>{tier.eur}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-sec)', lineHeight: 1.5 }}>{tier.desc}</div>
              </div>
            ))}
          </div>
          <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 16 }}>{t.bestNeighbourhoods}</h3>
          {NEIGHBOURHOODS.map(city => (
            <div key={city.city} style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>{city.city}</div>
              {city.areas.map((area, j) => (
                <div key={area.name} style={{ padding: '8px 0', borderBottom: j < city.areas.length - 1 ? '1px solid var(--border)' : 'none', marginLeft: lang === 'ar' ? 0 : 16, marginRight: lang === 'ar' ? 16 : 0 }}>
                  <span style={{ fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{area.name}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-sec)' }}> — {area.desc}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* SECTION 6: Food & Drink */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={sectionHeadStyle}>{t.foodDrink}</h2>
          <p style={bodyStyle}>{t.foodP1}</p>
          <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 12 }}>{t.mustTryDishes}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 24 }}>
            {DISHES.map((dish, i) => (
              <div key={dish.name} style={{ padding: '12px 0', borderBottom: i < DISHES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{dish.name}</div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.7, color: 'var(--text-sec)', margin: 0 }}>{dish.desc}</p>
              </div>
            ))}
          </div>
          <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 12 }}>{t.whereToEatLabel}</h3>
          <p style={bodyStyle}>{t.whereToEatP1}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div style={cardStyle}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{t.dietaryNotes}</div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-sec)', lineHeight: 1.65, margin: 0 }}>{t.dietaryText}</p>
            </div>
            <div style={cardStyle}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{t.drinksTipping}</div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-sec)', lineHeight: 1.65, margin: 0 }}>{t.drinksText}</p>
            </div>
          </div>
        </div>

        {/* SECTION 7: Culture */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={sectionHeadStyle}>{t.cultureEtiquette}</h2>
          <p style={bodyStyle}>{t.cultureP1}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {[
              { title: t.dressCode, text: t.dressText },
              { title: t.photography, text: t.photoText },
              { title: t.bargaining, text: t.bargainText },
              { title: t.ramadan, text: t.ramadanText },
            ].map(item => (
              <div key={item.title} style={cardStyle}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{item.title}</div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-sec)', lineHeight: 1.65, margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
          <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 12 }}>{t.darijaPhrases}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 20 }}>
            {DARIJA_PHRASES.map(item => (
              <div key={item.phrase} style={{ background: 'var(--card)', padding: '10px 14px' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 700, color: 'var(--green)' }}>{item.phrase}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-sec)' }}>{item.meaning[lang]}</div>
              </div>
            ))}
          </div>
          <div style={tipBoxStyle}>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 8 }}>{t.safety}</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-sec)', lineHeight: 1.7, margin: 0 }}>{t.safetyText}</p>
          </div>
        </div>

        {/* SECTION 8: Weather */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={sectionHeadStyle}>{t.weatherTitle}</h2>
          <p style={bodyStyle}>{t.weatherP1}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
            {WEATHER.map(w => (
              <div key={w.city} style={{ background: 'var(--card)', padding: '14px 16px' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{w.city}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-sec)', marginBottom: 2 }}>{lang === 'ar' ? 'يونيو' : lang === 'fr' ? 'Juin' : 'June'}: {w.june}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-sec)', marginBottom: 6 }}>{lang === 'ar' ? 'يوليو' : lang === 'fr' ? 'Juillet' : 'July'}: {w.july}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-faint)', fontStyle: 'italic' }}>{w.note[lang]}</div>
              </div>
            ))}
          </div>
          <div style={cardStyle}>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{t.whatToPack}</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-sec)', lineHeight: 1.7, margin: 0 }}>{t.whatToPackText}</p>
          </div>
        </div>

        {/* SECTION 9: Money */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={sectionHeadStyle}>{t.moneyBudget}</h2>
          <p style={bodyStyle}>{t.moneyP1}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
            {[
              { label: t.currency, value: t.currencyVal, sub: t.currencySub },
              { label: t.atms, value: t.atmsVal, sub: t.atmsSub },
              { label: t.cards, value: t.cardsVal, sub: t.cardsSub },
            ].map(item => (
              <div key={item.label} style={{ background: 'var(--card)', padding: '14px 16px' }}>
                <div style={labelStyle}>{item.label}</div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{item.value}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-faint)', lineHeight: 1.5 }}>{item.sub}</div>
              </div>
            ))}
          </div>
          <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 12 }}>{t.dailyBudget}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 12, boxShadow: 'var(--shadow-sm)' }}>
            {[
              { level: t.budgetLabel, mad: t.budgetDaily, eur: t.budgetEur, includes: t.budgetIncludes },
              { level: t.midRangeLabel, mad: t.midDaily, eur: t.midEur, includes: t.midIncludes },
              { level: t.luxuryLabel, mad: t.luxDaily, eur: t.luxEur, includes: t.luxIncludes },
            ].map(b => (
              <div key={b.level} style={{ background: 'var(--card)', padding: '14px 16px' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>{b.level}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--green)', marginBottom: 2 }}>{b.mad}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', marginBottom: 6 }}>{b.eur}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-sec)', lineHeight: 1.5 }}>{b.includes}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 10: Contacts */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={sectionHeadStyle}>{t.contacts}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
            {CONTACTS.map(contact => (
              <div key={contact.value} style={{ background: 'var(--card)', padding: '12px 16px' }}>
                <div style={labelStyle}>{contact.label[lang]}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{contact.value}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-faint)', lineHeight: 1.4 }}>{contact.note[lang]}</div>
              </div>
            ))}
          </div>
          <div style={{ ...cardStyle, background: 'var(--card-alt)' }}>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{t.embassies}</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-sec)', lineHeight: 1.7, margin: 0 }}>{t.embassiesText}</p>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={`${p}/world-cup-2030/cities`} style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--green)', background: 'var(--green-light)', border: '1px solid #b0d8c0', borderRadius: 'var(--radius-sm)', padding: '10px 20px', textDecoration: 'none' }}>{t.hostCityGuides}</Link>
          <Link href={`${p}/world-cup-2030/stadiums`} style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold)', background: 'var(--gold-light)', border: '1px solid #e0c88a', borderRadius: 'var(--radius-sm)', padding: '10px 20px', textDecoration: 'none' }}>{t.stadiumGuides}</Link>
          <Link href={`${p}/world-cup-2030`} style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--navy)', background: 'var(--navy-light)', border: '1px solid #c8d4f0', borderRadius: 'var(--radius-sm)', padding: '10px 20px', textDecoration: 'none' }}>{t.wc2030Hub}</Link>
        </div>
      </div>
    </main>
  )
}
