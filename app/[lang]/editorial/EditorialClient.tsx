'use client'

import { usePathname } from 'next/navigation'
import { StaticPage, Section, P } from '@/components/layout/StaticPage'

/* ------------------------------------------------------------------ */
/*  Trilingual content                                                 */
/* ------------------------------------------------------------------ */

const T = {
  en: {
    title: 'Editorial Guidelines',
    subtitle: 'How we report, verify, and stand behind our journalism.',

    independenceTitle: 'Independence',
    independence1: 'Atlas Kings is editorially independent. No advertiser, sponsor, club, federation, or external investor has any influence over our editorial decisions. Commercial relationships are kept entirely separate from our newsroom. Our advertising team and our editorial team operate independently of one another.',
    independence2: 'When we write about a club, a player, or a competition, we do so solely on editorial merit — not because of any commercial relationship with that entity. If a potential conflict of interest exists, we disclose it transparently to our readers.',

    accuracyTitle: 'Accuracy & Verification',
    accuracy1: 'Every story published on Atlas Kings is verified before publication. For breaking news, we require at minimum two independent sources before we publish an unconfirmed report. We label developing stories clearly until they are confirmed by official channels.',
    accuracy2: 'Transfer rumours are clearly labelled as rumours. Opinion pieces are clearly labelled as opinion. Analysis is clearly labelled as analysis. We do not blur these lines — our readers deserve to know exactly what they are reading.',
    accuracy3: 'We do not publish clickbait headlines that misrepresent the content of a story. The headline must accurately reflect what the article says. We do not sensationalise or exaggerate to drive traffic.',

    sourcesTitle: 'Sources',
    sources1: 'We protect the identity of confidential sources absolutely. When a source asks to remain anonymous, we honour that request without exception. We do not reveal source identities to third parties, including employers, clubs, federations, or legal representatives, unless compelled by law.',
    sources2: 'We make every effort to name sources where possible. Anonymous sourcing is used only when necessary to protect the source and is always disclosed to readers — for example, "according to a source close to the club" or "a federation official speaking on condition of anonymity".',
    sources3: 'We never fabricate quotes or attribute statements to sources who did not make them. All direct quotes are verified with the speaker or their representative before publication whenever possible.',

    correctionsTitle: 'Corrections Policy',
    corrections1: 'When we make a factual error, we correct it promptly and transparently. Corrections are published on the original article with a clear note explaining what was wrong and what the correct information is. We do not silently edit articles after publication.',
    corrections2: 'Significant corrections are noted at the top of the article. Minor corrections — such as typographical errors or formatting issues — may be made without a formal correction notice.',
    corrections3: 'To report an error, contact us at',
    correctionsEmail: 'editorial@atlaskings.com',
    corrections4: 'We aim to acknowledge every correction request within 24 hours and publish corrections as quickly as the facts allow.',

    sponsoredTitle: 'Sponsored Content',
    sponsored1: 'Any sponsored, promoted, or branded content on Atlas Kings is clearly labelled as such with a visible "Sponsored" or "Partner Content" tag. Sponsored content is produced separately from our editorial team and does not influence our independent coverage in any way.',
    sponsored2: 'We reserve the right to refuse any sponsored content that conflicts with our editorial values or that could mislead our readers. Our editorial team has final say over all content that appears on the site.',

    socialTitle: 'Social Media',
    social1: 'Our social media accounts are operated by the Atlas Kings editorial team and reflect our editorial values and standards. We do not publish unverified transfer rumours on social media as confirmed news. We apply the same standards of accuracy, fairness, and verification to social media as we do to our website.',
    social2: 'User-generated content shared or retweeted by our accounts does not constitute an endorsement. When we share breaking news on social media, we update our posts if the information changes or proves to be incorrect.',

    contactTitle: 'Contact the Newsroom',
    contact1: 'Editorial complaints, tip-offs, corrections, and questions about our journalism can be directed to',
    contact2: 'We welcome feedback from our readers and take every enquiry seriously.',
  },

  ar: {
    title: 'الإرشادات التحريرية',
    subtitle: 'كيف نُعِدّ تقاريرنا ونتحقق منها ونقف وراء صحافتنا.',

    independenceTitle: 'الاستقلالية',
    independence1: 'أطلس كينغز مستقل تحريريًا. لا يملك أي معلن أو راعٍ أو نادٍ أو اتحاد أو مستثمر خارجي أي تأثير على قراراتنا التحريرية. تُبقى العلاقات التجارية منفصلة تمامًا عن غرفة الأخبار لدينا. يعمل فريق الإعلانات وفريق التحرير بشكل مستقل عن بعضهما البعض.',
    independence2: 'عندما نكتب عن نادٍ أو لاعب أو مسابقة، نفعل ذلك بناءً على الجدارة التحريرية فقط — وليس بسبب أي علاقة تجارية مع ذلك الكيان. إذا وُجد تضارب محتمل في المصالح، نكشف عنه بشفافية لقرائنا.',

    accuracyTitle: 'الدقة والتحقق',
    accuracy1: 'يتم التحقق من كل خبر يُنشر على أطلس كينغز قبل النشر. بالنسبة للأخبار العاجلة، نشترط مصدرين مستقلين على الأقل قبل نشر تقرير غير مؤكد. نميّز القصص قيد التطور بوضوح حتى يتم تأكيدها من القنوات الرسمية.',
    accuracy2: 'شائعات الانتقالات تُصنّف بوضوح على أنها شائعات. مقالات الرأي تُصنّف بوضوح على أنها رأي. التحليلات تُصنّف بوضوح على أنها تحليل. لا نطمس هذه الخطوط — قراؤنا يستحقون أن يعرفوا بالضبط ما يقرأونه.',
    accuracy3: 'لا ننشر عناوين مضللة لا تعكس محتوى المقال. يجب أن يعكس العنوان بدقة ما يقوله المقال. لا نبالغ أو نثير الإثارة لجذب الزيارات.',

    sourcesTitle: 'المصادر',
    sources1: 'نحمي هوية المصادر السرية بشكل مطلق. عندما يطلب مصدر عدم الكشف عن هويته، نحترم هذا الطلب دون استثناء. لا نكشف عن هويات المصادر لأطراف ثالثة، بما في ذلك أصحاب العمل والأندية والاتحادات أو الممثلين القانونيين، إلا إذا أُلزمنا قانونيًا.',
    sources2: 'نبذل كل جهد لتسمية المصادر حيثما أمكن. لا يُستخدم المصدر المجهول إلا عند الضرورة لحماية المصدر، ويُفصح عنه دائمًا للقراء — على سبيل المثال، "وفقًا لمصدر مقرب من النادي" أو "مسؤول في الاتحاد تحدث بشرط عدم الكشف عن هويته".',
    sources3: 'لا نختلق أبدًا اقتباسات أو ننسب تصريحات إلى مصادر لم تدلِ بها. جميع الاقتباسات المباشرة يتم التحقق منها مع المتحدث أو ممثله قبل النشر كلما أمكن ذلك.',

    correctionsTitle: 'سياسة التصحيحات',
    corrections1: 'عندما نرتكب خطأً واقعيًا، نصححه بسرعة وشفافية. تُنشر التصحيحات على المقال الأصلي مع ملاحظة واضحة تشرح ما كان خاطئًا وما هي المعلومة الصحيحة. لا نعدّل المقالات بصمت بعد النشر.',
    corrections2: 'التصحيحات المهمة تُذكر في أعلى المقال. التصحيحات الطفيفة — مثل الأخطاء المطبعية أو مشاكل التنسيق — قد تُجرى دون إشعار تصحيح رسمي.',
    corrections3: 'للإبلاغ عن خطأ، تواصل معنا عبر',
    correctionsEmail: 'editorial@atlaskings.com',
    corrections4: 'نهدف إلى الإقرار بكل طلب تصحيح خلال 24 ساعة ونشر التصحيحات بأسرع ما تسمح به الوقائع.',

    sponsoredTitle: 'المحتوى المدعوم',
    sponsored1: 'أي محتوى مدعوم أو مُروَّج أو يحمل علامة تجارية على أطلس كينغز يُصنّف بوضوح بعلامة "مدعوم" أو "محتوى شريك" مرئية. يُنتج المحتوى المدعوم بشكل منفصل عن فريقنا التحريري ولا يؤثر على تغطيتنا المستقلة بأي شكل.',
    sponsored2: 'نحتفظ بالحق في رفض أي محتوى مدعوم يتعارض مع قيمنا التحريرية أو قد يضلل قراءنا. لفريقنا التحريري الكلمة الأخيرة بشأن كل المحتوى الذي يظهر على الموقع.',

    socialTitle: 'وسائل التواصل الاجتماعي',
    social1: 'تُدار حساباتنا على وسائل التواصل الاجتماعي من قبل فريق تحرير أطلس كينغز وتعكس قيمنا ومعاييرنا التحريرية. لا ننشر شائعات انتقالات غير مؤكدة على وسائل التواصل كأخبار مؤكدة. نطبق نفس معايير الدقة والإنصاف والتحقق على وسائل التواصل كما نفعل على موقعنا.',
    social2: 'المحتوى الذي ينشئه المستخدمون والذي تشاركه حساباتنا لا يُشكّل تأييدًا. عندما نشارك أخبارًا عاجلة على وسائل التواصل، نحدّث منشوراتنا إذا تغيرت المعلومات أو ثبت عدم صحتها.',

    contactTitle: 'التواصل مع غرفة الأخبار',
    contact1: 'يمكن توجيه الشكاوى التحريرية والمعلومات والتصحيحات والأسئلة حول صحافتنا إلى',
    contact2: 'نرحب بملاحظات قرائنا ونأخذ كل استفسار على محمل الجد.',
  },

  fr: {
    title: 'Directives editoriales',
    subtitle: 'Comment nous enqueton, verifions et assumons notre journalisme.',

    independenceTitle: 'Independance',
    independence1: 'Atlas Kings est editorialement independant. Aucun annonceur, sponsor, club, federation ou investisseur externe n\'exerce d\'influence sur nos decisions editoriales. Les relations commerciales sont entierement separees de notre redaction. Notre equipe publicitaire et notre equipe editoriale fonctionnent independamment l\'une de l\'autre.',
    independence2: 'Lorsque nous ecrivons sur un club, un joueur ou une competition, nous le faisons uniquement sur la base du merite editorial — et non en raison d\'une relation commerciale avec cette entite. Si un conflit d\'interets potentiel existe, nous le divulguons de maniere transparente a nos lecteurs.',

    accuracyTitle: 'Exactitude et verification',
    accuracy1: 'Chaque article publie sur Atlas Kings est verifie avant publication. Pour les actualites de derniere minute, nous exigeons au minimum deux sources independantes avant de publier un rapport non confirme. Nous identifions clairement les informations en cours de developpement jusqu\'a leur confirmation par les canaux officiels.',
    accuracy2: 'Les rumeurs de transferts sont clairement identifiees comme des rumeurs. Les articles d\'opinion sont clairement identifies comme des opinions. Les analyses sont clairement identifiees comme des analyses. Nous ne brouillons pas ces frontieres — nos lecteurs meritent de savoir exactement ce qu\'ils lisent.',
    accuracy3: 'Nous ne publions pas de titres racoleurs qui deforment le contenu d\'un article. Le titre doit refleter fidelement ce que dit l\'article. Nous ne sensationnalisons ni n\'exagerons pour generer du trafic.',

    sourcesTitle: 'Sources',
    sources1: 'Nous protegeons l\'identite des sources confidentielles de maniere absolue. Lorsqu\'une source demande l\'anonymat, nous respectons cette demande sans exception. Nous ne revelons pas l\'identite des sources a des tiers, y compris les employeurs, les clubs, les federations ou les representants juridiques, sauf si la loi nous y oblige.',
    sources2: 'Nous faisons tout notre possible pour nommer les sources lorsque c\'est possible. Le sourcing anonyme n\'est utilise que lorsque c\'est necessaire pour proteger la source et est toujours divulgue aux lecteurs — par exemple, "selon une source proche du club" ou "un responsable de la federation s\'exprimant sous condition d\'anonymat".',
    sources3: 'Nous ne fabriquons jamais de citations et n\'attribuons jamais de declarations a des sources qui ne les ont pas faites. Toutes les citations directes sont verifiees aupres de l\'interlocuteur ou de son representant avant publication chaque fois que possible.',

    correctionsTitle: 'Politique de corrections',
    corrections1: 'Lorsque nous commettons une erreur factuelle, nous la corrigeons rapidement et de maniere transparente. Les corrections sont publiees sur l\'article original avec une note claire expliquant ce qui etait errone et quelle est l\'information correcte. Nous ne modifions pas silencieusement les articles apres publication.',
    corrections2: 'Les corrections significatives sont mentionnees en haut de l\'article. Les corrections mineures — telles que les fautes de frappe ou les problemes de formatage — peuvent etre effectuees sans avis de correction formel.',
    corrections3: 'Pour signaler une erreur, contactez-nous a',
    correctionsEmail: 'editorial@atlaskings.com',
    corrections4: 'Nous visons a accuser reception de chaque demande de correction sous 24 heures et a publier les corrections aussi rapidement que les faits le permettent.',

    sponsoredTitle: 'Contenu sponsorise',
    sponsored1: 'Tout contenu sponsorise, promu ou de marque sur Atlas Kings est clairement identifie avec une etiquette visible "Sponsorise" ou "Contenu partenaire". Le contenu sponsorise est produit separement de notre equipe editoriale et n\'influence en aucun cas notre couverture independante.',
    sponsored2: 'Nous nous reservons le droit de refuser tout contenu sponsorise qui entre en conflit avec nos valeurs editoriales ou qui pourrait induire nos lecteurs en erreur. Notre equipe editoriale a le dernier mot sur tout contenu publie sur le site.',

    socialTitle: 'Reseaux sociaux',
    social1: 'Nos comptes sur les reseaux sociaux sont geres par l\'equipe editoriale d\'Atlas Kings et refletent nos valeurs et standards editoriaux. Nous ne publions pas de rumeurs de transferts non verifiees sur les reseaux sociaux comme des informations confirmees. Nous appliquons les memes standards d\'exactitude, d\'equite et de verification sur les reseaux sociaux que sur notre site web.',
    social2: 'Le contenu genere par les utilisateurs partage par nos comptes ne constitue pas un soutien. Lorsque nous partageons des actualites de derniere minute sur les reseaux sociaux, nous mettons a jour nos publications si les informations changent ou s\'averent inexactes.',

    contactTitle: 'Contacter la redaction',
    contact1: 'Les plaintes editoriales, les informations, les corrections et les questions concernant notre journalisme peuvent etre adressees a',
    contact2: 'Nous accueillons les retours de nos lecteurs et prenons chaque demande au serieux.',
  },
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function EditorialPage() {
  const pathname = usePathname()
  const lang = pathname?.startsWith('/ar') ? 'ar' : pathname?.startsWith('/fr') ? 'fr' : 'en'
  const t = T[lang] ?? T.en
  const isRTL = lang === 'ar'

  const editorialEmail = (
    <a href={`mailto:${t.correctionsEmail}`} style={{ color: 'var(--red)', textDecoration: 'underline' }}>{t.correctionsEmail}</a>
  )

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <StaticPage title={t.title} subtitle={t.subtitle} accent="var(--navy)" lang={lang}>

        <Section title={t.independenceTitle}>
          <P>{t.independence1}</P>
          <P>{t.independence2}</P>
        </Section>

        <Section title={t.accuracyTitle}>
          <P>{t.accuracy1}</P>
          <P>{t.accuracy2}</P>
          <P>{t.accuracy3}</P>
        </Section>

        <Section title={t.sourcesTitle}>
          <P>{t.sources1}</P>
          <P>{t.sources2}</P>
          <P>{t.sources3}</P>
        </Section>

        <Section title={t.correctionsTitle}>
          <P>{t.corrections1}</P>
          <P>{t.corrections2}</P>
          <P>{t.corrections3}{' '}{editorialEmail}. {t.corrections4}</P>
        </Section>

        <Section title={t.sponsoredTitle}>
          <P>{t.sponsored1}</P>
          <P>{t.sponsored2}</P>
        </Section>

        <Section title={t.socialTitle}>
          <P>{t.social1}</P>
          <P>{t.social2}</P>
        </Section>

        <Section title={t.contactTitle}>
          <P>{t.contact1}{' '}{editorialEmail}.</P>
          <P>{t.contact2}</P>
        </Section>

      </StaticPage>
    </div>
  )
}
