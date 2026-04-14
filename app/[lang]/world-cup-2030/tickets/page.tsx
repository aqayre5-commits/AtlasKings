'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const T = {
  en: {
    topLabel: 'FIFA World Cup 2030 Morocco',
    title: 'Tickets & FAQ',
    subtitle: 'Everything you need to know about buying tickets for the 2030 FIFA World Cup in Morocco. Prices, ballot process, Fan ID, stadium allocation, and answers to the most common questions.',
    ticketOverview: 'Ticket Overview',
    overviewP1: 'Ticket sales for the 2030 FIFA World Cup are expected to open in early 2029 through the official FIFA ticketing platform at FIFA.com/tickets. This is the only authorised channel for purchasing World Cup tickets. Third-party sites, resellers, and unofficial agents are not recognised by FIFA, and tickets obtained through them may be cancelled without refund.',
    overviewP2: 'FIFA uses a ballot (lottery) system for initial ticket sales. During the ballot window, fans submit applications for the matches they wish to attend. Applications are then randomly selected, and successful applicants are invited to complete their purchase. This system is designed to give all fans an equal chance regardless of when they submit their application within the window.',
    overviewP3: 'Moroccan residents are expected to receive a priority allocation and discounted pricing tier, consistent with FIFA policy at previous World Cups in Qatar (2022), Russia (2018), and Brazil (2014). Details of the host nation allocation will be confirmed by FIFA closer to the sales launch.',
    expectedPrices: 'Expected Price Ranges (USD)',
    round: 'Round',
    priceDisclaimer: 'Prices are estimates based on previous FIFA World Cup pricing and are subject to change. Hospitality packages are expected to start from approximately $2,000 per match and increase substantially for knockout rounds and the final.',
    howToBuy: 'How to Buy Tickets',
    fanIdTitle: 'Fan ID / FIFA Fan Card',
    fanIdRequired: 'Required for All Attendees',
    fanIdP1: 'FIFA is expected to implement a digital Fan Card system for the 2030 World Cup, building on the Hayya Card used at Qatar 2022 and the Fan ID used at Russia 2018. Every person entering a stadium — including children — will need a valid Fan Card linked to their ticket.',
    fanIdP2: 'The Fan Card serves multiple purposes: it is your entry permit to the stadium, your identification document within the tournament infrastructure, and your access pass for free public transport on match days. In Morocco, Fan Card holders are also expected to receive free or discounted access to the national rail network and urban transit systems on match days.',
    fanIdP3: 'Applications for the Fan Card will open after the first ticket sales phase. You will need to provide a passport-quality photograph, your passport details, and your FIFA ticket confirmation number. The card is expected to be fully digital, accessible through the FIFA app, though a physical card option may also be available.',
    fanIdP4: 'Apply as early as possible. Processing times at previous tournaments ranged from a few days to several weeks during peak periods.',
    faq: 'Frequently Asked Questions',
    stadiumAllocation: 'Stadium Allocation by Round',
    stadiumDisclaimer: 'Stadium allocation is based on expected FIFA scheduling. Morocco\u2019s six stadiums will also host matches alongside venues in Spain and Portugal. The final match schedule will be confirmed after the group stage draw.',
    importantNotice: 'Important Notice',
    importantNoticeText: 'All information on this page is based on previous FIFA World Cup ticketing practices and publicly available statements. Official pricing, dates, and policies for the 2030 FIFA World Cup have not yet been confirmed by FIFA. This page will be updated as official details are announced. For the most current information, visit FIFA.com/tickets.',
    stadiumGuides: 'Stadium Guides',
    cityGuides: 'City Guides',
    step1Title: 'Create a FIFA Account',
    step1Desc: 'Register at FIFA.com with your personal details, passport information, and a valid email address. Your FIFA account will be linked to all ticket purchases and cannot be transferred. Create your account well before the ballot opens to avoid last-minute technical issues.',
    step2Title: 'Apply During the Ballot Period',
    step2Desc: 'When the official ballot window opens (expected early 2029), submit your ticket applications through the FIFA ticketing portal. You can apply for up to seven matches per ballot phase. Indicate your preferred category and an alternative category in case your first choice is unavailable. Applying does not guarantee tickets \u2014 demand will vastly exceed supply for most matches.',
    step3Title: 'Wait for Allocation Results',
    step3Desc: 'FIFA will process all ballot applications after the window closes and notify applicants by email. If your application is successful, you will be invited to complete payment within a fixed deadline. If unsuccessful, you will be placed on a waiting list or invited to apply in subsequent sales phases.',
    step4Title: 'Pay and Receive Your Digital Ticket',
    step4Desc: 'Successful applicants must pay within the deadline specified by FIFA. Payment is typically by credit card or selected digital payment methods. Tickets are issued digitally through the FIFA Ticketing App \u2014 there are no physical tickets. Your ticket is linked to your FIFA Fan Card and your identity.',
    step5Title: 'First-Come-First-Served Phase',
    step5Desc: 'After the ballot phases, FIFA opens a first-come-first-served sales window for remaining tickets. These sell extremely quickly \u2014 often within minutes for popular matches. Be logged in and ready before the window opens. Have your payment details saved in advance.',
    step6Title: 'Official FIFA Resale Platform',
    step6Desc: 'If you can no longer attend a match, you must resell your ticket through the official FIFA resale platform at face value. Buying or selling tickets outside the official platform is prohibited and may result in ticket cancellation. The resale platform also allows fans who missed earlier phases to purchase returned tickets.',
    faqItems: [
      { q: 'When do World Cup 2030 tickets go on sale?', a: 'FIFA has not yet confirmed the exact date. Based on previous tournaments, the first ballot phase is expected to open in early 2029, approximately 18 months before the tournament. Subsequent sales phases \u2014 including first-come-first-served and last-minute sales \u2014 will follow at intervals through to mid-2030. Monitor FIFA.com/tickets for official announcements.' },
      { q: 'How much do World Cup 2030 tickets cost?', a: 'Prices are expected to range from $80 for Category 4 group stage tickets to $1,500 or more for Category 1 final tickets. FIFA typically offers a reduced-price category for residents of the host nation. Hospitality packages, which include premium seating, food and beverage, and VIP access, are expected to start from approximately $2,000 per match and rise significantly for knockout rounds and the final.' },
      { q: 'Can I buy tickets specifically for Morocco games?', a: 'Yes. You can apply for tickets to any specific match, including all Morocco group stage games. However, the draw determining which teams play in which stadiums will not take place until late 2029. Until then, you can apply for tickets by venue and match slot rather than by specific team matchup. Morocco matches will be the highest-demand tickets in the tournament \u2014 apply for multiple matches to increase your chances.' },
      { q: 'Are there discounted tickets for families or disabled supporters?', a: 'FIFA is expected to offer dedicated accessibility tickets for disabled supporters and their companions at reduced prices, as has been the case at every recent World Cup. Family tickets or youth discounts have not been confirmed for 2030 but were available at recent tournaments. Accessible seating must be requested during the application process and requires supporting documentation.' },
      { q: 'Can I transfer or resell my tickets?', a: 'Tickets can only be resold through the official FIFA Resale Platform at face value. Peer-to-peer transfers, third-party resale sites, and selling above face value are strictly prohibited. Tickets purchased from unofficial sources will be cancelled without refund. FIFA uses digital identity verification to enforce this \u2014 every ticket is linked to the holder\'s FIFA Fan Card.' },
      { q: 'What is the cancellation and refund policy?', a: 'FIFA typically allows refund requests during a limited window after purchase. Once the refund window closes, your only option is to list your ticket on the official FIFA Resale Platform. If a match is cancelled or rescheduled by FIFA, full refunds are issued automatically. Specific refund terms for 2030 will be published when ticket sales open.' },
      { q: 'Do I need a visa to attend the World Cup in Morocco?', a: 'Morocco is expected to implement a visa-waiver or simplified entry process for all World Cup ticket holders, as is standard practice for FIFA host nations. Citizens of the EU, UK, USA, Canada, Australia, and many other countries already enjoy visa-free entry to Morocco for stays of up to 90 days. Check the Moroccan Ministry of Foreign Affairs website for the latest entry requirements for your nationality.' },
      { q: 'How many tickets can one person buy?', a: 'FIFA typically limits applications to a maximum of seven matches per person per ballot phase, with a maximum of four tickets per match. These limits help distribute tickets more fairly. Repeat applications or attempts to circumvent the limit using multiple accounts will result in all applications being cancelled.' },
      { q: 'Is there a minimum age to attend matches?', a: 'There is no minimum age to attend World Cup matches. Children of all ages are welcome but must have their own ticket and their own FIFA Fan Card. Children under a certain age (typically 2 or 3) may be admitted on a parent\'s lap without a separate ticket, but FIFA will confirm specific age policies closer to the tournament.' },
      { q: 'Can I buy tickets at the stadium on match day?', a: 'It is extremely unlikely. All recent FIFA World Cups have been fully digital, with no box office sales at the stadium. Any remaining tickets will be available through the FIFA Ticketing App or website, not at physical counters. Do not travel to a stadium without a confirmed digital ticket.' },
      { q: 'What happens if I lose my phone or cannot access my digital ticket?', a: 'Your ticket is stored in the FIFA Ticketing App, which is linked to your FIFA account. If you lose your device, download the app on a new device and log in with your FIFA credentials to recover your tickets. FIFA will operate help desks at each stadium for supporters experiencing access issues. Carry a form of photo ID as backup.' },
      { q: 'Which World Cup 2030 games are in Casablanca?', a: 'The Grand Stade Hassan II in Casablanca is expected to host group stage matches, Round of 32, quarter-final, semi-final, and the 2030 World Cup Final. As the largest stadium in the tournament at 115,000 capacity, Casablanca will host the most matches and the highest-profile fixtures. The exact match schedule will be confirmed after the draw.' },
      { q: 'How early should I arrive at the stadium?', a: 'FIFA recommends arriving at least two hours before kick-off. For high-profile matches \u2014 semi-finals, the final, and any Morocco matches \u2014 arriving three hours early is advisable. Security screening, bag checks, and Fan Card verification take time, particularly at the 115,000-capacity Grand Stade Hassan II. Gates typically open three hours before kick-off.' },
      { q: 'What can I bring into the stadium?', a: 'FIFA enforces strict prohibited items policies. You may not bring large bags (typically over 20cm \u00d7 15cm \u00d7 5cm), professional cameras with detachable lenses, selfie sticks, umbrellas, glass bottles, alcohol, fireworks, musical instruments larger than a small drum, or any political or offensive banners. Small clear bags, phones, and small personal items are permitted. Full prohibited items lists will be published before the tournament.' },
      { q: 'Is there Wi-Fi in the stadiums?', a: 'All six Moroccan World Cup stadiums are being equipped with high-density Wi-Fi networks as part of their 2030 upgrades. Free Wi-Fi will be available throughout the venues. However, with tens of thousands of simultaneous users, speeds may be limited. Download any tickets, apps, or maps in advance rather than relying on stadium Wi-Fi.' },
    ],
  },
  ar: {
    topLabel: 'كأس العالم 2030 FIFA المغرب',
    title: 'التذاكر والأسئلة الشائعة',
    subtitle: 'كل ما تحتاج معرفته حول شراء تذاكر كأس العالم 2030 FIFA في المغرب. الأسعار، نظام القرعة، بطاقة المشجع، توزيع الملاعب، وإجابات عن الأسئلة الأكثر شيوعاً.',
    ticketOverview: 'نظرة عامة على التذاكر',
    overviewP1: 'من المتوقع أن تبدأ مبيعات تذاكر كأس العالم 2030 FIFA في أوائل 2029 عبر منصة التذاكر الرسمية لـ FIFA على FIFA.com/tickets. هذه هي القناة المعتمدة الوحيدة لشراء تذاكر كأس العالم. المواقع الخارجية والوسطاء غير الرسميين غير معترف بهم من قبل FIFA، وقد يتم إلغاء التذاكر المشتراة من خلالهم دون استرداد.',
    overviewP2: 'يستخدم FIFA نظام القرعة (اليانصيب) للمبيعات الأولية للتذاكر. خلال فترة القرعة، يقدم المشجعون طلبات للمباريات التي يرغبون في حضورها. ثم يتم اختيار الطلبات بشكل عشوائي، ويُدعى المتقدمون الناجحون لإتمام عملية الشراء.',
    overviewP3: 'من المتوقع أن يحصل المقيمون المغاربة على حصة أولوية وأسعار مخفضة، وفقاً لسياسة FIFA في بطولات كأس العالم السابقة في قطر (2022) وروسيا (2018) والبرازيل (2014).',
    expectedPrices: 'الأسعار المتوقعة (بالدولار الأمريكي)',
    round: 'الجولة',
    priceDisclaimer: 'الأسعار تقديرية بناءً على أسعار بطولات كأس العالم السابقة وقابلة للتغيير. من المتوقع أن تبدأ باقات الضيافة من حوالي 2,000 دولار لكل مباراة.',
    howToBuy: 'كيفية شراء التذاكر',
    fanIdTitle: 'بطاقة المشجع / بطاقة FIFA Fan Card',
    fanIdRequired: 'مطلوبة لجميع الحاضرين',
    fanIdP1: 'من المتوقع أن يطبق FIFA نظام بطاقة مشجع رقمية لكأس العالم 2030، بناءً على بطاقة هيّا المستخدمة في قطر 2022 وبطاقة المشجع في روسيا 2018. كل شخص يدخل الملعب — بما في ذلك الأطفال — سيحتاج إلى بطاقة مشجع صالحة مرتبطة بتذكرته.',
    fanIdP2: 'تخدم بطاقة المشجع أغراضاً متعددة: تصريح دخول الملعب، وثيقة تعريف داخل البنية التحتية للبطولة، وتصريح وصول مجاني لوسائل النقل العام في أيام المباريات.',
    fanIdP3: 'ستفتح طلبات بطاقة المشجع بعد مرحلة البيع الأولى. ستحتاج إلى تقديم صورة بجودة جواز السفر وتفاصيل جواز سفرك ورقم تأكيد تذكرة FIFA.',
    fanIdP4: 'قدّم طلبك في أقرب وقت ممكن. تراوحت أوقات المعالجة في البطولات السابقة من بضعة أيام إلى عدة أسابيع.',
    faq: 'الأسئلة الشائعة',
    stadiumAllocation: 'توزيع الملاعب حسب الجولة',
    stadiumDisclaimer: 'يعتمد توزيع الملاعب على الجدولة المتوقعة من FIFA. ستستضيف ملاعب المغرب الستة مباريات إلى جانب ملاعب في إسبانيا والبرتغال.',
    importantNotice: 'ملاحظة مهمة',
    importantNoticeText: 'جميع المعلومات في هذه الصفحة مبنية على ممارسات التذاكر السابقة لكأس العالم FIFA والتصريحات المتاحة علناً. لم يتم تأكيد الأسعار والتواريخ والسياسات الرسمية لكأس العالم 2030 بعد. سيتم تحديث هذه الصفحة فور الإعلان عن التفاصيل الرسمية.',
    stadiumGuides: 'دليل الملاعب',
    cityGuides: 'دليل المدن',
    step1Title: 'إنشاء حساب FIFA',
    step1Desc: 'سجّل في FIFA.com ببياناتك الشخصية ومعلومات جواز السفر وعنوان بريد إلكتروني صالح. سيكون حسابك مرتبطاً بجميع عمليات شراء التذاكر ولا يمكن نقله.',
    step2Title: 'التقديم خلال فترة القرعة',
    step2Desc: 'عند فتح نافذة القرعة الرسمية (المتوقعة أوائل 2029)، قدّم طلبات التذاكر عبر بوابة FIFA. يمكنك التقديم لما يصل إلى سبع مباريات لكل مرحلة قرعة.',
    step3Title: 'انتظار نتائج التخصيص',
    step3Desc: 'سيعالج FIFA جميع طلبات القرعة بعد إغلاق النافذة وإخطار المتقدمين عبر البريد الإلكتروني. إذا نجح طلبك، ستُدعى لإتمام الدفع خلال مهلة محددة.',
    step4Title: 'الدفع واستلام التذكرة الرقمية',
    step4Desc: 'يجب على المتقدمين الناجحين الدفع خلال المهلة المحددة من FIFA. يتم إصدار التذاكر رقمياً عبر تطبيق FIFA — لا توجد تذاكر ورقية.',
    step5Title: 'مرحلة الأسبقية',
    step5Desc: 'بعد مراحل القرعة، يفتح FIFA نافذة بيع بأسبقية الحضور للتذاكر المتبقية. تُباع بسرعة كبيرة — غالباً خلال دقائق للمباريات الشعبية.',
    step6Title: 'منصة إعادة البيع الرسمية من FIFA',
    step6Desc: 'إذا لم تتمكن من حضور مباراة، يجب إعادة بيع تذكرتك عبر منصة إعادة البيع الرسمية بالقيمة الاسمية. البيع خارج المنصة الرسمية محظور.',
    faqItems: [
      { q: 'متى تبدأ مبيعات تذاكر كأس العالم 2030؟', a: 'لم يؤكد FIFA التاريخ المحدد بعد. بناءً على البطولات السابقة، من المتوقع أن تفتح مرحلة القرعة الأولى في أوائل 2029، قبل حوالي 18 شهراً من البطولة.' },
      { q: 'كم تكلفة تذاكر كأس العالم 2030؟', a: 'من المتوقع أن تتراوح الأسعار من 80 دولاراً لتذاكر الفئة 4 لمرحلة المجموعات إلى 1,500 دولار أو أكثر لتذاكر الفئة 1 للمباراة النهائية.' },
      { q: 'هل يمكنني شراء تذاكر خصيصاً لمباريات المغرب؟', a: 'نعم. يمكنك التقدم لأي مباراة محددة، بما في ذلك جميع مباريات المغرب في مرحلة المجموعات. ستكون مباريات المغرب الأكثر طلباً في البطولة.' },
      { q: 'هل توجد تذاكر مخفضة للعائلات أو ذوي الإعاقة؟', a: 'من المتوقع أن يوفر FIFA تذاكر مخصصة لذوي الإعاقة ومرافقيهم بأسعار مخفضة، كما هو الحال في كل بطولة كأس عالم حديثة.' },
      { q: 'هل يمكنني نقل أو إعادة بيع تذاكري؟', a: 'يمكن إعادة بيع التذاكر فقط عبر منصة إعادة البيع الرسمية من FIFA بالقيمة الاسمية. البيع عبر أطراف ثالثة محظور بشكل صارم.' },
      { q: 'ما هي سياسة الإلغاء والاسترداد؟', a: 'يسمح FIFA عادةً بطلبات الاسترداد خلال فترة محدودة بعد الشراء. إذا تم إلغاء مباراة من قبل FIFA، يتم إصدار استرداد كامل تلقائياً.' },
      { q: 'هل أحتاج تأشيرة لحضور كأس العالم في المغرب؟', a: 'من المتوقع أن ينفذ المغرب إعفاءً من التأشيرة لجميع حاملي تذاكر كأس العالم. مواطنو الاتحاد الأوروبي والمملكة المتحدة والولايات المتحدة وكندا وأستراليا والعديد من الدول الأخرى يتمتعون بالفعل بدخول بدون تأشيرة.' },
      { q: 'كم عدد التذاكر التي يمكن لشخص واحد شراؤها؟', a: 'يحد FIFA عادةً الطلبات بحد أقصى سبع مباريات لكل شخص لكل مرحلة قرعة، مع حد أقصى أربع تذاكر لكل مباراة.' },
      { q: 'هل هناك حد أدنى للعمر لحضور المباريات؟', a: 'لا يوجد حد أدنى للعمر. الأطفال من جميع الأعمار مرحب بهم ولكن يجب أن يكون لديهم تذكرة خاصة بهم وبطاقة مشجع.' },
      { q: 'هل يمكنني شراء تذاكر في الملعب يوم المباراة؟', a: 'من غير المرجح للغاية. جميع بطولات كأس العالم الأخيرة كانت رقمية بالكامل. لا تسافر إلى الملعب بدون تذكرة رقمية مؤكدة.' },
      { q: 'ماذا يحدث إذا فقدت هاتفي أو لم أتمكن من الوصول إلى تذكرتي الرقمية؟', a: 'تذكرتك مخزنة في تطبيق FIFA المرتبط بحسابك. إذا فقدت جهازك، حمّل التطبيق على جهاز جديد وسجّل الدخول لاسترداد تذاكرك.' },
      { q: 'ما هي مباريات كأس العالم 2030 في الدار البيضاء؟', a: 'من المتوقع أن يستضيف ملعب الحسن الثاني الكبير مباريات مرحلة المجموعات، دور الـ32، ربع النهائي، نصف النهائي، ونهائي كأس العالم 2030.' },
      { q: 'كم يجب أن أصل مبكراً إلى الملعب؟', a: 'يوصي FIFA بالوصول قبل ساعتين على الأقل من بداية المباراة. للمباريات الكبرى، يُنصح بالوصول قبل ثلاث ساعات.' },
      { q: 'ما الذي يمكنني إحضاره إلى الملعب؟', a: 'يطبق FIFA سياسات صارمة للممنوعات. لا يُسمح بالحقائب الكبيرة أو الكاميرات المهنية أو عصي السيلفي أو المظلات أو الزجاجات أو الألعاب النارية.' },
      { q: 'هل تتوفر شبكة Wi-Fi في الملاعب؟', a: 'يتم تجهيز جميع ملاعب كأس العالم المغربية الستة بشبكات Wi-Fi عالية الكثافة. حمّل التذاكر والتطبيقات مسبقاً.' },
    ],
  },
  fr: {
    topLabel: 'Coupe du Monde FIFA 2030 Maroc',
    title: 'Billets & FAQ',
    subtitle: 'Tout ce que vous devez savoir sur l\'achat de billets pour la Coupe du Monde FIFA 2030 au Maroc. Prix, processus de tirage au sort, Fan ID, allocation des stades et r\u00e9ponses aux questions les plus fr\u00e9quentes.',
    ticketOverview: 'Aper\u00e7u des billets',
    overviewP1: 'La vente de billets pour la Coupe du Monde FIFA 2030 devrait ouvrir d\u00e9but 2029 via la plateforme officielle de billetterie FIFA \u00e0 FIFA.com/tickets. C\'est le seul canal autoris\u00e9 pour l\'achat de billets. Les sites tiers, revendeurs et agents non officiels ne sont pas reconnus par la FIFA, et les billets obtenus par ces canaux peuvent \u00eatre annul\u00e9s sans remboursement.',
    overviewP2: 'La FIFA utilise un syst\u00e8me de tirage au sort (loterie) pour les ventes initiales de billets. Pendant la p\u00e9riode du tirage, les supporters soumettent des demandes pour les matchs qu\'ils souhaitent voir. Les demandes sont ensuite s\u00e9lectionn\u00e9es al\u00e9atoirement.',
    overviewP3: 'Les r\u00e9sidents marocains devraient b\u00e9n\u00e9ficier d\'une allocation prioritaire et d\'un tarif r\u00e9duit, conform\u00e9ment \u00e0 la politique de la FIFA lors des Coupes du Monde pr\u00e9c\u00e9dentes au Qatar (2022), en Russie (2018) et au Br\u00e9sil (2014).',
    expectedPrices: 'Fourchettes de prix pr\u00e9vues (USD)',
    round: 'Tour',
    priceDisclaimer: 'Les prix sont des estimations bas\u00e9es sur les tarifs des Coupes du Monde pr\u00e9c\u00e9dentes et sont susceptibles de changer. Les packages hospitalit\u00e9 devraient commencer \u00e0 environ 2 000 $ par match.',
    howToBuy: 'Comment acheter des billets',
    fanIdTitle: 'Fan ID / FIFA Fan Card',
    fanIdRequired: 'Obligatoire pour tous les participants',
    fanIdP1: 'La FIFA devrait mettre en place un syst\u00e8me de Fan Card num\u00e9rique pour la Coupe du Monde 2030, bas\u00e9 sur la carte Hayya utilis\u00e9e au Qatar 2022 et le Fan ID utilis\u00e9 en Russie 2018. Toute personne entrant dans un stade — y compris les enfants — aura besoin d\'une Fan Card valide li\u00e9e \u00e0 son billet.',
    fanIdP2: 'La Fan Card sert \u00e0 plusieurs fins : permis d\'entr\u00e9e au stade, document d\'identification au sein de l\'infrastructure du tournoi, et laissez-passer pour les transports en commun gratuits les jours de match.',
    fanIdP3: 'Les demandes de Fan Card ouvriront apr\u00e8s la premi\u00e8re phase de vente. Vous devrez fournir une photo de qualit\u00e9 passeport, les d\u00e9tails de votre passeport et votre num\u00e9ro de confirmation de billet FIFA.',
    fanIdP4: 'Faites votre demande le plus t\u00f4t possible. Les d\u00e9lais de traitement lors des tournois pr\u00e9c\u00e9dents allaient de quelques jours \u00e0 plusieurs semaines.',
    faq: 'Questions fr\u00e9quemment pos\u00e9es',
    stadiumAllocation: 'Allocation des stades par tour',
    stadiumDisclaimer: 'L\'allocation des stades est bas\u00e9e sur le calendrier pr\u00e9vu de la FIFA. Les six stades du Maroc accueilleront des matchs aux c\u00f4t\u00e9s de sites en Espagne et au Portugal.',
    importantNotice: 'Avis important',
    importantNoticeText: 'Toutes les informations sur cette page sont bas\u00e9es sur les pratiques de billetterie des Coupes du Monde pr\u00e9c\u00e9dentes. Les prix, dates et politiques officiels n\'ont pas encore \u00e9t\u00e9 confirm\u00e9s par la FIFA. Cette page sera mise \u00e0 jour d\u00e8s que les d\u00e9tails officiels seront annonc\u00e9s.',
    stadiumGuides: 'Guide des stades',
    cityGuides: 'Guide des villes',
    step1Title: 'Cr\u00e9er un compte FIFA',
    step1Desc: 'Inscrivez-vous sur FIFA.com avec vos donn\u00e9es personnelles, informations de passeport et une adresse email valide. Votre compte sera li\u00e9 \u00e0 tous vos achats de billets.',
    step2Title: 'Postuler pendant la p\u00e9riode de tirage',
    step2Desc: 'Lorsque la fen\u00eatre de tirage officielle s\'ouvre (pr\u00e9vue d\u00e9but 2029), soumettez vos demandes de billets via le portail FIFA. Vous pouvez postuler pour jusqu\'\u00e0 sept matchs par phase.',
    step3Title: 'Attendre les r\u00e9sultats d\'attribution',
    step3Desc: 'La FIFA traitera toutes les demandes apr\u00e8s la cl\u00f4ture et notifiera les candidats par email. Si votre demande est accept\u00e9e, vous serez invit\u00e9 \u00e0 finaliser le paiement.',
    step4Title: 'Payer et recevoir votre billet num\u00e9rique',
    step4Desc: 'Les candidats retenus doivent payer dans le d\u00e9lai sp\u00e9cifi\u00e9. Les billets sont \u00e9mis num\u00e9riquement via l\'application FIFA — pas de billets physiques.',
    step5Title: 'Phase premier arriv\u00e9, premier servi',
    step5Desc: 'Apr\u00e8s les phases de tirage, la FIFA ouvre une vente par ordre d\'arriv\u00e9e pour les billets restants. Ils se vendent tr\u00e8s rapidement — souvent en quelques minutes.',
    step6Title: 'Plateforme de revente officielle FIFA',
    step6Desc: 'Si vous ne pouvez plus assister \u00e0 un match, vous devez revendre votre billet via la plateforme officielle \u00e0 sa valeur nominale. La vente en dehors de la plateforme est interdite.',
    faqItems: [
      { q: 'Quand les billets de la Coupe du Monde 2030 seront-ils en vente ?', a: 'La FIFA n\'a pas encore confirm\u00e9 la date exacte. La premi\u00e8re phase de tirage devrait ouvrir d\u00e9but 2029, environ 18 mois avant le tournoi.' },
      { q: 'Combien co\u00fbtent les billets de la Coupe du Monde 2030 ?', a: 'Les prix devraient aller de 80 $ pour les billets de cat\u00e9gorie 4 en phase de groupes \u00e0 1 500 $ ou plus pour les billets de cat\u00e9gorie 1 pour la finale.' },
      { q: 'Puis-je acheter des billets sp\u00e9cifiquement pour les matchs du Maroc ?', a: 'Oui. Vous pouvez postuler pour tout match sp\u00e9cifique, y compris tous les matchs du Maroc en phase de groupes. Les matchs du Maroc seront les plus demand\u00e9s du tournoi.' },
      { q: 'Y a-t-il des billets r\u00e9duits pour les familles ou les supporters handicap\u00e9s ?', a: 'La FIFA devrait proposer des billets d\'accessibilit\u00e9 d\u00e9di\u00e9s pour les supporters handicap\u00e9s et leurs accompagnants \u00e0 prix r\u00e9duit.' },
      { q: 'Puis-je transf\u00e9rer ou revendre mes billets ?', a: 'Les billets ne peuvent \u00eatre revendus que via la plateforme officielle de revente FIFA \u00e0 leur valeur nominale. La revente par des tiers est strictement interdite.' },
      { q: 'Quelle est la politique d\'annulation et de remboursement ?', a: 'La FIFA autorise g\u00e9n\u00e9ralement les demandes de remboursement pendant une p\u00e9riode limit\u00e9e apr\u00e8s l\'achat. Si un match est annul\u00e9, un remboursement complet est \u00e9mis automatiquement.' },
      { q: 'Ai-je besoin d\'un visa pour assister \u00e0 la Coupe du Monde au Maroc ?', a: 'Le Maroc devrait mettre en place une exemption de visa pour tous les d\u00e9tenteurs de billets. Les citoyens de l\'UE, du Royaume-Uni, des \u00c9tats-Unis, du Canada et de l\'Australie b\u00e9n\u00e9ficient d\u00e9j\u00e0 d\'une entr\u00e9e sans visa.' },
      { q: 'Combien de billets une personne peut-elle acheter ?', a: 'La FIFA limite g\u00e9n\u00e9ralement les demandes \u00e0 sept matchs par personne par phase de tirage, avec un maximum de quatre billets par match.' },
      { q: 'Y a-t-il un \u00e2ge minimum pour assister aux matchs ?', a: 'Il n\'y a pas d\'\u00e2ge minimum. Les enfants de tous \u00e2ges sont les bienvenus mais doivent avoir leur propre billet et Fan Card.' },
      { q: 'Puis-je acheter des billets au stade le jour du match ?', a: 'C\'est extr\u00eamement improbable. Toutes les Coupes du Monde r\u00e9centes ont \u00e9t\u00e9 enti\u00e8rement num\u00e9riques. Ne vous rendez pas au stade sans billet num\u00e9rique confirm\u00e9.' },
      { q: 'Que se passe-t-il si je perds mon t\u00e9l\u00e9phone ?', a: 'Votre billet est stock\u00e9 dans l\'application FIFA li\u00e9e \u00e0 votre compte. T\u00e9l\u00e9chargez l\'application sur un nouvel appareil et connectez-vous pour r\u00e9cup\u00e9rer vos billets.' },
      { q: 'Quels matchs de la Coupe du Monde 2030 se d\u00e9roulent \u00e0 Casablanca ?', a: 'Le Grand Stade Hassan II devrait accueillir des matchs de phase de groupes, les 32\u00e8mes, quarts de finale, demi-finales et la finale de la Coupe du Monde 2030.' },
      { q: 'Combien de temps avant le match dois-je arriver ?', a: 'La FIFA recommande d\'arriver au moins deux heures avant le coup d\'envoi. Pour les matchs \u00e0 forte affluence, trois heures est conseill\u00e9.' },
      { q: 'Que puis-je apporter dans le stade ?', a: 'La FIFA applique des politiques strictes sur les objets interdits. Les grands sacs, appareils photo professionnels, perches \u00e0 selfie, parapluies, bouteilles en verre et feux d\'artifice sont interdits.' },
      { q: 'Y a-t-il du Wi-Fi dans les stades ?', a: 'Les six stades marocains sont \u00e9quip\u00e9s de r\u00e9seaux Wi-Fi haute densit\u00e9. T\u00e9l\u00e9chargez billets et applications \u00e0 l\'avance.' },
    ],
  },
}

const PRICE_RANGES = [
  { round: { en: 'Group Stage', ar: 'دور المجموعات', fr: 'Phase de groupes' }, cat1: '$250', cat2: '$175', cat3: '$125', cat4: '$80' },
  { round: { en: 'Round of 32', ar: 'دور الـ32', fr: '32\u00e8mes de finale' }, cat1: '$350', cat2: '$250', cat3: '$175', cat4: '$120' },
  { round: { en: 'Quarter-final', ar: 'ربع النهائي', fr: 'Quart de finale' }, cat1: '$500', cat2: '$375', cat3: '$275', cat4: '$200' },
  { round: { en: 'Semi-final', ar: 'نصف النهائي', fr: 'Demi-finale' }, cat1: '$800', cat2: '$600', cat3: '$450', cat4: '$350' },
  { round: { en: 'Final (Casablanca)', ar: 'النهائي (الدار البيضاء)', fr: 'Finale (Casablanca)' }, cat1: '$1,500+', cat2: '$1,000', cat3: '$750', cat4: '$500' },
]

const STADIUM_ALLOCATION = [
  { round: { en: 'Group Stage', ar: 'دور المجموعات', fr: 'Phase de groupes' }, venues: { en: 'All 6 stadiums \u2014 Casablanca, Rabat, Marrakech, Tangier, Fes, Agadir', ar: 'جميع الملاعب الستة \u2014 الدار البيضاء، الرباط، مراكش، طنجة، فاس، أكادير', fr: 'Les 6 stades \u2014 Casablanca, Rabat, Marrakech, Tanger, F\u00e8s, Agadir' } },
  { round: { en: 'Round of 32', ar: 'دور الـ32', fr: '32\u00e8mes de finale' }, venues: { en: 'Casablanca, Rabat, Marrakech, Tangier', ar: 'الدار البيضاء، الرباط، مراكش، طنجة', fr: 'Casablanca, Rabat, Marrakech, Tanger' } },
  { round: { en: 'Quarter-finals', ar: 'ربع النهائي', fr: 'Quarts de finale' }, venues: { en: 'Casablanca, Rabat, Marrakech', ar: 'الدار البيضاء، الرباط، مراكش', fr: 'Casablanca, Rabat, Marrakech' } },
  { round: { en: 'Semi-finals', ar: 'نصف النهائي', fr: 'Demi-finales' }, venues: { en: 'Casablanca, Rabat', ar: 'الدار البيضاء، الرباط', fr: 'Casablanca, Rabat' } },
  { round: { en: 'Third-place Play-off', ar: 'مباراة المركز الثالث', fr: 'Match pour la 3\u00e8me place' }, venues: { en: 'Prince Moulay Abdellah Stadium, Rabat', ar: 'ملعب الأمير مولاي عبد الله، الرباط', fr: 'Stade Prince Moulay Abdellah, Rabat' } },
  { round: { en: 'Final', ar: 'النهائي', fr: 'Finale' }, venues: { en: 'Grand Stade Hassan II, Casablanca', ar: 'ملعب الحسن الثاني الكبير، الدار البيضاء', fr: 'Grand Stade Hassan II, Casablanca' } },
]

export default function TicketsPage({ params }: { params: Promise<{ lang: string }> }) {
  const pathname = usePathname()
  const lang: 'en' | 'ar' | 'fr' = pathname.startsWith('/ar') ? 'ar' : pathname.startsWith('/fr') ? 'fr' : 'en'
  const t = T[lang]
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const p = lang === 'en' ? '' : `/${lang}`

  const steps = [
    { step: 1, title: t.step1Title, desc: t.step1Desc },
    { step: 2, title: t.step2Title, desc: t.step2Desc },
    { step: 3, title: t.step3Title, desc: t.step3Desc },
    { step: 4, title: t.step4Title, desc: t.step4Desc },
    { step: 5, title: t.step5Title, desc: t.step5Desc },
    { step: 6, title: t.step6Title, desc: t.step6Desc },
  ]

  // FAQPage JSON-LD — emitted in the current page locale so the
  // structured data matches what the visible content says. This is the
  // single highest-leverage SEO change on the WC 2030 cluster: the 15
  // FAQ entries below are exactly the shape Google rewards with rich
  // results. Keep the question/answer pairs in sync with t.faqItems.
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity: t.faqItems.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  return (
    <main dir={dir}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 36, fontWeight: 800, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.1, marginBottom: 12 }}>
            {t.title}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.8, color: 'var(--text-sec)', margin: 0 }}>
            {t.subtitle}
          </p>
        </div>

        {/* SECTION 1: TICKET OVERVIEW */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid var(--border)' }}>
            {t.ticketOverview}
          </h2>

          <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.85, color: 'var(--text-sec)', marginBottom: 28 }}>
            <p style={{ marginBottom: '1.2rem' }}>{t.overviewP1}</p>
            <p style={{ marginBottom: '1.2rem' }}>{t.overviewP2}</p>
            <p style={{ marginBottom: '1.2rem' }}>{t.overviewP3}</p>
          </div>

          {/* Price table */}
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 12 }}>
            {t.expectedPrices}
          </div>
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', background: 'var(--navy)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              <div style={{ padding: '10px 14px' }}>{t.round}</div>
              <div style={{ padding: '10px 14px', textAlign: 'center' }}>Cat 1</div>
              <div style={{ padding: '10px 14px', textAlign: 'center' }}>Cat 2</div>
              <div style={{ padding: '10px 14px', textAlign: 'center' }}>Cat 3</div>
              <div style={{ padding: '10px 14px', textAlign: 'center' }}>Cat 4</div>
            </div>
            {PRICE_RANGES.map((row, i) => (
              <div key={row.round.en} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', background: i % 2 === 0 ? 'var(--card)' : 'var(--card-alt)', borderTop: '1px solid var(--border)' }}>
                <div style={{ padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{row.round[lang]}</div>
                <div style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-sec)', textAlign: 'center' }}>{row.cat1}</div>
                <div style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-sec)', textAlign: 'center' }}>{row.cat2}</div>
                <div style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-sec)', textAlign: 'center' }}>{row.cat3}</div>
                <div style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-sec)', textAlign: 'center' }}>{row.cat4}</div>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)', lineHeight: 1.6 }}>
            {t.priceDisclaimer}
          </p>
        </section>

        {/* SECTION 2: HOW TO BUY */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid var(--border)' }}>
            {t.howToBuy}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {steps.map((s) => (
              <div key={s.step} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
                    {s.step}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                    {s.title}
                  </h3>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.75, color: 'var(--text-sec)', margin: 0, paddingLeft: lang === 'ar' ? 0 : 46, paddingRight: lang === 'ar' ? 46 : 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: FAN ID */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid var(--border)' }}>
            {t.fanIdTitle}
          </h2>

          <div style={{ background: 'var(--gold-light)', border: '1px solid #e0c88a', borderRadius: 'var(--radius)', padding: '24px 28px', marginBottom: 20 }}>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>
              {t.fanIdRequired}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.85, color: 'var(--text-sec)' }}>
              <p style={{ marginBottom: '1.2rem' }}>{t.fanIdP1}</p>
              <p style={{ marginBottom: '1.2rem' }}>{t.fanIdP2}</p>
              <p style={{ marginBottom: '1.2rem' }}>{t.fanIdP3}</p>
              <p style={{ margin: 0 }}>{t.fanIdP4}</p>
            </div>
          </div>
        </section>

        {/* SECTION 4: FAQ */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid var(--border)' }}>
            {t.faq}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {t.faqItems.map((item) => (
              <div key={item.q} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                  {item.q}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.75, color: 'var(--text-sec)', margin: 0 }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: STADIUM ALLOCATION */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid var(--border)' }}>
            {t.stadiumAllocation}
          </h2>

          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            {STADIUM_ALLOCATION.map((row, i) => (
              <div key={row.round.en} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', borderTop: i > 0 ? '1px solid var(--border)' : 'none', background: i % 2 === 0 ? 'var(--card)' : 'var(--card-alt)' }}>
                <div style={{ padding: '14px 18px', fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 700, color: row.round.en === 'Final' ? 'var(--gold)' : 'var(--text)', borderRight: lang === 'ar' ? 'none' : '1px solid var(--border)', borderLeft: lang === 'ar' ? '1px solid var(--border)' : 'none' }}>
                  {row.round[lang]}
                </div>
                <div style={{ padding: '14px 18px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-sec)', lineHeight: 1.5 }}>
                  {row.venues[lang]}
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)', lineHeight: 1.6, marginTop: 12 }}>
            {t.stadiumDisclaimer}
          </p>
        </section>

        {/* IMPORTANT NOTICE */}
        <div style={{ background: 'var(--navy-light)', border: '1px solid #c8d4f0', borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: 48 }}>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: 8 }}>
            {t.importantNotice}
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-sec)', lineHeight: 1.7, margin: 0 }}>
            {t.importantNoticeText}
          </p>
        </div>

        {/* Navigation links */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={`${p}/world-cup-2030/stadiums`} style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold)', background: 'var(--gold-light)', border: '1px solid #e0c88a', borderRadius: 'var(--radius-sm)', padding: '10px 20px', textDecoration: 'none' }}>
            {t.stadiumGuides}
          </Link>
          <Link href={`${p}/world-cup-2030/cities`} style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--green)', background: 'var(--green-light)', border: '1px solid #b0d8c0', borderRadius: 'var(--radius-sm)', padding: '10px 20px', textDecoration: 'none' }}>
            {t.cityGuides}
          </Link>
        </div>
      </div>
    </main>
  )
}
