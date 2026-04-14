'use client'

import { usePathname } from 'next/navigation'
import { StaticPage, Section, P } from '@/components/layout/StaticPage'

/* ------------------------------------------------------------------ */
/*  Trilingual content                                                 */
/* ------------------------------------------------------------------ */

const T = {
  en: {
    title: 'About Us',
    subtitle: 'Independent football journalism built for Morocco and the world.',

    introTitle: 'Who We Are',
    intro1: 'Atlas Kings is the home of Moroccan football. We are an independent football media platform built for fans in Morocco, the MENA region, and the global Moroccan diaspora who demanded better coverage of the game they love.',
    intro2: 'We cover everything from the Botola Pro and the Atlas Lions to the Premier League, La Liga, and the UEFA Champions League — the competitions Moroccan football fans follow most. With the 2030 FIFA World Cup coming to Morocco, we are building the destination site for a generation of fans who want world-class journalism in the languages they speak.',

    missionTitle: 'Our Mission',
    mission1: 'Football journalism in Arabic and French for the MENA region has long been dominated by aggregators and wire services offering little original insight. Atlas Kings was founded to change that — with original reporting, longform analysis, live scores, tactical breakdowns, and editorial opinions that fans can trust.',
    mission2: 'We are independent. We are not owned by a broadcaster, a club, or a federation. Our only obligation is to our readers. Every editorial decision we make is guided by one question: does this serve the fan?',

    coverTitle: 'What We Cover',
    cover1Title: 'Morocco & Atlas Lions',
    cover1Desc: 'Every squad announcement, match report, tactical breakdown, and World Cup qualifier. The national team covered with the depth and analysis it deserves.',
    cover2Title: 'Botola Pro',
    cover2Desc: 'Full coverage of Moroccan professional football — results, standings, top scorers, transfers, and the stories behind the league.',
    cover3Title: 'Champions League',
    cover3Desc: 'European nights featuring Moroccan players abroad — Hakimi, Mazraoui, Ounahi, and the next generation making their mark on the continental stage.',
    cover4Title: 'Premier League',
    cover4Desc: 'The most-watched league in Morocco, covered with the depth and context Moroccan fans demand.',
    cover5Title: 'World Cup 2030',
    cover5Desc: 'Dedicated coverage of the tournament Morocco will co-host — stadiums, tickets, volunteer programmes, city guides, news, and analysis.',
    cover6Title: 'Transfers',
    cover6Desc: 'Done deals, rumours, and the movement of Moroccan players across Europe and the world, verified before we publish.',

    teamTitle: 'Our Team',
    team1: 'Atlas Kings is run by a small, dedicated team of football journalists, analysts, and developers who are passionate about Moroccan football. Our editorial team combines years of experience in sports media with deep knowledge of the game at every level — from grassroots football in Morocco to the elite European leagues.',
    team2: 'We publish in English, Arabic, and French — because our audience spans Casablanca, Rabat, London, Paris, Amsterdam, Montreal, and beyond. Every story is crafted to feel native in whichever language you read it.',

    standardsTitle: 'Our Standards',
    standards1: 'We follow the highest standards of sports journalism. We verify before we publish. We correct when we are wrong. We label opinion as opinion and analysis as analysis. We never blur the line between reporting and commentary.',
    standards2: 'For more on how we work, read our',
    standardsLink: 'Editorial Guidelines',
  },

  ar: {
    title: 'من نحن',
    subtitle: 'صحافة كرة قدم مستقلة صُنعت للمغرب والعالم.',

    introTitle: 'من نحن',
    intro1: 'أطلس كينغز هو بيت كرة القدم المغربية. نحن منصة إعلامية رياضية مستقلة بُنيت لخدمة المشجعين في المغرب ومنطقة الشرق الأوسط وشمال إفريقيا والجالية المغربية حول العالم — المشجعين الذين طالبوا بتغطية أفضل للعبة التي يعشقونها.',
    intro2: 'نغطي كل شيء من البطولة الاحترافية ومنتخب أسود الأطلس إلى الدوري الإنجليزي الممتاز والدوري الإسباني ودوري أبطال أوروبا — المسابقات التي يتابعها المشجع المغربي أكثر من غيرها. ومع اقتراب كأس العالم 2030 الذي سيُقام في المغرب، نبني الوجهة الرقمية لجيل كامل من المشجعين الذين يريدون صحافة عالمية المستوى بلغاتهم.',

    missionTitle: 'رسالتنا',
    mission1: 'ظلت الصحافة الرياضية باللغتين العربية والفرنسية في منطقة الشرق الأوسط وشمال إفريقيا تحت هيمنة مواقع التجميع ووكالات الأنباء التي لا تقدم إلا القليل من المحتوى الأصيل. تأسس أطلس كينغز لتغيير هذا الواقع — من خلال التقارير الأصلية والتحليلات المعمقة والنتائج المباشرة والتحليلات التكتيكية والآراء التحريرية التي يثق بها المشجعون.',
    mission2: 'نحن مستقلون. لا نملكنا أي قناة تلفزيونية أو نادٍ أو اتحاد. التزامنا الوحيد هو تجاه قرائنا. كل قرار تحريري نتخذه يسترشد بسؤال واحد: هل يخدم هذا المشجع؟',

    coverTitle: 'ما نغطيه',
    cover1Title: 'المغرب وأسود الأطلس',
    cover1Desc: 'كل إعلان عن التشكيلة، وتقرير مباراة، وتحليل تكتيكي، وتصفيات كأس العالم. تغطية المنتخب الوطني بالعمق والتحليل الذي يستحقه.',
    cover2Title: 'البطولة الاحترافية',
    cover2Desc: 'تغطية شاملة لكرة القدم المغربية الاحترافية — النتائج والترتيب وهدافو البطولة والانتقالات والقصص وراء الكواليس.',
    cover3Title: 'دوري أبطال أوروبا',
    cover3Desc: 'الليالي الأوروبية التي يتألق فيها اللاعبون المغاربة في الخارج — حكيمي ومزراوي وأوناحي والجيل القادم الذي يصنع بصمته على الساحة القارية.',
    cover4Title: 'الدوري الإنجليزي الممتاز',
    cover4Desc: 'الدوري الأكثر مشاهدة في المغرب، بتغطية معمقة وسياق يلبي ما يطلبه المشجع المغربي.',
    cover5Title: 'كأس العالم 2030',
    cover5Desc: 'تغطية مخصصة للبطولة التي سيستضيفها المغرب — الملاعب والتذاكر وبرامج التطوع وأدلة المدن والأخبار والتحليلات.',
    cover6Title: 'الانتقالات',
    cover6Desc: 'الصفقات المُنجزة والشائعات وتنقلات اللاعبين المغاربة عبر أوروبا والعالم، مع التحقق قبل النشر.',

    teamTitle: 'فريقنا',
    team1: 'يدير أطلس كينغز فريق صغير ومتفانٍ من الصحفيين الرياضيين والمحللين والمطورين الشغوفين بكرة القدم المغربية. يجمع فريقنا التحريري بين سنوات من الخبرة في الإعلام الرياضي ومعرفة عميقة باللعبة على كل المستويات — من كرة القدم الشعبية في المغرب إلى الدوريات الأوروبية الكبرى.',
    team2: 'ننشر بالعربية والإنجليزية والفرنسية — لأن جمهورنا يمتد من الدار البيضاء والرباط إلى لندن وباريس وأمستردام ومونتريال وما بعدها. كل مقال يُصاغ ليبدو طبيعيًا بأي لغة تقرأه بها.',

    standardsTitle: 'معاييرنا',
    standards1: 'نلتزم بأعلى معايير الصحافة الرياضية. نتحقق قبل أن ننشر. نصحح عندما نخطئ. نميّز الرأي عن التقرير والتحليل عن الخبر. لا نطمس أبدًا الخط الفاصل بين التغطية الإخبارية والتعليق.',
    standards2: 'لمعرفة المزيد عن طريقة عملنا، اقرأ',
    standardsLink: 'إرشاداتنا التحريرية',
  },

  fr: {
    title: 'A propos',
    subtitle: 'Un journalisme football independant, construit pour le Maroc et le monde.',

    introTitle: 'Qui sommes-nous',
    intro1: 'Atlas Kings est la maison du football marocain. Nous sommes une plateforme mediatique independante dediee au football, concue pour les supporters au Maroc, dans la region MENA et au sein de la diaspora marocaine mondiale — des supporters qui exigeaient une couverture a la hauteur du jeu qu\'ils aiment.',
    intro2: 'Nous couvrons tout, de la Botola Pro et des Lions de l\'Atlas a la Premier League, la Liga et la Ligue des champions de l\'UEFA — les competitions que les supporters marocains suivent le plus. Avec la Coupe du monde 2030 qui arrivera au Maroc, nous construisons le site de reference pour toute une generation de supporters qui veulent un journalisme de classe mondiale dans les langues qu\'ils parlent.',

    missionTitle: 'Notre mission',
    mission1: 'Le journalisme sportif en arabe et en francais pour la region MENA a longtemps ete domine par des agregateurs et des agences de presse offrant peu de contenu original. Atlas Kings a ete fonde pour changer cela — avec des reportages originaux, des analyses approfondies, des scores en direct, des decryptages tactiques et des opinions editoriales auxquelles les supporters peuvent faire confiance.',
    mission2: 'Nous sommes independants. Nous n\'appartenons a aucun diffuseur, aucun club, aucune federation. Notre seule obligation est envers nos lecteurs. Chaque decision editoriale que nous prenons est guidee par une seule question : cela sert-il le supporter ?',

    coverTitle: 'Ce que nous couvrons',
    cover1Title: 'Maroc et Lions de l\'Atlas',
    cover1Desc: 'Chaque annonce de liste, rapport de match, analyse tactique et qualification pour la Coupe du monde. L\'equipe nationale couverte avec la profondeur et l\'analyse qu\'elle merite.',
    cover2Title: 'Botola Pro',
    cover2Desc: 'Couverture complete du football professionnel marocain — resultats, classements, meilleurs buteurs, transferts et les histoires derriere le championnat.',
    cover3Title: 'Ligue des champions',
    cover3Desc: 'Les soirees europeennes des joueurs marocains a l\'etranger — Hakimi, Mazraoui, Ounahi et la nouvelle generation qui marque de son empreinte la scene continentale.',
    cover4Title: 'Premier League',
    cover4Desc: 'Le championnat le plus regarde au Maroc, couvert avec la profondeur et le contexte que les supporters marocains exigent.',
    cover5Title: 'Coupe du monde 2030',
    cover5Desc: 'Couverture dediee au tournoi que le Maroc co-organisera — stades, billets, programmes de benevolat, guides des villes, actualites et analyses.',
    cover6Title: 'Transferts',
    cover6Desc: 'Transferts confirmes, rumeurs et mouvements des joueurs marocains a travers l\'Europe et le monde, verifies avant publication.',

    teamTitle: 'Notre equipe',
    team1: 'Atlas Kings est dirige par une petite equipe dediee de journalistes sportifs, d\'analystes et de developpeurs passionnes par le football marocain. Notre equipe editoriale combine des annees d\'experience dans les medias sportifs avec une connaissance approfondie du jeu a tous les niveaux — du football de base au Maroc aux ligues europeennes d\'elite.',
    team2: 'Nous publions en anglais, en arabe et en francais — parce que notre audience s\'etend de Casablanca et Rabat a Londres, Paris, Amsterdam, Montreal et au-dela. Chaque article est redige pour paraitre naturel dans la langue dans laquelle vous le lisez.',

    standardsTitle: 'Nos standards',
    standards1: 'Nous respectons les plus hauts standards du journalisme sportif. Nous verifions avant de publier. Nous corrigeons quand nous avons tort. Nous distinguons clairement l\'opinion de l\'analyse et l\'analyse du reportage. Nous ne brouillons jamais la frontiere entre information et commentaire.',
    standards2: 'Pour en savoir plus sur notre methode de travail, consultez nos',
    standardsLink: 'Directives editoriales',
  },
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  const pathname = usePathname()
  const lang = pathname?.startsWith('/ar') ? 'ar' : pathname?.startsWith('/fr') ? 'fr' : 'en'
  const t = T[lang] ?? T.en
  const isRTL = lang === 'ar'
  const editorialHref = lang === 'en' ? '/editorial' : '/' + lang + '/editorial'

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <StaticPage title={t.title} subtitle={t.subtitle} accent="var(--green)" lang={lang}>

        <Section title={t.introTitle}>
          <P>{t.intro1}</P>
          <P>{t.intro2}</P>
        </Section>

        <Section title={t.missionTitle}>
          <P>{t.mission1}</P>
          <P>{t.mission2}</P>
        </Section>

        <Section title={t.coverTitle}>
          {[
            [t.cover1Title, t.cover1Desc],
            [t.cover2Title, t.cover2Desc],
            [t.cover3Title, t.cover3Desc],
            [t.cover4Title, t.cover4Desc],
            [t.cover5Title, t.cover5Desc],
            [t.cover6Title, t.cover6Desc],
          ].map(([title, desc]) => (
            <div key={title as string} style={{ marginBottom: 16 }}>
              <strong style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: 4 }}>{title}</strong>
              <span>{desc}</span>
            </div>
          ))}
        </Section>

        <Section title={t.teamTitle}>
          <P>{t.team1}</P>
          <P>{t.team2}</P>
        </Section>

        <Section title={t.standardsTitle}>
          <P>{t.standards1}</P>
          <P>{t.standards2}{' '}<a href={editorialHref} style={{ color: 'var(--red)', textDecoration: 'underline' }}>{t.standardsLink}</a>.</P>
        </Section>

      </StaticPage>
    </div>
  )
}
