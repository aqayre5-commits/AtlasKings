'use client'

import { usePathname } from 'next/navigation'
import { StaticPage, Section, P, InfoCard } from '@/components/layout/StaticPage'

/* ------------------------------------------------------------------ */
/*  Trilingual content                                                 */
/* ------------------------------------------------------------------ */

const T = {
  en: {
    title: 'Cookie Policy',
    subtitle: 'How Atlas Kings uses cookies and similar technologies.',
    lastUpdated: 'Last Updated',
    lastUpdatedVal: 'April 2026',
    contact: 'Privacy Contact',
    contactVal: 'privacy@atlaskings.com',

    introTitle: 'What Are Cookies',
    intro1: 'Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website. They are widely used to make websites work more efficiently, to provide a better user experience, and to supply information to the operators of the site.',
    intro2: 'This Cookie Policy explains what cookies Atlas Kings uses, why we use them, and how you can manage your preferences. This policy should be read alongside our Privacy Policy, which explains how we handle your personal data more broadly.',

    essentialTitle: 'Essential Cookies',
    essentialIntro: 'These cookies are strictly necessary for the website to function and cannot be switched off in our systems. They are usually set in response to actions you take on the site, such as setting your language preference or navigating between pages. Without these cookies, the site cannot operate properly.',
    essentialLang: 'Language Preference Cookie: Stores your selected language (English, Arabic, or French) so the site displays content in your preferred language on subsequent visits. This cookie persists for 365 days.',
    essentialSession: 'Session Cookie: Maintains your browsing session as you navigate between pages. This ensures that your interactions within a single visit function correctly. Session cookies are deleted when you close your browser.',
    essentialConsent: 'Cookie Consent Cookie: Records your cookie consent choice so we do not repeatedly ask you for your preference. This cookie persists for 180 days.',
    essentialTheme: 'Theme Preference: Stores your light or dark mode preference in browser local storage so the site renders with your chosen appearance on future visits.',

    analyticsTitle: 'Analytics Cookies',
    analyticsIntro: 'Analytics cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This data allows us to improve the structure, content, and performance of the site.',
    analyticsGA: 'Google Analytics: If enabled, we use Google Analytics to collect anonymized data about page views, session duration, bounce rate, approximate geographic location (derived from anonymized IP addresses), and the pages and features that are most and least popular. Google Analytics sets the following cookies:',
    analyticsGA1: '_ga: Distinguishes unique users. Expires after 2 years.',
    analyticsGA2: '_ga_[ID]: Maintains session state. Expires after 2 years.',
    analyticsGA3: '_gid: Distinguishes unique users. Expires after 24 hours.',
    analyticsGA4: '_gat: Throttles request rate. Expires after 1 minute.',
    analyticsOptOut: 'You can opt out of Google Analytics across all websites by installing the Google Analytics Opt-out Browser Add-on, available at tools.google.com/dlpage/gaoptout. Alternatively, you can disable analytics cookies through your browser settings or our cookie consent mechanism.',

    thirdTitle: 'Third-Party Cookies',
    thirdIntro: 'In the course of providing our Service, certain third-party services may set their own cookies on your device:',
    thirdAPI: 'API-Football / API-Sports: Our site retrieves football data from API-Football. When your browser makes requests to their servers to load match data, scores, or statistics, their servers may set cookies or collect technical data in accordance with their own policies. We do not control these cookies.',
    thirdEmbed: 'Embedded Content: If we embed content from third-party platforms (such as video players or social media widgets), those platforms may set their own cookies. Each third-party provider has its own cookie and privacy policy.',
    thirdNote: 'We review our third-party integrations regularly and aim to minimize the number of third-party cookies set through our site.',

    manageTitle: 'How to Manage Cookies',
    manageIntro: 'You have several options for managing cookies:',
    manageBrowser: 'Browser Settings: Most web browsers allow you to control cookies through their settings. You can typically choose to block all cookies, accept all cookies, or be notified when a cookie is set so you can decide whether to accept it. The exact process varies by browser. Consult your browser\'s help documentation for specific instructions.',
    manageChrome: 'Google Chrome: Settings > Privacy and Security > Cookies and other site data',
    manageFirefox: 'Mozilla Firefox: Settings > Privacy & Security > Cookies and Site Data',
    manageSafari: 'Safari: Preferences > Privacy > Manage Website Data',
    manageEdge: 'Microsoft Edge: Settings > Cookies and site permissions > Cookies and site data',
    manageConsent: 'Cookie Consent Banner: When you first visit our site, you will see a cookie consent banner that allows you to accept or decline non-essential cookies. You can change your preference at any time by clearing your cookies and revisiting the site.',
    manageConsequence: 'Please note that blocking or deleting essential cookies may impact the functionality of the website. For example, the site may not remember your language preference if the language cookie is blocked.',

    consentTitle: 'Cookie Consent',
    consent1: 'In accordance with applicable data protection regulations, including the EU ePrivacy Directive and GDPR, we obtain your consent before placing non-essential cookies on your device. Essential cookies that are strictly necessary for the operation of the website do not require consent.',
    consent2: 'When you first visit our site, a cookie consent banner will appear. You may choose to accept all cookies, accept only essential cookies, or customize your preferences. Your choice is stored in a consent cookie and will be remembered for subsequent visits.',
    consent3: 'You may withdraw your consent at any time by clearing your browser cookies and revisiting the site, at which point you will be presented with the consent banner again.',

    updatesTitle: 'Updates to This Policy',
    updates: 'We may update this Cookie Policy from time to time to reflect changes in the cookies we use or for other operational, legal, or regulatory reasons. When we make changes, we will update the "Last Updated" date at the top of this page. We encourage you to review this policy periodically to stay informed about our use of cookies.',

    contactTitle: 'Contact Us',
    contactText: 'If you have any questions about our use of cookies or this Cookie Policy, please contact us at:',
    contactEmail: 'privacy@atlaskings.com',
  },

  ar: {
    title: 'سياسة ملفات تعريف الارتباط',
    subtitle: 'كيف يستخدم أطلس كينغز ملفات تعريف الارتباط والتقنيات المماثلة.',
    lastUpdated: 'آخر تحديث',
    lastUpdatedVal: 'أبريل 2026',
    contact: 'التواصل بشأن الخصوصية',
    contactVal: 'privacy@atlaskings.com',

    introTitle: 'ما هي ملفات تعريف الارتباط',
    intro1: 'ملفات تعريف الارتباط هي ملفات نصية صغيرة يتم وضعها على جهازك (الكمبيوتر أو الهاتف الذكي أو الجهاز اللوحي) عند زيارتك لموقع ويب. تُستخدم على نطاق واسع لجعل المواقع تعمل بكفاءة أكبر وتوفير تجربة مستخدم أفضل وتزويد مشغلي الموقع بالمعلومات.',
    intro2: 'توضح سياسة ملفات تعريف الارتباط هذه ما هي ملفات تعريف الارتباط التي يستخدمها أطلس كينغز ولماذا نستخدمها وكيف يمكنك إدارة تفضيلاتك. يجب قراءة هذه السياسة إلى جانب سياسة الخصوصية الخاصة بنا.',

    essentialTitle: 'ملفات تعريف الارتباط الأساسية',
    essentialIntro: 'هذه الملفات ضرورية لعمل الموقع ولا يمكن إيقافها في أنظمتنا. عادةً ما يتم تعيينها استجابةً لإجراءات تقوم بها على الموقع. بدون هذه الملفات، لا يمكن للموقع العمل بشكل صحيح.',
    essentialLang: 'ملف تفضيل اللغة: يخزن لغتك المختارة (العربية أو الإنجليزية أو الفرنسية) لعرض المحتوى بلغتك المفضلة في الزيارات اللاحقة. صالح لمدة 365 يومًا.',
    essentialSession: 'ملف الجلسة: يحافظ على جلسة التصفح أثناء تنقلك بين الصفحات. يتم حذف ملفات الجلسة عند إغلاق المتصفح.',
    essentialConsent: 'ملف الموافقة على ملفات تعريف الارتباط: يسجل اختيار موافقتك حتى لا نسألك مرارًا. صالح لمدة 180 يومًا.',
    essentialTheme: 'تفضيل المظهر: يخزن تفضيلك للوضع الفاتح أو الداكن في التخزين المحلي للمتصفح.',

    analyticsTitle: 'ملفات تعريف الارتباط التحليلية',
    analyticsIntro: 'تساعدنا ملفات تعريف الارتباط التحليلية على فهم كيفية تفاعل الزوار مع موقعنا من خلال جمع المعلومات والإبلاغ عنها بشكل مجهول.',
    analyticsGA: 'Google Analytics: إذا تم تفعيله، نستخدم Google Analytics لجمع بيانات مجهولة حول مشاهدات الصفحات ومدة الجلسة ومعدل الارتداد والموقع الجغرافي التقريبي. يضع Google Analytics الملفات التالية:',
    analyticsGA1: '_ga: يميز المستخدمين الفريدين. ينتهي بعد سنتين.',
    analyticsGA2: '_ga_[ID]: يحافظ على حالة الجلسة. ينتهي بعد سنتين.',
    analyticsGA3: '_gid: يميز المستخدمين الفريدين. ينتهي بعد 24 ساعة.',
    analyticsGA4: '_gat: يحد من معدل الطلبات. ينتهي بعد دقيقة واحدة.',
    analyticsOptOut: 'يمكنك إلغاء الاشتراك في Google Analytics عبر جميع المواقع عن طريق تثبيت إضافة إلغاء الاشتراك في Google Analytics المتاحة على tools.google.com/dlpage/gaoptout.',

    thirdTitle: 'ملفات تعريف الارتباط للأطراف الثالثة',
    thirdIntro: 'أثناء تقديم خدمتنا، قد تضع بعض خدمات الأطراف الثالثة ملفاتها الخاصة على جهازك:',
    thirdAPI: 'API-Football / API-Sports: يسترجع موقعنا بيانات كرة القدم من API-Football. عندما يقوم متصفحك بطلبات إلى خوادمهم، قد تضع خوادمهم ملفات تعريف ارتباط وفقًا لسياساتهم الخاصة.',
    thirdEmbed: 'المحتوى المضمن: إذا قمنا بتضمين محتوى من منصات خارجية (مثل مشغلات الفيديو أو عناصر وسائل التواصل الاجتماعي)، فقد تضع تلك المنصات ملفاتها الخاصة.',
    thirdNote: 'نراجع تكاملاتنا مع الأطراف الثالثة بانتظام ونسعى لتقليل عدد ملفات تعريف الارتباط الخارجية.',

    manageTitle: 'كيفية إدارة ملفات تعريف الارتباط',
    manageIntro: 'لديك عدة خيارات لإدارة ملفات تعريف الارتباط:',
    manageBrowser: 'إعدادات المتصفح: تسمح لك معظم المتصفحات بالتحكم في ملفات تعريف الارتباط من خلال إعداداتها. يمكنك عادةً اختيار حظر جميع الملفات أو قبولها جميعًا أو إعلامك عند تعيين ملف.',
    manageChrome: 'Google Chrome: الإعدادات > الخصوصية والأمان > ملفات تعريف الارتباط',
    manageFirefox: 'Mozilla Firefox: الإعدادات > الخصوصية والأمان > ملفات تعريف الارتباط',
    manageSafari: 'Safari: التفضيلات > الخصوصية > إدارة بيانات الموقع',
    manageEdge: 'Microsoft Edge: الإعدادات > الأذونات > ملفات تعريف الارتباط',
    manageConsent: 'شريط الموافقة: عند زيارتك الأولى لموقعنا، سيظهر شريط موافقة يتيح لك قبول أو رفض الملفات غير الأساسية. يمكنك تغيير تفضيلك في أي وقت بمسح ملفاتك وإعادة زيارة الموقع.',
    manageConsequence: 'يرجى ملاحظة أن حظر أو حذف الملفات الأساسية قد يؤثر على وظائف الموقع. مثلاً، قد لا يتذكر الموقع تفضيل لغتك.',

    consentTitle: 'الموافقة على ملفات تعريف الارتباط',
    consent1: 'وفقًا لأنظمة حماية البيانات المعمول بها، بما في ذلك توجيه الخصوصية الإلكترونية للاتحاد الأوروبي واللائحة العامة لحماية البيانات، نحصل على موافقتك قبل وضع ملفات غير أساسية على جهازك.',
    consent2: 'عند زيارتك الأولى للموقع، سيظهر شريط موافقة. يمكنك اختيار قبول جميع الملفات أو الأساسية فقط أو تخصيص تفضيلاتك. يتم تخزين اختيارك في ملف موافقة.',
    consent3: 'يمكنك سحب موافقتك في أي وقت بمسح ملفات تعريف الارتباط في متصفحك وإعادة زيارة الموقع.',

    updatesTitle: 'تحديثات هذه السياسة',
    updates: 'قد نقوم بتحديث سياسة ملفات تعريف الارتباط هذه من وقت لآخر. عند إجراء تغييرات، سنحدث تاريخ "آخر تحديث" في أعلى هذه الصفحة.',

    contactTitle: 'اتصل بنا',
    contactText: 'إذا كانت لديك أي أسئلة حول استخدامنا لملفات تعريف الارتباط أو هذه السياسة، يرجى التواصل معنا عبر:',
    contactEmail: 'privacy@atlaskings.com',
  },

  fr: {
    title: 'Politique de Cookies',
    subtitle: 'Comment Atlas Kings utilise les cookies et technologies similaires.',
    lastUpdated: 'Derniere mise a jour',
    lastUpdatedVal: 'Avril 2026',
    contact: 'Contact vie privee',
    contactVal: 'privacy@atlaskings.com',

    introTitle: 'Que sont les cookies',
    intro1: 'Les cookies sont de petits fichiers texte places sur votre appareil (ordinateur, smartphone ou tablette) lorsque vous visitez un site web. Ils sont largement utilises pour faire fonctionner les sites plus efficacement, offrir une meilleure experience utilisateur et fournir des informations aux operateurs du site.',
    intro2: 'Cette Politique de Cookies explique quels cookies Atlas Kings utilise, pourquoi nous les utilisons et comment vous pouvez gerer vos preferences. Cette politique doit etre lue conjointement avec notre Politique de Confidentialite.',

    essentialTitle: 'Cookies essentiels',
    essentialIntro: 'Ces cookies sont strictement necessaires au fonctionnement du site et ne peuvent pas etre desactives dans nos systemes. Ils sont generalement configures en reponse a vos actions sur le site. Sans ces cookies, le site ne peut pas fonctionner correctement.',
    essentialLang: 'Cookie de preference linguistique : Stocke votre langue selectionnee (anglais, arabe ou francais) pour afficher le contenu dans votre langue preferee lors de visites ulterieures. Ce cookie persiste pendant 365 jours.',
    essentialSession: 'Cookie de session : Maintient votre session de navigation lorsque vous naviguez entre les pages. Les cookies de session sont supprimes lorsque vous fermez votre navigateur.',
    essentialConsent: 'Cookie de consentement : Enregistre votre choix de consentement aux cookies afin de ne pas vous redemander votre preference. Ce cookie persiste pendant 180 jours.',
    essentialTheme: 'Preference de theme : Stocke votre preference de mode clair ou sombre dans le stockage local du navigateur.',

    analyticsTitle: 'Cookies analytiques',
    analyticsIntro: 'Les cookies analytiques nous aident a comprendre comment les visiteurs interagissent avec notre site en collectant et rapportant des informations de maniere anonyme.',
    analyticsGA: 'Google Analytics : Si active, nous utilisons Google Analytics pour collecter des donnees anonymisees sur les pages vues, la duree de session, le taux de rebond et la localisation geographique approximative. Google Analytics utilise les cookies suivants :',
    analyticsGA1: '_ga : Distingue les utilisateurs uniques. Expire apres 2 ans.',
    analyticsGA2: '_ga_[ID] : Maintient l\'etat de la session. Expire apres 2 ans.',
    analyticsGA3: '_gid : Distingue les utilisateurs uniques. Expire apres 24 heures.',
    analyticsGA4: '_gat : Limite le taux de requetes. Expire apres 1 minute.',
    analyticsOptOut: 'Vous pouvez refuser Google Analytics sur tous les sites en installant le module complementaire de desactivation de Google Analytics, disponible sur tools.google.com/dlpage/gaoptout.',

    thirdTitle: 'Cookies tiers',
    thirdIntro: 'Dans le cadre de la fourniture de notre Service, certains services tiers peuvent placer leurs propres cookies sur votre appareil :',
    thirdAPI: 'API-Football / API-Sports : Notre site recupere des donnees football depuis API-Football. Lorsque votre navigateur envoie des requetes a leurs serveurs, ceux-ci peuvent placer des cookies conformement a leurs propres politiques.',
    thirdEmbed: 'Contenu integre : Si nous integrons du contenu provenant de plateformes tierces (comme des lecteurs video ou des widgets de reseaux sociaux), ces plateformes peuvent placer leurs propres cookies.',
    thirdNote: 'Nous examinons regulierement nos integrations tierces et cherchons a minimiser le nombre de cookies tiers places via notre site.',

    manageTitle: 'Comment gerer les cookies',
    manageIntro: 'Vous disposez de plusieurs options pour gerer les cookies :',
    manageBrowser: 'Parametres du navigateur : La plupart des navigateurs vous permettent de controler les cookies via leurs parametres. Vous pouvez generalement choisir de bloquer tous les cookies, de les accepter tous ou d\'etre notifie lorsqu\'un cookie est place.',
    manageChrome: 'Google Chrome : Parametres > Confidentialite et securite > Cookies et autres donnees de site',
    manageFirefox: 'Mozilla Firefox : Parametres > Vie privee et securite > Cookies et donnees de site',
    manageSafari: 'Safari : Preferences > Confidentialite > Gerer les donnees de site web',
    manageEdge: 'Microsoft Edge : Parametres > Autorisations > Cookies et donnees de site',
    manageConsent: 'Banniere de consentement : Lors de votre premiere visite, une banniere de consentement vous permet d\'accepter ou de refuser les cookies non essentiels. Vous pouvez modifier votre choix a tout moment en effacant vos cookies et en revisitant le site.',
    manageConsequence: 'Veuillez noter que le blocage ou la suppression des cookies essentiels peut affecter le fonctionnement du site. Par exemple, le site pourrait ne pas retenir votre preference linguistique.',

    consentTitle: 'Consentement aux cookies',
    consent1: 'Conformement aux reglementations applicables en matiere de protection des donnees, notamment la directive ePrivacy de l\'UE et le RGPD, nous obtenons votre consentement avant de placer des cookies non essentiels sur votre appareil.',
    consent2: 'Lors de votre premiere visite, une banniere de consentement apparaitra. Vous pourrez accepter tous les cookies, uniquement les essentiels, ou personnaliser vos preferences. Votre choix est stocke dans un cookie de consentement.',
    consent3: 'Vous pouvez retirer votre consentement a tout moment en effacant les cookies de votre navigateur et en revisitant le site.',

    updatesTitle: 'Mises a jour de cette politique',
    updates: 'Nous pouvons mettre a jour cette Politique de Cookies periodiquement. En cas de modification, nous mettrons a jour la date de "Derniere mise a jour" en haut de cette page.',

    contactTitle: 'Nous contacter',
    contactText: 'Si vous avez des questions concernant notre utilisation des cookies ou cette politique, veuillez nous contacter a :',
    contactEmail: 'privacy@atlaskings.com',
  },
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CookiePolicyPage() {
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
          <P>{t.intro1}</P>
          <P>{t.intro2}</P>
        </Section>

        <Section title={t.essentialTitle}>
          <P>{t.essentialIntro}</P>
          <ul style={{ paddingInlineStart: 20, marginBottom: '1.1rem' }}>
            <li style={{ marginBottom: 10 }}><strong>{t.essentialLang}</strong></li>
            <li style={{ marginBottom: 10 }}><strong>{t.essentialSession}</strong></li>
            <li style={{ marginBottom: 10 }}><strong>{t.essentialConsent}</strong></li>
            <li style={{ marginBottom: 10 }}><strong>{t.essentialTheme}</strong></li>
          </ul>
        </Section>

        <Section title={t.analyticsTitle}>
          <P>{t.analyticsIntro}</P>
          <P>{t.analyticsGA}</P>
          <ul style={{ paddingInlineStart: 20, marginBottom: '1.1rem' }}>
            <li style={{ marginBottom: 6 }}><code>{t.analyticsGA1}</code></li>
            <li style={{ marginBottom: 6 }}><code>{t.analyticsGA2}</code></li>
            <li style={{ marginBottom: 6 }}><code>{t.analyticsGA3}</code></li>
            <li style={{ marginBottom: 6 }}><code>{t.analyticsGA4}</code></li>
          </ul>
          <P>{t.analyticsOptOut}</P>
        </Section>

        <Section title={t.thirdTitle}>
          <P>{t.thirdIntro}</P>
          <P>{t.thirdAPI}</P>
          <P>{t.thirdEmbed}</P>
          <P><em>{t.thirdNote}</em></P>
        </Section>

        <Section title={t.manageTitle}>
          <P>{t.manageIntro}</P>
          <P>{t.manageBrowser}</P>
          <ul style={{ paddingInlineStart: 20, marginBottom: '1.1rem' }}>
            <li style={{ marginBottom: 6 }}>{t.manageChrome}</li>
            <li style={{ marginBottom: 6 }}>{t.manageFirefox}</li>
            <li style={{ marginBottom: 6 }}>{t.manageSafari}</li>
            <li style={{ marginBottom: 6 }}>{t.manageEdge}</li>
          </ul>
          <P>{t.manageConsent}</P>
          <P><strong>{t.manageConsequence}</strong></P>
        </Section>

        <Section title={t.consentTitle}>
          <P>{t.consent1}</P>
          <P>{t.consent2}</P>
          <P>{t.consent3}</P>
        </Section>

        <Section title={t.updatesTitle}>
          <P>{t.updates}</P>
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
