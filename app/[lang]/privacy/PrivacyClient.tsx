'use client'

import { usePathname } from 'next/navigation'
import { StaticPage, Section, P, InfoCard } from '@/components/layout/StaticPage'

/* ------------------------------------------------------------------ */
/*  Trilingual content                                                 */
/* ------------------------------------------------------------------ */

const T = {
  en: {
    title: 'Privacy Policy',
    subtitle: 'How Atlas Kings collects, uses, and protects your data.',
    lastUpdated: 'Last Updated',
    lastUpdatedVal: 'April 2026',
    contact: 'Privacy Contact',
    contactVal: 'privacy@atlaskings.com',
    scope: 'Scope',

    introTitle: 'Introduction',
    intro: 'Atlas Kings ("we", "us", or "our") operates the atlaskings.com website and related services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. By accessing or using the site, you agree to the terms of this Privacy Policy. If you do not agree, please discontinue use of the site immediately.',

    collectTitle: 'Information We Collect',
    collectAuto: 'Automatically Collected Information: When you visit our site, we may automatically collect certain technical data, including your IP address, browser type and version, operating system, referring URL, pages visited, time spent on each page, and the date and time of your visit. This data is collected through server logs and analytics tools.',
    collectCookies: 'Cookies and Local Storage: We use cookies and browser local storage to remember your language preference (English, Arabic, or French), store session data, and manage cookie consent preferences. For more detail, please see our Cookie Policy.',
    collectPush: 'Push Notification Preferences: If you opt in to browser push notifications for match alerts or breaking news, we store your notification subscription token and your preferences for which types of alerts you wish to receive. You may revoke this at any time through your browser settings.',
    collectVoluntary: 'Voluntarily Provided Information: If you contact us via email or any feedback form, we collect the information you provide, such as your name and email address, solely to respond to your inquiry.',

    useTitle: 'How We Use Your Information',
    use1: 'To deliver and maintain the website, including football news, match scores, fixtures, and standings.',
    use2: 'To personalize your experience, such as remembering your preferred language and display settings.',
    use3: 'To send push notifications about matches and news, only if you have opted in.',
    use4: 'To analyze website traffic and usage patterns so we can improve the content and performance of the site.',
    use5: 'To respond to your inquiries and provide customer support.',
    use6: 'To detect, prevent, and address technical issues or security threats.',

    thirdTitle: 'Third-Party Services',
    third1: 'API-Football: We use the API-Football service (provided by API-Sports) to retrieve live scores, fixtures, standings, and other football data displayed on our site. When you load pages containing this data, your browser may make requests to API-Football servers. Please refer to the API-Sports privacy policy for details on their data practices.',
    third2: 'Google Analytics: We may use Google Analytics to understand how visitors interact with our site. Google Analytics collects data such as pages visited, session duration, and approximate geographic location derived from your IP address. Google processes this data in accordance with its own privacy policy. You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on.',
    third3: 'We do not sell, rent, or share your personal data with third parties for their own marketing purposes.',

    retentionTitle: 'Data Retention',
    retention: 'We retain automatically collected analytics data for a maximum of 26 months, after which it is aggregated or deleted. Push notification tokens are retained for as long as your subscription remains active. If you contact us, we retain your correspondence for up to 12 months to handle follow-up inquiries. Cookie and local storage data persists until you clear your browser data or the cookie expires.',

    rightsTitle: 'Your Rights',
    rightsIntro: 'Depending on your jurisdiction, you may have the following rights regarding your personal data:',
    rightsAccess: 'Right of Access: You may request a copy of the personal data we hold about you.',
    rightsRectify: 'Right to Rectification: You may request that we correct any inaccurate data.',
    rightsDelete: 'Right to Erasure: You may request that we delete your personal data, subject to certain legal obligations.',
    rightsRestrict: 'Right to Restrict Processing: You may request that we limit how we use your data.',
    rightsPort: 'Right to Data Portability: Where applicable, you may request your data in a structured, machine-readable format.',
    rightsOptOut: 'Right to Opt Out: You may opt out of analytics tracking by adjusting your cookie settings or using browser-level controls.',
    rightsGDPR: 'If you are located in the European Economic Area, these rights are provided under the General Data Protection Regulation (GDPR). If you are a California resident, the California Consumer Privacy Act (CCPA) grants you similar rights, including the right to know what personal information is collected and the right to request its deletion.',
    rightsExercise: 'To exercise any of these rights, please contact us at privacy@atlaskings.com.',

    securityTitle: 'Data Security',
    security: 'We implement reasonable technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is completely secure, and we cannot guarantee absolute security.',

    childrenTitle: 'Children\'s Privacy',
    children: 'Our site is not directed at children under the age of 16. We do not knowingly collect personal data from children. If you believe we have inadvertently collected information from a child, please contact us and we will promptly delete it.',

    changesTitle: 'Changes to This Policy',
    changes: 'We may update this Privacy Policy from time to time. When we make material changes, we will post the updated policy on this page and update the "Last Updated" date above. We encourage you to review this page periodically.',

    contactTitle: 'Contact Us',
    contactText: 'If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:',
    contactEmail: 'privacy@atlaskings.com',
  },

  ar: {
    title: 'سياسة الخصوصية',
    subtitle: 'كيف يقوم أطلس كينغز بجمع بياناتك واستخدامها وحمايتها.',
    lastUpdated: 'آخر تحديث',
    lastUpdatedVal: 'أبريل 2026',
    contact: 'التواصل بشأن الخصوصية',
    contactVal: 'privacy@atlaskings.com',
    scope: 'النطاق',

    introTitle: 'مقدمة',
    intro: 'يدير أطلس كينغز ("نحن" أو "لنا") موقع atlaskings.com والخدمات ذات الصلة. توضح سياسة الخصوصية هذه كيف نجمع معلوماتك ونستخدمها ونفصح عنها ونحميها عند زيارتك لموقعنا. باستخدامك للموقع، فإنك توافق على شروط سياسة الخصوصية هذه. إذا كنت لا توافق، يرجى التوقف عن استخدام الموقع فورًا.',

    collectTitle: 'المعلومات التي نجمعها',
    collectAuto: 'المعلومات المجمعة تلقائيًا: عند زيارتك لموقعنا، قد نجمع تلقائيًا بيانات تقنية معينة، بما في ذلك عنوان IP الخاص بك ونوع المتصفح وإصداره ونظام التشغيل وعنوان URL المرجعي والصفحات التي تمت زيارتها والوقت المستغرق في كل صفحة وتاريخ ووقت زيارتك.',
    collectCookies: 'ملفات تعريف الارتباط والتخزين المحلي: نستخدم ملفات تعريف الارتباط والتخزين المحلي للمتصفح لتذكر تفضيلات لغتك (العربية أو الإنجليزية أو الفرنسية) وتخزين بيانات الجلسة وإدارة تفضيلات الموافقة على ملفات تعريف الارتباط.',
    collectPush: 'تفضيلات الإشعارات الفورية: إذا اخترت تلقي إشعارات المتصفح لتنبيهات المباريات أو الأخبار العاجلة، فإننا نخزن رمز اشتراك الإشعارات وتفضيلاتك. يمكنك إلغاء ذلك في أي وقت من خلال إعدادات المتصفح.',
    collectVoluntary: 'المعلومات المقدمة طوعًا: إذا تواصلت معنا عبر البريد الإلكتروني أو أي نموذج ملاحظات، فإننا نجمع المعلومات التي تقدمها فقط للرد على استفسارك.',

    useTitle: 'كيف نستخدم معلوماتك',
    use1: 'لتقديم وصيانة الموقع، بما في ذلك أخبار كرة القدم والنتائج والمواعيد والترتيب.',
    use2: 'لتخصيص تجربتك، مثل تذكر لغتك المفضلة وإعدادات العرض.',
    use3: 'لإرسال إشعارات فورية حول المباريات والأخبار، فقط إذا اخترت ذلك.',
    use4: 'لتحليل حركة المرور وأنماط الاستخدام لتحسين المحتوى وأداء الموقع.',
    use5: 'للرد على استفساراتك وتقديم الدعم.',
    use6: 'لاكتشاف ومنع ومعالجة المشكلات التقنية أو التهديدات الأمنية.',

    thirdTitle: 'خدمات الطرف الثالث',
    third1: 'API-Football: نستخدم خدمة API-Football (المقدمة من API-Sports) لاسترجاع النتائج المباشرة والمواعيد والترتيب وبيانات كرة القدم الأخرى المعروضة على موقعنا.',
    third2: 'Google Analytics: قد نستخدم Google Analytics لفهم كيفية تفاعل الزوار مع موقعنا. يجمع Google Analytics بيانات مثل الصفحات التي تمت زيارتها ومدة الجلسة والموقع الجغرافي التقريبي.',
    third3: 'نحن لا نبيع أو نؤجر أو نشارك بياناتك الشخصية مع أطراف ثالثة لأغراضهم التسويقية.',

    retentionTitle: 'الاحتفاظ بالبيانات',
    retention: 'نحتفظ ببيانات التحليلات المجمعة تلقائيًا لمدة أقصاها 26 شهرًا. يتم الاحتفاظ برموز الإشعارات طالما كان اشتراكك نشطًا. إذا تواصلت معنا، نحتفظ بمراسلاتك لمدة تصل إلى 12 شهرًا.',

    rightsTitle: 'حقوقك',
    rightsIntro: 'حسب نطاقك القضائي، قد تكون لديك الحقوق التالية فيما يتعلق ببياناتك الشخصية:',
    rightsAccess: 'حق الوصول: يمكنك طلب نسخة من البيانات الشخصية التي نحتفظ بها عنك.',
    rightsRectify: 'حق التصحيح: يمكنك طلب تصحيح أي بيانات غير دقيقة.',
    rightsDelete: 'حق الحذف: يمكنك طلب حذف بياناتك الشخصية.',
    rightsRestrict: 'حق تقييد المعالجة: يمكنك طلب تقييد كيفية استخدامنا لبياناتك.',
    rightsPort: 'حق نقل البيانات: حيثما ينطبق، يمكنك طلب بياناتك بتنسيق منظم وقابل للقراءة آليًا.',
    rightsOptOut: 'حق الانسحاب: يمكنك الانسحاب من تتبع التحليلات عن طريق تعديل إعدادات ملفات تعريف الارتباط.',
    rightsGDPR: 'إذا كنت في المنطقة الاقتصادية الأوروبية، فإن هذه الحقوق مكفولة بموجب اللائحة العامة لحماية البيانات (GDPR). إذا كنت مقيمًا في كاليفورنيا، فإن قانون خصوصية المستهلك في كاليفورنيا (CCPA) يمنحك حقوقًا مماثلة.',
    rightsExercise: 'لممارسة أي من هذه الحقوق، يرجى التواصل معنا عبر privacy@atlaskings.com.',

    securityTitle: 'أمن البيانات',
    security: 'ننفذ تدابير تقنية وتنظيمية معقولة لحماية بياناتك الشخصية ضد الوصول غير المصرح به أو التعديل أو الإفصاح أو التدمير. ومع ذلك، لا يمكننا ضمان الأمان المطلق.',

    childrenTitle: 'خصوصية الأطفال',
    children: 'موقعنا غير موجه للأطفال دون سن 16 عامًا. نحن لا نجمع عن عمد بيانات شخصية من الأطفال. إذا كنت تعتقد أننا جمعنا معلومات من طفل عن غير قصد، يرجى التواصل معنا وسنحذفها فورًا.',

    changesTitle: 'التغييرات على هذه السياسة',
    changes: 'قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. عند إجراء تغييرات جوهرية، سننشر السياسة المحدثة في هذه الصفحة ونحدث تاريخ "آخر تحديث" أعلاه.',

    contactTitle: 'اتصل بنا',
    contactText: 'إذا كانت لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية هذه أو ممارسات البيانات لدينا، يرجى التواصل معنا عبر:',
    contactEmail: 'privacy@atlaskings.com',
  },

  fr: {
    title: 'Politique de Confidentialite',
    subtitle: 'Comment Atlas Kings collecte, utilise et protege vos donnees.',
    lastUpdated: 'Derniere mise a jour',
    lastUpdatedVal: 'Avril 2026',
    contact: 'Contact vie privee',
    contactVal: 'privacy@atlaskings.com',
    scope: 'Portee',

    introTitle: 'Introduction',
    intro: 'Atlas Kings ("nous" ou "notre") exploite le site web atlaskings.com et les services associes. Cette Politique de Confidentialite explique comment nous collectons, utilisons, divulguons et protegeons vos informations lorsque vous visitez notre site. En utilisant le site, vous acceptez les termes de cette politique. Si vous n\'etes pas d\'accord, veuillez cesser d\'utiliser le site immediatement.',

    collectTitle: 'Informations que nous collectons',
    collectAuto: 'Informations collectees automatiquement : Lorsque vous visitez notre site, nous pouvons collecter automatiquement certaines donnees techniques, notamment votre adresse IP, le type et la version de votre navigateur, votre systeme d\'exploitation, l\'URL de provenance, les pages visitees, le temps passe sur chaque page, ainsi que la date et l\'heure de votre visite.',
    collectCookies: 'Cookies et stockage local : Nous utilisons des cookies et le stockage local du navigateur pour memoriser votre preference linguistique (anglais, arabe ou francais), stocker les donnees de session et gerer les preferences de consentement aux cookies.',
    collectPush: 'Preferences de notifications push : Si vous choisissez de recevoir des notifications push pour les alertes de match ou les actualites, nous stockons votre jeton d\'abonnement et vos preferences. Vous pouvez revoquer cela a tout moment via les parametres de votre navigateur.',
    collectVoluntary: 'Informations fournies volontairement : Si vous nous contactez par e-mail ou via un formulaire, nous collectons les informations que vous fournissez uniquement pour repondre a votre demande.',

    useTitle: 'Comment nous utilisons vos informations',
    use1: 'Pour fournir et maintenir le site web, y compris les actualites football, les scores, les calendriers et les classements.',
    use2: 'Pour personnaliser votre experience, comme memoriser votre langue preferee et vos parametres d\'affichage.',
    use3: 'Pour envoyer des notifications push concernant les matchs et les actualites, uniquement si vous y avez consenti.',
    use4: 'Pour analyser le trafic et les habitudes d\'utilisation afin d\'ameliorer le contenu et les performances du site.',
    use5: 'Pour repondre a vos demandes et fournir une assistance.',
    use6: 'Pour detecter, prevenir et resoudre les problemes techniques ou les menaces de securite.',

    thirdTitle: 'Services tiers',
    third1: 'API-Football : Nous utilisons le service API-Football (fourni par API-Sports) pour recuperer les scores en direct, les calendriers, les classements et autres donnees football affichees sur notre site.',
    third2: 'Google Analytics : Nous pouvons utiliser Google Analytics pour comprendre comment les visiteurs interagissent avec notre site. Google Analytics collecte des donnees telles que les pages visitees, la duree de session et la localisation geographique approximative.',
    third3: 'Nous ne vendons, ne louons ni ne partageons vos donnees personnelles avec des tiers a des fins de marketing.',

    retentionTitle: 'Conservation des donnees',
    retention: 'Nous conservons les donnees d\'analyse collectees automatiquement pendant un maximum de 26 mois. Les jetons de notification sont conserves tant que votre abonnement est actif. Si vous nous contactez, nous conservons votre correspondance pendant 12 mois maximum.',

    rightsTitle: 'Vos droits',
    rightsIntro: 'Selon votre juridiction, vous pouvez disposer des droits suivants concernant vos donnees personnelles :',
    rightsAccess: 'Droit d\'acces : Vous pouvez demander une copie des donnees personnelles que nous detenons a votre sujet.',
    rightsRectify: 'Droit de rectification : Vous pouvez demander la correction de toute donnee inexacte.',
    rightsDelete: 'Droit a l\'effacement : Vous pouvez demander la suppression de vos donnees personnelles.',
    rightsRestrict: 'Droit a la limitation du traitement : Vous pouvez demander que nous limitions l\'utilisation de vos donnees.',
    rightsPort: 'Droit a la portabilite : Le cas echeant, vous pouvez demander vos donnees dans un format structure et lisible par machine.',
    rightsOptOut: 'Droit de retrait : Vous pouvez refuser le suivi analytique en ajustant vos parametres de cookies.',
    rightsGDPR: 'Si vous etes situe dans l\'Espace economique europeen, ces droits sont prevus par le Reglement General sur la Protection des Donnees (RGPD). Si vous etes resident en Californie, le California Consumer Privacy Act (CCPA) vous accorde des droits similaires.',
    rightsExercise: 'Pour exercer l\'un de ces droits, veuillez nous contacter a privacy@atlaskings.com.',

    securityTitle: 'Securite des donnees',
    security: 'Nous mettons en oeuvre des mesures techniques et organisationnelles raisonnables pour proteger vos donnees personnelles contre tout acces, modification, divulgation ou destruction non autorises. Cependant, nous ne pouvons pas garantir une securite absolue.',

    childrenTitle: 'Vie privee des enfants',
    children: 'Notre site ne s\'adresse pas aux enfants de moins de 16 ans. Nous ne collectons pas sciemment de donnees personnelles aupres d\'enfants. Si vous pensez que nous avons collecte par inadvertance des informations aupres d\'un enfant, veuillez nous contacter et nous les supprimerons rapidement.',

    changesTitle: 'Modifications de cette politique',
    changes: 'Nous pouvons mettre a jour cette Politique de Confidentialite periodiquement. En cas de modifications importantes, nous publierons la politique mise a jour sur cette page et mettrons a jour la date de "Derniere mise a jour" ci-dessus.',

    contactTitle: 'Nous contacter',
    contactText: 'Si vous avez des questions ou des preoccupations concernant cette Politique de Confidentialite ou nos pratiques en matiere de donnees, veuillez nous contacter a :',
    contactEmail: 'privacy@atlaskings.com',
  },
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PrivacyPolicyPage() {
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
        ]} />

        <Section title={t.introTitle}>
          <P>{t.intro}</P>
        </Section>

        <Section title={t.collectTitle}>
          <P>{t.collectAuto}</P>
          <P>{t.collectCookies}</P>
          <P>{t.collectPush}</P>
          <P>{t.collectVoluntary}</P>
        </Section>

        <Section title={t.useTitle}>
          <ul style={{ paddingInlineStart: 20, marginBottom: '1.1rem' }}>
            <li style={{ marginBottom: 6 }}>{t.use1}</li>
            <li style={{ marginBottom: 6 }}>{t.use2}</li>
            <li style={{ marginBottom: 6 }}>{t.use3}</li>
            <li style={{ marginBottom: 6 }}>{t.use4}</li>
            <li style={{ marginBottom: 6 }}>{t.use5}</li>
            <li style={{ marginBottom: 6 }}>{t.use6}</li>
          </ul>
        </Section>

        <Section title={t.thirdTitle}>
          <P>{t.third1}</P>
          <P>{t.third2}</P>
          <P><strong>{t.third3}</strong></P>
        </Section>

        <Section title={t.retentionTitle}>
          <P>{t.retention}</P>
        </Section>

        <Section title={t.rightsTitle}>
          <P>{t.rightsIntro}</P>
          <ul style={{ paddingInlineStart: 20, marginBottom: '1.1rem' }}>
            <li style={{ marginBottom: 6 }}>{t.rightsAccess}</li>
            <li style={{ marginBottom: 6 }}>{t.rightsRectify}</li>
            <li style={{ marginBottom: 6 }}>{t.rightsDelete}</li>
            <li style={{ marginBottom: 6 }}>{t.rightsRestrict}</li>
            <li style={{ marginBottom: 6 }}>{t.rightsPort}</li>
            <li style={{ marginBottom: 6 }}>{t.rightsOptOut}</li>
          </ul>
          <P>{t.rightsGDPR}</P>
          <P>{t.rightsExercise}</P>
        </Section>

        <Section title={t.securityTitle}>
          <P>{t.security}</P>
        </Section>

        <Section title={t.childrenTitle}>
          <P>{t.children}</P>
        </Section>

        <Section title={t.changesTitle}>
          <P>{t.changes}</P>
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
