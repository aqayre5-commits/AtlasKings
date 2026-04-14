'use client'

import { usePathname } from 'next/navigation'
import { StaticPage, Section, P, InfoCard } from '@/components/layout/StaticPage'

/* ------------------------------------------------------------------ */
/*  Trilingual content                                                 */
/* ------------------------------------------------------------------ */

const T = {
  en: {
    title: 'Contact Us',
    subtitle: 'We want to hear from you — fans, journalists, clubs, and partners.',

    labelEditorial: 'Editorial',
    labelPress: 'Press & Media',
    labelAdvertising: 'Advertising',
    labelPartnerships: 'Partnerships',
    labelGeneral: 'General',

    tipsTitle: 'Editorial & News Tips',
    tips1: 'Got a story? A tip? Inside information about a transfer, a club, or a player? We want to hear from you. All tip-offs are treated in strict confidence and your identity will never be disclosed without your explicit consent. Contact our editorial team at',
    tips2: 'If you need to communicate with us securely, indicate that in your initial email and we will arrange an encrypted channel for follow-up correspondence.',

    correctionsTitle: 'Corrections & Complaints',
    corrections1: 'If you believe we have published something inaccurate, misleading, or unfair, please contact us at',
    corrections2: 'with the subject line "Correction Request". Include the article URL, the specific claim you believe is incorrect, and the evidence you have. We take every complaint seriously and aim to respond within 24 hours.',

    pressTitle: 'Press & Media Enquiries',
    press1: 'For interview requests, comment requests, or media partnerships, please contact',
    press2: 'Please include your publication, your deadline, and the nature of your enquiry so we can respond as quickly as possible.',

    advertisingTitle: 'Advertising & Commercial',
    advertising1: 'For advertising rates, media packs, sponsored content opportunities, and commercial partnerships, please contact our advertising team at',
    advertising2: 'Full details are also available on our',
    advertisingLink: 'Advertise',
    advertising3: 'page.',

    responseTitle: 'Response Times',
    response1: 'We aim to respond to all enquiries within 2 business days. Editorial and corrections enquiries are prioritised and typically receive a response within 24 hours. High-volume periods around major tournaments, transfer windows, and World Cup qualifiers may affect response times.',
    response2: 'For urgent editorial matters — such as time-sensitive corrections or legal concerns — please mark your email as urgent and we will expedite our response.',
  },

  ar: {
    title: 'اتصل بنا',
    subtitle: 'نريد أن نسمع منكم — المشجعون والصحفيون والأندية والشركاء.',

    labelEditorial: 'التحرير',
    labelPress: 'الصحافة والإعلام',
    labelAdvertising: 'الإعلانات',
    labelPartnerships: 'الشراكات',
    labelGeneral: 'عام',

    tipsTitle: 'نصائح تحريرية وإخبارية',
    tips1: 'هل لديك خبر؟ معلومة داخلية عن انتقال أو نادٍ أو لاعب؟ نريد أن نسمع منك. جميع المعلومات السرية تُعامل بسرية تامة ولن يتم الكشف عن هويتك أبدًا دون موافقتك الصريحة. تواصل مع فريقنا التحريري عبر',
    tips2: 'إذا كنت بحاجة إلى التواصل معنا بشكل آمن، أشر إلى ذلك في رسالتك الأولى وسنرتب قناة مشفرة للمراسلات اللاحقة.',

    correctionsTitle: 'التصحيحات والشكاوى',
    corrections1: 'إذا كنت تعتقد أننا نشرنا شيئًا غير دقيق أو مضلل أو غير عادل، يرجى التواصل معنا عبر',
    corrections2: 'مع كتابة "طلب تصحيح" في عنوان الرسالة. يرجى تضمين رابط المقال والادعاء المحدد الذي تعتقد أنه خاطئ والأدلة التي لديك. نأخذ كل شكوى على محمل الجد ونهدف إلى الرد خلال 24 ساعة.',

    pressTitle: 'استفسارات الصحافة والإعلام',
    press1: 'لطلبات المقابلات أو التعليقات أو الشراكات الإعلامية، يرجى التواصل عبر',
    press2: 'يرجى تضمين اسم مؤسستك الإعلامية والموعد النهائي وطبيعة استفسارك حتى نتمكن من الرد في أسرع وقت ممكن.',

    advertisingTitle: 'الإعلانات والتجارة',
    advertising1: 'للاطلاع على أسعار الإعلانات وحزم الوسائط وفرص المحتوى المدعوم والشراكات التجارية، يرجى التواصل مع فريق الإعلانات لدينا عبر',
    advertising2: 'تتوفر التفاصيل الكاملة أيضًا في صفحة',
    advertisingLink: 'الإعلان',
    advertising3: '.',

    responseTitle: 'أوقات الاستجابة',
    response1: 'نهدف إلى الرد على جميع الاستفسارات خلال يومي عمل. تحظى استفسارات التحرير والتصحيحات بالأولوية وتتلقى عادةً ردًا خلال 24 ساعة. قد تؤثر فترات الذروة حول البطولات الكبرى ونوافذ الانتقالات وتصفيات كأس العالم على أوقات الاستجابة.',
    response2: 'للمسائل التحريرية العاجلة — مثل التصحيحات الحساسة زمنيًا أو المسائل القانونية — يرجى تمييز رسالتك الإلكترونية على أنها عاجلة وسنسرّع في الرد.',
  },

  fr: {
    title: 'Nous contacter',
    subtitle: 'Nous voulons vous entendre — supporters, journalistes, clubs et partenaires.',

    labelEditorial: 'Redaction',
    labelPress: 'Presse et medias',
    labelAdvertising: 'Publicite',
    labelPartnerships: 'Partenariats',
    labelGeneral: 'General',

    tipsTitle: 'Conseils editoriaux et informations',
    tips1: 'Vous avez une histoire ? Un tuyau ? Des informations privilegiees sur un transfert, un club ou un joueur ? Nous voulons vous entendre. Toutes les informations confidentielles sont traitees en toute confidentialite et votre identite ne sera jamais divulguee sans votre consentement explicite. Contactez notre equipe editoriale a',
    tips2: 'Si vous devez communiquer avec nous de maniere securisee, indiquez-le dans votre premier e-mail et nous organiserons un canal chiffre pour la correspondance ulterieure.',

    correctionsTitle: 'Corrections et reclamations',
    corrections1: 'Si vous estimez que nous avons publie quelque chose d\'inexact, de trompeur ou d\'injuste, veuillez nous contacter a',
    corrections2: 'avec l\'objet "Demande de correction". Incluez l\'URL de l\'article, l\'affirmation precise que vous contestez et les preuves dont vous disposez. Nous prenons chaque reclamation au serieux et visons a repondre sous 24 heures.',

    pressTitle: 'Demandes presse et medias',
    press1: 'Pour les demandes d\'interview, de commentaires ou de partenariats mediatiques, veuillez contacter',
    press2: 'Veuillez indiquer votre publication, votre date limite et la nature de votre demande afin que nous puissions repondre le plus rapidement possible.',

    advertisingTitle: 'Publicite et commercial',
    advertising1: 'Pour les tarifs publicitaires, les dossiers medias, les opportunites de contenu sponsorise et les partenariats commerciaux, veuillez contacter notre equipe publicitaire a',
    advertising2: 'Tous les details sont egalement disponibles sur notre page',
    advertisingLink: 'Publicite',
    advertising3: '.',

    responseTitle: 'Delais de reponse',
    response1: 'Nous visons a repondre a toutes les demandes sous 2 jours ouvrables. Les demandes editoriales et les corrections sont prioritaires et recoivent generalement une reponse sous 24 heures. Les periodes de forte activite autour des grands tournois, des fenetres de transferts et des qualifications pour la Coupe du monde peuvent affecter les delais de reponse.',
    response2: 'Pour les questions editoriales urgentes — telles que les corrections sensibles ou les preoccupations juridiques — veuillez marquer votre e-mail comme urgent et nous accelererons notre reponse.',
  },
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const emailLink = (addr: string) => (
  <a href={`mailto:${addr}`} style={{ color: 'var(--red)', textDecoration: 'underline', fontWeight: 600 }}>{addr}</a>
)

export default function ContactPage() {
  const pathname = usePathname()
  const lang = pathname?.startsWith('/ar') ? 'ar' : pathname?.startsWith('/fr') ? 'fr' : 'en'
  const t = T[lang] ?? T.en
  const isRTL = lang === 'ar'
  const advertiseHref = lang === 'en' ? '/advertise' : '/' + lang + '/advertise'

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <StaticPage title={t.title} subtitle={t.subtitle} accent="var(--green)" lang={lang}>

        <InfoCard items={[
          { label: t.labelEditorial, value: emailLink('editorial@atlaskings.com') },
          { label: t.labelPress, value: emailLink('press@atlaskings.com') },
          { label: t.labelAdvertising, value: emailLink('advertising@atlaskings.com') },
          { label: t.labelPartnerships, value: emailLink('partnerships@atlaskings.com') },
          { label: t.labelGeneral, value: emailLink('hello@atlaskings.com') },
        ]} />

        <Section title={t.tipsTitle}>
          <P>{t.tips1}{' '}{emailLink('editorial@atlaskings.com')}.</P>
          <P>{t.tips2}</P>
        </Section>

        <Section title={t.correctionsTitle}>
          <P>{t.corrections1}{' '}{emailLink('editorial@atlaskings.com')}{' '}{t.corrections2}</P>
        </Section>

        <Section title={t.pressTitle}>
          <P>{t.press1}{' '}{emailLink('press@atlaskings.com')}.</P>
          <P>{t.press2}</P>
        </Section>

        <Section title={t.advertisingTitle}>
          <P>{t.advertising1}{' '}{emailLink('advertising@atlaskings.com')}.</P>
          <P>{t.advertising2}{' '}<a href={advertiseHref} style={{ color: 'var(--red)', textDecoration: 'underline' }}>{t.advertisingLink}</a>{' '}{t.advertising3}</P>
        </Section>

        <Section title={t.responseTitle}>
          <P>{t.response1}</P>
          <P>{t.response2}</P>
        </Section>

      </StaticPage>
    </div>
  )
}
