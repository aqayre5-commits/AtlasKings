'use client'

import { usePathname } from 'next/navigation'
import { StaticPage, Section, P, InfoCard } from '@/components/layout/StaticPage'

/* ------------------------------------------------------------------ */
/*  Trilingual content                                                 */
/* ------------------------------------------------------------------ */

const T = {
  en: {
    title: 'Terms of Service',
    subtitle: 'Please read these terms carefully before using Atlas Kings.',
    lastUpdated: 'Last Updated',
    lastUpdatedVal: 'April 2026',
    contact: 'Legal Contact',
    contactVal: 'legal@atlaskings.com',
    governing: 'Governing Law',
    governingVal: 'Kingdom of Morocco',

    acceptTitle: 'Acceptance of Terms',
    accept1: 'By accessing or using the Atlas Kings website at atlaskings.com (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms, you must not access or use the Service.',
    accept2: 'We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to this page. Your continued use of the Service after any modifications constitutes your acceptance of the revised Terms. It is your responsibility to review these Terms periodically.',

    serviceTitle: 'Description of Service',
    service1: 'Atlas Kings is a football news and information platform that provides users with match scores, fixtures, standings, league tables, team and player statistics, and editorial content related to football, with a particular focus on Moroccan football and the Botola Pro league.',
    service2: 'The Service is provided free of charge and is accessible via web browsers on desktop and mobile devices. We may add, modify, or discontinue features of the Service at any time without prior notice.',
    service3: 'Match data, scores, and statistics displayed on the Service are sourced from third-party data providers, including API-Football (API-Sports). While we strive for accuracy, we do not guarantee the completeness, timeliness, or accuracy of any data displayed. Users should not rely solely on our Service for time-sensitive decisions, including but not limited to betting or wagering.',

    ipTitle: 'Intellectual Property',
    ip1: 'All content on the Service, including but not limited to text, graphics, logos, images, page layouts, and software, is the property of Atlas Kings or its content suppliers and is protected by international copyright, trademark, and other intellectual property laws.',
    ip2: 'The Atlas Kings name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of Atlas Kings. You may not use such marks without our prior written permission.',
    ip3: 'You may view, download, and print pages from the Service for your own personal, non-commercial use, provided that you do not modify the content and you retain all copyright and proprietary notices. Any other use, including reproduction, modification, distribution, or republication, without our prior written consent is strictly prohibited.',

    conductTitle: 'User Conduct',
    conductIntro: 'When using the Service, you agree not to:',
    conduct1: 'Use the Service for any unlawful purpose or in violation of any applicable local, national, or international law.',
    conduct2: 'Attempt to gain unauthorized access to any portion of the Service, its servers, or any systems connected to the Service.',
    conduct3: 'Use automated means (bots, scrapers, crawlers) to access the Service or extract data without our express written permission.',
    conduct4: 'Interfere with or disrupt the integrity or performance of the Service or the data contained therein.',
    conduct5: 'Transmit any viruses, worms, defects, Trojan horses, or any items of a destructive nature.',
    conduct6: 'Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity.',
    conduct7: 'Use the Service to send unsolicited promotional or advertising material (spam).',

    disclaimerTitle: 'Disclaimer of Warranties',
    disclaimer1: 'The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.',
    disclaimer2: 'We do not warrant that the Service will be uninterrupted, timely, secure, or error-free. Match scores, fixtures, standings, and all other data are provided by third-party services and may contain errors, delays, or inaccuracies. We expressly disclaim any liability for the accuracy or reliability of third-party data.',
    disclaimer3: 'We do not endorse or assume responsibility for any third-party content, products, or services advertised or offered through the Service or any hyperlinked website.',

    liabilityTitle: 'Limitation of Liability',
    liability1: 'To the fullest extent permitted by applicable law, Atlas Kings, its directors, employees, partners, agents, suppliers, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:',
    liability2: 'Your use of or inability to use the Service.',
    liability3: 'Any unauthorized access to or use of our servers and/or any personal information stored therein.',
    liability4: 'Any interruption or cessation of transmission to or from the Service.',
    liability5: 'Any errors, inaccuracies, or omissions in any content or data, or for any loss or damage incurred as a result of the use of any content or data made available through the Service.',
    liability6: 'In no event shall our total liability to you for all claims exceed the amount of zero (0) Moroccan Dirhams, as the Service is provided free of charge.',

    indemnTitle: 'Indemnification',
    indemn: 'You agree to defend, indemnify, and hold harmless Atlas Kings and its officers, directors, employees, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, or expenses arising from your use of the Service or your violation of these Terms.',

    thirdPartyTitle: 'Third-Party Links and Services',
    thirdParty: 'The Service may contain links to third-party websites, services, or resources that are not owned or controlled by Atlas Kings. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that Atlas Kings shall not be responsible or liable for any damage or loss caused by or in connection with the use of any such content, goods, or services available through any such third-party websites or services.',

    terminationTitle: 'Termination',
    termination: 'We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms. Upon termination, your right to use the Service will cease immediately. All provisions of the Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.',

    governingTitle: 'Governing Law',
    governingText: 'These Terms shall be governed by and construed in accordance with the laws of the Kingdom of Morocco, without regard to its conflict of law provisions. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in Casablanca, Morocco.',

    severabilityTitle: 'Severability',
    severability: 'If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law, and the remaining provisions will continue in full force and effect.',

    contactTitle: 'Contact Us',
    contactText: 'If you have any questions about these Terms of Service, please contact us at:',
    contactEmail: 'legal@atlaskings.com',
  },

  ar: {
    title: 'شروط الخدمة',
    subtitle: 'يرجى قراءة هذه الشروط بعناية قبل استخدام أطلس كينغز.',
    lastUpdated: 'آخر تحديث',
    lastUpdatedVal: 'أبريل 2026',
    contact: 'التواصل القانوني',
    contactVal: 'legal@atlaskings.com',
    governing: 'القانون الحاكم',
    governingVal: 'المملكة المغربية',

    acceptTitle: 'قبول الشروط',
    accept1: 'من خلال الوصول إلى موقع أطلس كينغز على atlaskings.com ("الخدمة") أو استخدامه، فإنك توافق على الالتزام بشروط الخدمة هذه ("الشروط"). إذا كنت لا توافق على جميع هذه الشروط، يجب عليك عدم الوصول إلى الخدمة أو استخدامها.',
    accept2: 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. ستكون التغييرات سارية فور نشرها في هذه الصفحة. استمرارك في استخدام الخدمة بعد أي تعديلات يعني قبولك للشروط المعدلة.',

    serviceTitle: 'وصف الخدمة',
    service1: 'أطلس كينغز هو منصة أخبار ومعلومات كرة القدم تقدم للمستخدمين نتائج المباريات والمواعيد والترتيب وجداول الدوري وإحصائيات الفرق واللاعبين والمحتوى التحريري المتعلق بكرة القدم، مع التركيز بشكل خاص على كرة القدم المغربية والدوري الاحترافي البطولة.',
    service2: 'يتم تقديم الخدمة مجانًا ويمكن الوصول إليها عبر متصفحات الويب على أجهزة سطح المكتب والأجهزة المحمولة. قد نضيف أو نعدل أو نوقف ميزات الخدمة في أي وقت دون إشعار مسبق.',
    service3: 'بيانات المباريات والنتائج والإحصائيات المعروضة على الخدمة مصدرها مزودو بيانات من أطراف ثالثة، بما في ذلك API-Football. على الرغم من سعينا للدقة، لا نضمن اكتمال أو دقة أو توقيت أي بيانات معروضة.',

    ipTitle: 'الملكية الفكرية',
    ip1: 'جميع المحتوى على الخدمة، بما في ذلك النصوص والرسومات والشعارات والصور وتخطيطات الصفحات والبرامج، هو ملك لأطلس كينغز أو مورديه ومحمي بقوانين حقوق النشر والعلامات التجارية الدولية.',
    ip2: 'اسم أطلس كينغز والشعار وجميع الأسماء والشعارات ذات الصلة هي علامات تجارية لأطلس كينغز. لا يجوز لك استخدام هذه العلامات دون إذن كتابي مسبق منا.',
    ip3: 'يمكنك عرض وتنزيل وطباعة صفحات من الخدمة لاستخدامك الشخصي غير التجاري فقط. أي استخدام آخر بما في ذلك الاستنساخ أو التعديل أو التوزيع أو إعادة النشر دون موافقتنا الكتابية المسبقة محظور تمامًا.',

    conductTitle: 'سلوك المستخدم',
    conductIntro: 'عند استخدام الخدمة، توافق على عدم:',
    conduct1: 'استخدام الخدمة لأي غرض غير قانوني أو بما ينتهك أي قانون محلي أو وطني أو دولي معمول به.',
    conduct2: 'محاولة الوصول غير المصرح به إلى أي جزء من الخدمة أو خوادمها أو أي أنظمة متصلة بها.',
    conduct3: 'استخدام وسائل آلية (روبوتات، أدوات كشط) للوصول إلى الخدمة أو استخراج البيانات دون إذن كتابي صريح منا.',
    conduct4: 'التدخل في أو تعطيل سلامة أو أداء الخدمة أو البيانات الموجودة فيها.',
    conduct5: 'نقل أي فيروسات أو ديدان أو عيوب أو أحصنة طروادة أو أي عناصر ذات طبيعة مدمرة.',
    conduct6: 'انتحال شخصية أي شخص أو كيان أو تقديم بيانات كاذبة عن انتمائك.',
    conduct7: 'استخدام الخدمة لإرسال مواد ترويجية أو إعلانية غير مرغوب فيها (سبام).',

    disclaimerTitle: 'إخلاء المسؤولية عن الضمانات',
    disclaimer1: 'يتم تقديم الخدمة على أساس "كما هي" و"حسب التوفر" دون ضمانات من أي نوع، سواء صريحة أو ضمنية.',
    disclaimer2: 'لا نضمن أن الخدمة ستكون متواصلة أو في الوقت المناسب أو آمنة أو خالية من الأخطاء. نتائج المباريات والمواعيد والترتيب مقدمة من خدمات أطراف ثالثة وقد تحتوي على أخطاء أو تأخيرات.',
    disclaimer3: 'نحن لا نؤيد أو نتحمل مسؤولية أي محتوى أو منتجات أو خدمات لأطراف ثالثة.',

    liabilityTitle: 'تحديد المسؤولية',
    liability1: 'إلى أقصى حد يسمح به القانون المعمول به، لن يكون أطلس كينغز ومديروه وموظفوه وشركاؤه مسؤولين عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية أو عقابية، الناتجة عن:',
    liability2: 'استخدامك للخدمة أو عدم قدرتك على استخدامها.',
    liability3: 'أي وصول غير مصرح به إلى خوادمنا أو أي معلومات شخصية مخزنة فيها.',
    liability4: 'أي انقطاع أو توقف في الإرسال من أو إلى الخدمة.',
    liability5: 'أي أخطاء أو عدم دقة في أي محتوى أو بيانات.',
    liability6: 'لن تتجاوز مسؤوليتنا الإجمالية تجاهك صفر (0) درهم مغربي، حيث يتم تقديم الخدمة مجانًا.',

    indemnTitle: 'التعويض',
    indemn: 'توافق على الدفاع عن أطلس كينغز ومسؤوليه ومديريه وموظفيه وتعويضهم وإبراء ذمتهم من وضد أي وجميع المطالبات والأضرار والالتزامات والتكاليف الناشئة عن استخدامك للخدمة أو انتهاكك لهذه الشروط.',

    thirdPartyTitle: 'روابط وخدمات الأطراف الثالثة',
    thirdParty: 'قد تحتوي الخدمة على روابط لمواقع أو خدمات أو موارد تابعة لأطراف ثالثة ليست مملوكة أو خاضعة لسيطرة أطلس كينغز. ليس لدينا أي سيطرة على محتوى أو سياسات الخصوصية لأي مواقع تابعة لأطراف ثالثة ولا نتحمل أي مسؤولية عنها.',

    terminationTitle: 'الإنهاء',
    termination: 'يجوز لنا إنهاء أو تعليق وصولك إلى الخدمة فورًا، دون إشعار مسبق أو مسؤولية، لأي سبب كان. عند الإنهاء، يتوقف حقك في استخدام الخدمة فورًا.',

    governingTitle: 'القانون الحاكم',
    governingText: 'تخضع هذه الشروط لقوانين المملكة المغربية وتفسر وفقًا لها. أي نزاعات ناشئة عن هذه الشروط تخضع للاختصاص الحصري لمحاكم الدار البيضاء، المغرب.',

    severabilityTitle: 'قابلية الفصل',
    severability: 'إذا تبين أن أي حكم من هذه الشروط غير قابل للتنفيذ أو غير صالح، فسيتم تغيير هذا الحكم وتفسيره لتحقيق أهدافه إلى أقصى حد ممكن، وتبقى الأحكام المتبقية سارية بالكامل.',

    contactTitle: 'اتصل بنا',
    contactText: 'إذا كانت لديك أي أسئلة حول شروط الخدمة هذه، يرجى التواصل معنا عبر:',
    contactEmail: 'legal@atlaskings.com',
  },

  fr: {
    title: 'Conditions d\'Utilisation',
    subtitle: 'Veuillez lire attentivement ces conditions avant d\'utiliser Atlas Kings.',
    lastUpdated: 'Derniere mise a jour',
    lastUpdatedVal: 'Avril 2026',
    contact: 'Contact juridique',
    contactVal: 'legal@atlaskings.com',
    governing: 'Droit applicable',
    governingVal: 'Royaume du Maroc',

    acceptTitle: 'Acceptation des conditions',
    accept1: 'En accedant ou en utilisant le site web Atlas Kings a l\'adresse atlaskings.com (le "Service"), vous acceptez d\'etre lie par ces Conditions d\'Utilisation ("Conditions"). Si vous n\'acceptez pas l\'ensemble de ces Conditions, vous ne devez pas acceder au Service ni l\'utiliser.',
    accept2: 'Nous nous reservons le droit de modifier ces Conditions a tout moment. Les modifications seront effectives des leur publication sur cette page. Votre utilisation continue du Service apres toute modification constitue votre acceptation des Conditions revisees.',

    serviceTitle: 'Description du Service',
    service1: 'Atlas Kings est une plateforme d\'actualites et d\'informations sur le football qui fournit aux utilisateurs des scores de matchs, des calendriers, des classements, des tableaux de ligue, des statistiques d\'equipes et de joueurs, ainsi que du contenu editorial lie au football, avec un accent particulier sur le football marocain et la Botola Pro.',
    service2: 'Le Service est fourni gratuitement et est accessible via des navigateurs web sur ordinateurs de bureau et appareils mobiles. Nous pouvons ajouter, modifier ou interrompre des fonctionnalites du Service a tout moment sans preavis.',
    service3: 'Les donnees de matchs, scores et statistiques affichees sur le Service proviennent de fournisseurs de donnees tiers, notamment API-Football (API-Sports). Bien que nous nous efforcions d\'etre precis, nous ne garantissons pas l\'exhaustivite, la ponctualite ou l\'exactitude des donnees affichees.',

    ipTitle: 'Propriete intellectuelle',
    ip1: 'Tout le contenu du Service, y compris les textes, graphiques, logos, images, mises en page et logiciels, est la propriete d\'Atlas Kings ou de ses fournisseurs de contenu et est protege par les lois internationales sur la propriete intellectuelle.',
    ip2: 'Le nom Atlas Kings, le logo et tous les noms, logos et slogans associes sont des marques deposees d\'Atlas Kings. Vous ne pouvez pas utiliser ces marques sans notre autorisation ecrite prealable.',
    ip3: 'Vous pouvez consulter, telecharger et imprimer des pages du Service pour votre usage personnel et non commercial uniquement. Toute autre utilisation, y compris la reproduction, la modification, la distribution ou la republication, sans notre consentement ecrit prealable est strictement interdite.',

    conductTitle: 'Conduite de l\'utilisateur',
    conductIntro: 'En utilisant le Service, vous vous engagez a ne pas :',
    conduct1: 'Utiliser le Service a des fins illegales ou en violation de toute loi applicable.',
    conduct2: 'Tenter d\'obtenir un acces non autorise a toute partie du Service, de ses serveurs ou de tout systeme connecte.',
    conduct3: 'Utiliser des moyens automatises (robots, scrapers) pour acceder au Service ou extraire des donnees sans notre autorisation ecrite expresse.',
    conduct4: 'Interferer avec ou perturber l\'integrite ou les performances du Service.',
    conduct5: 'Transmettre des virus, vers, defauts, chevaux de Troie ou tout element de nature destructrice.',
    conduct6: 'Usurper l\'identite de toute personne ou entite, ou faussement declarer votre affiliation.',
    conduct7: 'Utiliser le Service pour envoyer du materiel promotionnel ou publicitaire non sollicite (spam).',

    disclaimerTitle: 'Exclusion de garanties',
    disclaimer1: 'Le Service est fourni "EN L\'ETAT" et "SELON DISPONIBILITE" sans garantie d\'aucune sorte, expresse ou implicite.',
    disclaimer2: 'Nous ne garantissons pas que le Service sera ininterrompu, ponctuel, securise ou exempt d\'erreurs. Les scores, calendriers et classements sont fournis par des services tiers et peuvent contenir des erreurs ou des retards.',
    disclaimer3: 'Nous n\'approuvons pas et n\'assumons aucune responsabilite pour tout contenu, produit ou service de tiers.',

    liabilityTitle: 'Limitation de responsabilite',
    liability1: 'Dans toute la mesure permise par la loi applicable, Atlas Kings et ses dirigeants, employes, partenaires et affilies ne seront pas responsables de dommages indirects, accessoires, speciaux, consecutifs ou punitifs resultant de :',
    liability2: 'Votre utilisation ou votre incapacite a utiliser le Service.',
    liability3: 'Tout acces non autorise a nos serveurs ou a toute information personnelle qui y est stockee.',
    liability4: 'Toute interruption ou cessation de transmission vers ou depuis le Service.',
    liability5: 'Toute erreur, inexactitude ou omission dans tout contenu ou donnee.',
    liability6: 'En aucun cas notre responsabilite totale envers vous ne depassera zero (0) Dirham marocain, le Service etant fourni gratuitement.',

    indemnTitle: 'Indemnisation',
    indemn: 'Vous acceptez de defendre, indemniser et degager de toute responsabilite Atlas Kings et ses dirigeants, administrateurs, employes et agents contre toute reclamation, dommage, obligation, perte ou cout decoulant de votre utilisation du Service ou de votre violation de ces Conditions.',

    thirdPartyTitle: 'Liens et services tiers',
    thirdParty: 'Le Service peut contenir des liens vers des sites web, services ou ressources de tiers qui ne sont pas detenus ou controles par Atlas Kings. Nous n\'avons aucun controle sur le contenu ou les politiques de confidentialite de ces sites tiers et n\'assumons aucune responsabilite a leur egard.',

    terminationTitle: 'Resiliation',
    termination: 'Nous pouvons resilier ou suspendre votre acces au Service immediatement, sans preavis ni responsabilite, pour quelque raison que ce soit. A la resiliation, votre droit d\'utiliser le Service cesse immediatement.',

    governingTitle: 'Droit applicable',
    governingText: 'Ces Conditions sont regies et interpretees conformement aux lois du Royaume du Maroc. Tout litige decoulant de ces Conditions sera soumis a la competence exclusive des tribunaux de Casablanca, Maroc.',

    severabilityTitle: 'Divisibilite',
    severability: 'Si une disposition de ces Conditions est jugee inapplicable ou invalide, cette disposition sera modifiee et interpretee pour atteindre ses objectifs dans la mesure du possible, et les dispositions restantes resteront pleinement en vigueur.',

    contactTitle: 'Nous contacter',
    contactText: 'Si vous avez des questions concernant ces Conditions d\'Utilisation, veuillez nous contacter a :',
    contactEmail: 'legal@atlaskings.com',
  },
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function TermsOfServicePage() {
  const pathname = usePathname()
  const lang = pathname?.startsWith('/ar') ? 'ar' : pathname?.startsWith('/fr') ? 'fr' : 'en'
  const t = T[lang] ?? T.en
  const isRTL = lang === 'ar'

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <StaticPage title={t.title} subtitle={t.subtitle} lang={lang}>

        <InfoCard items={[
          { label: t.lastUpdated, value: t.lastUpdatedVal },
          { label: t.contact, value: <a href={`mailto:${t.contactVal}`} style={{ color: 'var(--green)' }}>{t.contactVal}</a> },
          { label: t.governing, value: t.governingVal },
        ]} />

        <Section title={t.acceptTitle}>
          <P>{t.accept1}</P>
          <P>{t.accept2}</P>
        </Section>

        <Section title={t.serviceTitle}>
          <P>{t.service1}</P>
          <P>{t.service2}</P>
          <P>{t.service3}</P>
        </Section>

        <Section title={t.ipTitle}>
          <P>{t.ip1}</P>
          <P>{t.ip2}</P>
          <P>{t.ip3}</P>
        </Section>

        <Section title={t.conductTitle}>
          <P>{t.conductIntro}</P>
          <ul style={{ paddingInlineStart: 20, marginBottom: '1.1rem' }}>
            <li style={{ marginBottom: 6 }}>{t.conduct1}</li>
            <li style={{ marginBottom: 6 }}>{t.conduct2}</li>
            <li style={{ marginBottom: 6 }}>{t.conduct3}</li>
            <li style={{ marginBottom: 6 }}>{t.conduct4}</li>
            <li style={{ marginBottom: 6 }}>{t.conduct5}</li>
            <li style={{ marginBottom: 6 }}>{t.conduct6}</li>
            <li style={{ marginBottom: 6 }}>{t.conduct7}</li>
          </ul>
        </Section>

        <Section title={t.disclaimerTitle}>
          <P>{t.disclaimer1}</P>
          <P>{t.disclaimer2}</P>
          <P>{t.disclaimer3}</P>
        </Section>

        <Section title={t.liabilityTitle}>
          <P>{t.liability1}</P>
          <ul style={{ paddingInlineStart: 20, marginBottom: '1.1rem' }}>
            <li style={{ marginBottom: 6 }}>{t.liability2}</li>
            <li style={{ marginBottom: 6 }}>{t.liability3}</li>
            <li style={{ marginBottom: 6 }}>{t.liability4}</li>
            <li style={{ marginBottom: 6 }}>{t.liability5}</li>
          </ul>
          <P><strong>{t.liability6}</strong></P>
        </Section>

        <Section title={t.indemnTitle}>
          <P>{t.indemn}</P>
        </Section>

        <Section title={t.thirdPartyTitle}>
          <P>{t.thirdParty}</P>
        </Section>

        <Section title={t.terminationTitle}>
          <P>{t.termination}</P>
        </Section>

        <Section title={t.governingTitle}>
          <P>{t.governingText}</P>
        </Section>

        <Section title={t.severabilityTitle}>
          <P>{t.severability}</P>
        </Section>

        <Section title={t.contactTitle}>
          <P>{t.contactText}</P>
          <P>
            <a href={`mailto:${t.contactEmail}`} style={{ color: 'var(--green)', fontWeight: 600 }}>
              {t.contactEmail}
            </a>
          </P>
        </Section>

      </StaticPage>
    </div>
  )
}
