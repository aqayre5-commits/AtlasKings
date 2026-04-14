import type { Lang } from './config'

export interface Translations {
  nav: {
    home: string
    morocco: string
    botolaP: string
    premierLeague: string
    laLiga: string
    ucl: string
    transfers: string
    wc2030: string
    wc2026: string
    worldCup: string
    scores: string
    fixtures: string
    standings: string
    search: string
  }
  subnav: {
    home: string
    atlasLions: string
    squad: string
    fixtures: string
    results: string
    scores: string
    table: string
    topScorers: string
    teams: string
    groups: string
    knockout: string
    latest: string
    doneDeals: string
    stadiums: string
    tickets: string
    statistics: string
    cities: string
    construction: string
    travelGuide: string
    overview: string
    fixturesResults: string
    playerStats: string
    bracket: string
  }
  sections: {
    topHeadlines: string
    moroccoFocus: string
    analysisOpinion: string
    worldCup2030: string
    allBotola: string
    allUCL: string
    allPL: string
    allTransfers: string
    allWC: string
    allMorocco: string
    allAnalysis: string
    allScores: string
    allFixtures: string
    allStandings: string
    latestResults: string
    scoresAndFixtures: string
    latestNews: string
    recentResults: string
    upcomingFixtures: string
    moreNews: string
    standings: string
    squad: string
    quickInfo: string
    fifaRanking: string
    captain: string
    coach: string
    group: string
    allMatches: string
    todaysMatches: string
    live: string
    fullTable: string
    topStories: string
    news: string
    keyPlayers: string
    wcSquad: string
    qualification: string
    popularTags: string
    filterAll: string
    filterMatches: string
    filterSquad: string
    filterInjuries: string
    filterQualifiers: string
    filterFederation: string
    matchEvents: string
    lineups: string
    playerRatings: string
    substitutes: string
    featuredStar: string
    stars: string
    fullSquad: string
    playerNews: string
    doneDeals: string
    rumoursTargets: string
    afconQualifiers: string
    wc2026Label: string
    // World Cup section headers + bracket stage labels
    allGroups: string
    liveNow: string
    moroccoFixtures: string
    stageGroup: string
    stageR32: string
    stageR16: string
    stageQF: string
    stageSF: string
    stageBronze: string
    stageFinal: string
  }
  ui: {
    pageNotFound: string
    readMore: string
    allArticles: string
    moreToRead: string
    upNext: string
    advertisement: string
    comingSoon: string
    backToHome: string
    share: string
    tags: string
    loadingStandings: string
    read: string
    readingTime: string
    readingTimeSingular: string
    timeAgo: {
      justNow: string
      minutesAgo: string
      hoursAgo: string
      yesterday: string
    }
    filter: {
      all: string
      live: string
      finished: string
      upcoming: string
    }
    match: {
      fullTime: string
      halfTime: string
      kicksOffIn: string
      days: string
      hours: string
      mins: string
      secs: string
      vs: string
      venue: string
      referee: string
      quarterFinal: string
      semiFinal: string
      final: string
      roundOf16: string
      groupStage: string
      leg1: string
      leg2: string
    }
    standings: {
      title: string
      pos: string
      club: string
      played: string
      won: string
      drawn: string
      lost: string
      gd: string
      points: string
      form: string
    }
    player: {
      goals: string
      assists: string
      appearances: string
      minutes: string
      rating: string
      position: string
      nationality: string
      age: string
      height: string
      weight: string
    }
    footer: {
      tagline: string
      coverage: string
      about: string
      aboutUs: string
      editorial: string
      contact: string
      advertise: string
      privacy: string
      terms: string
      cookies: string
      rights: string
    }
    search: {
      placeholder: string
      results: string
      noResults: string
      typeToSearch: string
    }
  }
  simulator: {
    // Shell
    loading: string
    continueBestThird: string
    continueKnockout: string
    // Controls
    controls: {
      groups: string
      bestThird: string
      knockout: string
      undo: string
      redo: string
      reset: string
      share: string
    }
    // Monte Carlo
    mc: {
      title: string
      subtitle: string
      iterations: string
      simulateGroups: string
      simulateKnockout: string
      running: string
      lockedUntilGroups: string
      footnote: string
    }
    // Groups panel
    groups: {
      predicted: string
      simulateGroup: string
      clearGroup: string
      standings: string
      teamsAdvance: string
      headers: { pos: string; team: string; p: string; w: string; d: string; l: string; gd: string; pts: string }
      qualified: string
      moroccoFlag: string
    }
    // Bracket
    bracket: {
      title: string
      championTitle: string
      awaiting: string
      final: string
      bronze: string
      r32: string
      r16: string
      qf: string
      sf: string
      pens: string
      zoomIn: string
      zoomOut: string
      fit: string
      shareBracket: string
      printBracket: string
      linkCopied: string
      locked: string
      lockedDesc: string
    }
    // Best third panel
    bestThird: {
      title: string
      topAdvance: string
      emptyState: string
      headers: { pos: string; team: string; group: string; pts: string; gd: string; gf: string; status: string }
      advances: string
      eliminated: string
    }
  }
}

const en: Translations = {
  nav: {
    home: 'Home', morocco: 'Morocco', botolaP: 'Botola Pro',
    premierLeague: 'Premier League', laLiga: 'La Liga', ucl: 'UCL',
    transfers: 'Transfers', wc2030: 'WC 2030', wc2026: 'WC 2026',
    worldCup: 'World Cup',
    scores: 'Scores', fixtures: 'Fixtures', standings: 'Standings', search: 'Search',
  },
  subnav: {
    home: 'Home', atlasLions: 'Atlas Lions', squad: 'Squad',
    fixtures: 'Fixtures', results: 'Results', scores: 'Scores',
    table: 'Table', topScorers: 'Top Scorers', teams: 'Teams',
    groups: 'Groups', knockout: 'Knockout', latest: 'Latest',
    doneDeals: 'Done Deals', stadiums: 'Stadiums', tickets: 'Tickets',
    statistics: 'Statistics', cities: 'Cities', construction: 'Construction', travelGuide: 'Travel Guide',
    overview: 'Overview', fixturesResults: 'Fixtures & Results', playerStats: 'Player Stats', bracket: 'Bracket',
  },
  sections: {
    topHeadlines: 'Top Headlines',
    moroccoFocus: 'Morocco Focus',
    analysisOpinion: 'Analysis & Opinion',
    worldCup2030: 'World Cup 2030',
    allBotola: 'All Botola →',
    allUCL: 'All UCL →',
    allPL: 'All PL →',
    allTransfers: 'All Transfers →',
    allWC: 'All WC 2026 →',
    allMorocco: 'All Morocco →',
    allAnalysis: 'All Analysis →',
    allScores: 'All scores ›',
    allFixtures: 'All Fixtures →',
    allStandings: 'Full Table →',
    latestResults: 'Latest Results',
    scoresAndFixtures: 'Scores & Fixtures',
    latestNews: 'Latest News',
    recentResults: 'Recent Results',
    upcomingFixtures: 'Upcoming Fixtures',
    moreNews: 'More News',
    standings: 'Standings',
    squad: 'Squad',
    quickInfo: 'Quick Info',
    fifaRanking: 'FIFA Ranking',
    captain: 'Captain',
    coach: 'Coach',
    group: 'Group',
    allMatches: 'All matches',
    todaysMatches: "Today's Matches",
    live: 'Live',
    fullTable: 'Full table',
    topStories: 'Top Stories',
    news: 'News',
    keyPlayers: 'Key Players',
    wcSquad: 'WC 2026 Squad',
    qualification: 'Qualification',
    popularTags: 'Popular Tags',
    filterAll: 'All',
    filterMatches: 'Matches',
    filterSquad: 'Squad',
    filterInjuries: 'Injuries',
    filterQualifiers: 'Qualifiers',
    filterFederation: 'Federation',
    matchEvents: 'Match Events',
    lineups: 'Lineups',
    playerRatings: 'Player Ratings',
    substitutes: 'Substitutes',
    featuredStar: 'Featured Star',
    stars: 'Stars',
    fullSquad: 'Full Squad',
    playerNews: 'Player News',
    doneDeals: 'Done Deals',
    rumoursTargets: 'Rumours & Targets',
    afconQualifiers: 'AFCON Qualifiers',
    wc2026Label: 'WC 2026',
    // World Cup shared copy
    allGroups: 'All Groups',
    liveNow: 'Live Now',
    moroccoFixtures: "Morocco's Fixtures",
    stageGroup: 'Group Stage',
    stageR32: 'Round of 32',
    stageR16: 'Round of 16',
    stageQF: 'Quarter-Finals',
    stageSF: 'Semi-Finals',
    stageBronze: 'Third Place',
    stageFinal: 'Final',
  },
  ui: {
    pageNotFound: 'Page Not Found',
    readMore: 'Read more',
    allArticles: 'All articles',
    moreToRead: 'More to Read',
    upNext: 'Up Next',
    advertisement: 'Advertisement',
    comingSoon: 'Coming Soon',
    backToHome: '← Back to Home',
    share: 'Share',
    tags: 'Tags',
    loadingStandings: 'Loading standings…',
    read: 'Read',
    readingTime: '{n} min read',
    readingTimeSingular: '1 min read',
    timeAgo: { justNow: 'Just now', minutesAgo: '{n}m ago', hoursAgo: '{n}h ago', yesterday: 'Yesterday' },
    filter: { all: 'All', live: 'Live', finished: 'Finished', upcoming: 'Upcoming' },
    match: {
      fullTime: 'FT', halfTime: 'HT', kicksOffIn: 'Kicks off in',
      days: 'days', hours: 'hrs', mins: 'min', secs: 'sec',
      vs: 'vs', venue: 'Venue', referee: 'Referee',
      quarterFinal: 'Quarter-Final', semiFinal: 'Semi-Final',
      final: 'Final', roundOf16: 'Round of 16',
      groupStage: 'Group Stage', leg1: '1st Leg', leg2: '2nd Leg',
    },
    standings: {
      title: 'Standings', pos: '#', club: 'Club',
      played: 'P', won: 'W', drawn: 'D', lost: 'L',
      gd: 'GD', points: 'Pts', form: 'Form',
    },
    player: {
      goals: 'Goals', assists: 'Assists', appearances: 'Appearances',
      minutes: 'Minutes', rating: 'Rating', position: 'Position',
      nationality: 'Nationality', age: 'Age', height: 'Height', weight: 'Weight',
    },
    footer: {
      tagline: 'The Home of Moroccan Football.',
      coverage: 'Coverage', about: 'About', aboutUs: 'About Us',
      editorial: 'Editorial Guidelines', contact: 'Contact', advertise: 'Advertise',
      privacy: 'Privacy Policy', terms: 'Terms of Service',
      cookies: 'Cookie Settings', rights: '© 2026 Atlas Kings. All rights reserved.',
    },
    search: {
      placeholder: 'Search players, teams…',
      results: '{n} results for "{q}"',
      noResults: 'No results for "{q}"',
      typeToSearch: 'Type to search articles, players and teams',
    },
  },
  simulator: {
    loading: 'Loading simulator…',
    continueBestThird: 'Continue to Best Third-Placed Teams',
    continueKnockout: 'Continue to Knockout Stage',
    controls: {
      groups: 'Groups', bestThird: 'Best 3rd', knockout: 'Knockout',
      undo: 'Undo', redo: 'Redo', reset: 'Reset', share: 'Share',
    },
    mc: {
      title: 'Monte Carlo',
      subtitle: 'WC 2022 · Euro 2024 · Copa 2024 · AFCON 2023/25 · Asian 2023 · Gold Cup 2023/25 · OFC 2024 + FIFA + qualifying',
      iterations: 'Iterations',
      simulateGroups: 'Simulate groups',
      simulateKnockout: 'Simulate knockout',
      running: 'Simulating…',
      lockedUntilGroups: 'Complete the group stage first to unlock the knockout simulation.',
      footnote: 'Team strength blends: (1) stage results at every major tournament from WC 2022 onwards — WC 2022, Euro 2024, Copa 2024, AFCON 2023/2025, Asian Cup 2023, Gold Cup 2023/2025, OFC 2024; (2) WC 2026 qualifying pathway with a confederation difficulty multiplier (CONMEBOL 1.0 → OFC 0.45); (3) a ±40 elo stabiliser from current FIFA ranking points; (4) host-nation boost (USA +35, MEX +25, CAN +25). Home advantage only applies to matches played in a host country. Locked group scores stay fixed. ⚠ = estimated result.',
    },
    groups: {
      predicted: 'predicted',
      simulateGroup: 'Simulate group',
      clearGroup: 'Clear',
      standings: 'Standings',
      teamsAdvance: 'Top 2 advance · Best 3rd qualifies for Round of 32',
      headers: { pos: '#', team: 'Team', p: 'P', w: 'W', d: 'D', l: 'L', gd: 'GD', pts: 'Pts' },
      qualified: 'Q',
      moroccoFlag: "MOROCCO'S GROUP",
    },
    bracket: {
      title: 'FIFA World Cup 2026',
      championTitle: 'Champion',
      awaiting: 'Complete the bracket to crown a champion',
      final: 'Final',
      bronze: 'Bronze final',
      r32: 'Round of 32',
      r16: 'Round of 16',
      qf: 'Quarter-finals',
      sf: 'Semi-finals',
      pens: 'PEN',
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
      fit: 'Fit',
      shareBracket: 'Share your bracket',
      printBracket: 'Print bracket',
      linkCopied: 'Link copied!',
      locked: 'Locked',
      lockedDesc: 'Complete the group-stage results first — manually or via Monte Carlo — to unlock the knockout bracket.',
    },
    bestThird: {
      title: 'Best Third-Placed Teams',
      topAdvance: 'Top 8 advance',
      emptyState: 'Complete all group stage matches to see the best third-placed teams.',
      headers: { pos: '#', team: 'Team', group: 'Group', pts: 'Pts', gd: 'GD', gf: 'GF', status: 'Status' },
      advances: 'Advances',
      eliminated: 'Eliminated',
    },
  },
}

const ar: Translations = {
  nav: {
    home: 'الرئيسية',
    morocco: 'المغرب',
    botolaP: 'البطولة المحترفة',
    premierLeague: 'الدوري الإنجليزي',
    laLiga: 'الليغا',
    ucl: 'دوري الأبطال',
    transfers: 'الانتقالات',
    wc2030: 'مونديال 2030',
    wc2026: 'مونديال 2026',
    worldCup: 'كأس العالم',
    scores: 'النتائج',
    fixtures: 'المباريات',
    standings: 'الترتيب',
    search: 'بحث',
  },
  subnav: {
    home: 'الرئيسية',
    atlasLions: 'أسود الأطلس',
    squad: 'التشكيلة',
    fixtures: 'المباريات',
    results: 'النتائج',
    scores: 'النتائج',
    table: 'الترتيب',
    topScorers: 'هدافو الدوري',
    teams: 'الفرق',
    groups: 'المجموعات',
    knockout: 'الأدوار الإقصائية',
    latest: 'آخر الأخبار',
    doneDeals: 'صفقات مكتملة',
    stadiums: 'الملاعب',
    tickets: 'التذاكر',
    statistics: 'الإحصاءات',
    cities: 'المدن', construction: 'البناء', travelGuide: 'دليل السفر',
    overview: 'نظرة عامة', fixturesResults: 'المباريات والنتائج', playerStats: 'إحصاءات اللاعبين', bracket: 'شجرة البطولة',
  },
  sections: {
    topHeadlines: 'أبرز الأخبار',
    moroccoFocus: 'المغرب',
    analysisOpinion: 'تحليل ورأي',
    worldCup2030: 'كأس العالم 2030',
    allBotola: 'كل أخبار البطولة ←',
    allUCL: 'كل أخبار الأبطال ←',
    allPL: 'كل أخبار الإنجليزي ←',
    allTransfers: 'كل الانتقالات ←',
    allWC: 'كل أخبار المونديال ←',
    allMorocco: 'كل أخبار المغرب ←',
    allAnalysis: 'كل التحليلات ←',
    allScores: 'كل النتائج ←',
    allFixtures: 'كل المباريات ←',
    allStandings: 'الجدول كاملاً ←',
    latestResults: 'آخر النتائج',
    scoresAndFixtures: 'النتائج والمباريات',
    latestNews: 'آخر الأخبار',
    recentResults: 'أحدث النتائج',
    upcomingFixtures: 'المباريات القادمة',
    moreNews: 'المزيد من الأخبار',
    standings: 'الترتيب',
    squad: 'التشكيلة',
    quickInfo: 'معلومات سريعة',
    fifaRanking: 'تصنيف الفيفا',
    captain: 'القائد',
    coach: 'المدرب',
    group: 'المجموعة',
    allMatches: 'جميع المباريات',
    todaysMatches: 'مباريات اليوم',
    live: 'مباشر',
    fullTable: 'الجدول كاملاً',
    topStories: 'أهم الأخبار',
    news: 'الأخبار',
    keyPlayers: 'اللاعبون الرئيسيون',
    wcSquad: 'تشكيلة مونديال 2026',
    qualification: 'التأهل',
    popularTags: 'وسوم شائعة',
    filterAll: 'الكل',
    filterMatches: 'المباريات',
    filterSquad: 'التشكيلة',
    filterInjuries: 'الإصابات',
    filterQualifiers: 'التصفيات',
    filterFederation: 'الاتحاد',
    matchEvents: 'أحداث المباراة',
    lineups: 'التشكيلة',
    playerRatings: 'تقييم اللاعبين',
    substitutes: 'البدلاء',
    featuredStar: 'النجم المميز',
    stars: 'النجوم',
    fullSquad: 'التشكيلة الكاملة',
    playerNews: 'أخبار اللاعبين',
    doneDeals: 'صفقات مكتملة',
    rumoursTargets: 'شائعات وأهداف',
    afconQualifiers: 'تصفيات كأس أفريقيا',
    wc2026Label: 'مونديال 2026',
    // World Cup shared copy
    allGroups: 'كل المجموعات',
    liveNow: 'مباشر الآن',
    moroccoFixtures: 'مباريات المغرب',
    stageGroup: 'دور المجموعات',
    stageR32: 'دور الـ32',
    stageR16: 'دور الـ16',
    stageQF: 'ربع النهائي',
    stageSF: 'نصف النهائي',
    stageBronze: 'المركز الثالث',
    stageFinal: 'النهائي',
  },
  ui: {
    pageNotFound: 'الصفحة غير موجودة',
    readMore: 'اقرأ المزيد',
    allArticles: 'جميع المقالات',
    moreToRead: 'المزيد للقراءة',
    upNext: 'التالي',
    advertisement: 'إعلان',
    comingSoon: 'قريباً',
    backToHome: '→ العودة للرئيسية',
    share: 'مشاركة',
    tags: 'وسوم',
    loadingStandings: 'جاري تحميل الترتيب…',
    read: 'اقرأ',
    readingTime: '{n} دقائق للقراءة',
    readingTimeSingular: 'دقيقة واحدة للقراءة',
    timeAgo: {
      justNow: 'الآن',
      minutesAgo: 'منذ {n} دقيقة',
      hoursAgo: 'منذ {n} ساعة',
      yesterday: 'أمس',
    },
    filter: {
      all: 'الكل',
      live: 'مباشر',
      finished: 'مكتملة',
      upcoming: 'قادمة',
    },
    match: {
      fullTime: 'نهاية',
      halfTime: 'استراحة',
      kicksOffIn: 'ينطلق خلال',
      days: 'أيام',
      hours: 'ساعات',
      mins: 'دقائق',
      secs: 'ثواني',
      vs: 'ضد',
      venue: 'الملعب',
      referee: 'الحكم',
      quarterFinal: 'ربع النهائي',
      semiFinal: 'نصف النهائي',
      final: 'النهائي',
      roundOf16: 'دور الـ16',
      groupStage: 'دور المجموعات',
      leg1: 'ذهاب',
      leg2: 'إياب',
    },
    standings: {
      title: 'الترتيب',
      pos: '#',
      club: 'الفريق',
      played: 'ل',
      won: 'ف',
      drawn: 'ت',
      lost: 'خ',
      gd: 'فارق',
      points: 'نقاط',
      form: 'الشكل',
    },
    player: {
      goals: 'أهداف',
      assists: 'تمريرات حاسمة',
      appearances: 'مباريات',
      minutes: 'دقائق',
      rating: 'التقييم',
      position: 'المركز',
      nationality: 'الجنسية',
      age: 'العمر',
      height: 'الطول',
      weight: 'الوزن',
    },
    footer: {
      tagline: 'موطن كرة القدم المغربية.',
      coverage: 'تغطياتنا',
      about: 'حول الموقع',
      aboutUs: 'من نحن',
      editorial: 'المبادئ التحريرية',
      contact: 'تواصل معنا',
      advertise: 'الإعلان',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الاستخدام',
      cookies: 'إعدادات الكوكيز',
      rights: '© 2026 أطلس كينغز. جميع الحقوق محفوظة.',
    },
    search: {
      placeholder: 'ابحث عن لاعبين وفرق…',
      results: '{n} نتائج لـ "{q}"',
      noResults: 'لا نتائج لـ "{q}"',
      typeToSearch: 'اكتب للبحث عن مقالات ولاعبين وفرق',
    },
  },
  simulator: {
    loading: 'جارٍ تحميل المحاكي…',
    continueBestThird: 'المتابعة إلى أفضل الثوالث',
    continueKnockout: 'المتابعة إلى الأدوار الإقصائية',
    controls: {
      groups: 'المجموعات', bestThird: 'أفضل ثوالث', knockout: 'الإقصائيات',
      undo: 'تراجع', redo: 'إعادة', reset: 'إعادة تعيين', share: 'مشاركة',
    },
    mc: {
      title: 'مونت كارلو',
      subtitle: 'مونديال 2022 · يورو · كوبا · كان · آسيا · الذهبية · أوقيانوسيا + فيفا + التصفيات',
      iterations: 'التكرارات',
      simulateGroups: 'محاكاة المجموعات',
      simulateKnockout: 'محاكاة الإقصائيات',
      running: 'جارٍ المحاكاة…',
      lockedUntilGroups: 'أكمل دور المجموعات أولاً لفتح محاكاة الأدوار الإقصائية.',
      footnote: 'قوة المنتخب تجمع: (1) نتائج كل البطولات الكبرى من مونديال 2022 فصاعداً — مونديال 2022، يورو 2024، كوبا 2024، أمم أفريقيا 2023/2025، آسيا 2023، الكأس الذهبية 2023/2025، أوقيانوسيا 2024؛ (2) مسار تصفيات مونديال 2026 مع معامل صعوبة الاتحاد القاري (كونميبول 1.0 → أوقيانوسيا 0.45)؛ (3) تعديل ±40 من نقاط تصنيف فيفا الحالية؛ (4) منحة الاستضافة (الولايات المتحدة +35، المكسيك +25، كندا +25). ميزة أرض الملعب تُطبَّق فقط على المباريات المقامة في بلد مضيف. النتائج المثبّتة تبقى كما هي. ⚠ = نتيجة تقديرية.',
    },
    groups: {
      predicted: 'متوقعة',
      simulateGroup: 'محاكاة المجموعة',
      clearGroup: 'مسح',
      standings: 'الترتيب',
      teamsAdvance: 'أول منتخبين يتأهلان · أفضل ثالث يبلغ دور الـ32',
      headers: { pos: '#', team: 'الفريق', p: 'لعب', w: 'ف', d: 'ت', l: 'خ', gd: 'فارق', pts: 'نقاط' },
      qualified: 'مؤهل',
      moroccoFlag: 'مجموعة المغرب',
    },
    bracket: {
      title: 'كأس العالم فيفا 2026',
      championTitle: 'البطل',
      awaiting: 'أكمل البطولة لتتويج البطل',
      final: 'النهائي',
      bronze: 'مباراة البرونزية',
      r32: 'دور الـ32',
      r16: 'دور الـ16',
      qf: 'ربع النهائي',
      sf: 'نصف النهائي',
      pens: 'ركلات',
      zoomIn: 'تكبير',
      zoomOut: 'تصغير',
      fit: 'ملائم',
      shareBracket: 'مشاركة التوقعات',
      printBracket: 'طباعة التوقعات',
      linkCopied: 'تم النسخ!',
      locked: 'مقفل',
      lockedDesc: 'أكمل نتائج المجموعات أولاً — يدوياً أو عبر محاكاة مونت كارلو — لفتح الأدوار الإقصائية.',
    },
    bestThird: {
      title: 'أفضل الفرق الثالثة',
      topAdvance: 'أفضل 8 يتأهلون',
      emptyState: 'أكمل جميع مباريات دور المجموعات لرؤية أفضل الثوالث.',
      headers: { pos: '#', team: 'الفريق', group: 'المجموعة', pts: 'نقاط', gd: 'فارق', gf: 'أهداف', status: 'الحالة' },
      advances: 'يتأهل',
      eliminated: 'يُقصى',
    },
  },
}

const fr: Translations = {
  nav: {
    home: 'Accueil',
    morocco: 'Maroc',
    botolaP: 'Botola Pro',
    premierLeague: 'Premier League',
    laLiga: 'La Liga',
    ucl: 'Ligue des Champions',
    transfers: 'Transferts',
    wc2030: 'CM 2030',
    wc2026: 'CM 2026',
    worldCup: 'Coupe du Monde',
    scores: 'Scores',
    fixtures: 'Calendrier',
    standings: 'Classement',
    search: 'Recherche',
  },
  subnav: {
    home: 'Accueil',
    atlasLions: 'Lions de l\'Atlas',
    squad: 'Effectif',
    fixtures: 'Calendrier',
    results: 'Résultats',
    scores: 'Scores',
    table: 'Classement',
    topScorers: 'Meilleurs buteurs',
    teams: 'Équipes',
    groups: 'Groupes',
    knockout: 'Phase éliminatoire',
    latest: 'Dernières infos',
    doneDeals: 'Transferts conclus',
    stadiums: 'Stades',
    tickets: 'Billets',
    statistics: 'Statistiques',
    cities: 'Villes hôtes', construction: 'Construction', travelGuide: 'Guide de voyage',
    overview: 'Aperçu', fixturesResults: 'Résultats & Calendrier', playerStats: 'Statistiques joueurs', bracket: 'Tableau',
  },
  sections: {
    topHeadlines: 'À la une',
    moroccoFocus: 'Focus Maroc',
    analysisOpinion: 'Analyse & Opinion',
    worldCup2030: 'Coupe du Monde 2030',
    allBotola: 'Toute la Botola →',
    allUCL: 'Toute la LDC →',
    allPL: 'Toute la PL →',
    allTransfers: 'Tous les transferts →',
    allWC: 'Tout sur le CM →',
    allMorocco: 'Tout sur le Maroc →',
    allAnalysis: 'Toutes les analyses →',
    allScores: 'Tous les scores ›',
    allFixtures: 'Tout le calendrier →',
    allStandings: 'Classement complet →',
    latestResults: 'Derniers résultats',
    scoresAndFixtures: 'Scores & Calendrier',
    latestNews: 'Dernières nouvelles',
    recentResults: 'Résultats récents',
    upcomingFixtures: 'Prochains matchs',
    moreNews: 'Plus de nouvelles',
    standings: 'Classement',
    squad: 'Effectif',
    quickInfo: 'Infos rapides',
    fifaRanking: 'Classement FIFA',
    captain: 'Capitaine',
    coach: 'Entraîneur',
    group: 'Groupe',
    allMatches: 'Tous les matchs',
    todaysMatches: 'Matchs du jour',
    live: 'En direct',
    fullTable: 'Classement complet',
    topStories: 'À la une',
    news: 'Actualités',
    keyPlayers: 'Joueurs clés',
    qualification: 'Qualification',
    wcSquad: 'Effectif CM 2026',
    popularTags: 'Tags populaires',
    filterAll: 'Tous',
    filterMatches: 'Matchs',
    filterSquad: 'Effectif',
    filterInjuries: 'Blessures',
    filterQualifiers: 'Qualifications',
    filterFederation: 'Fédération',
    matchEvents: 'Événements du match',
    lineups: 'Compositions',
    playerRatings: 'Notes des joueurs',
    substitutes: 'Remplaçants',
    featuredStar: 'Joueur vedette',
    stars: 'Stars',
    fullSquad: 'Effectif complet',
    playerNews: 'Actualités joueurs',
    doneDeals: 'Transferts conclus',
    rumoursTargets: 'Rumeurs & Cibles',
    afconQualifiers: 'Qualifications CAN',
    wc2026Label: 'CM 2026',
    // World Cup shared copy
    allGroups: 'Tous les groupes',
    liveNow: 'En direct',
    moroccoFixtures: 'Matchs du Maroc',
    stageGroup: 'Phase de groupes',
    stageR32: '16ᵉ de finale',
    stageR16: '8ᵉ de finale',
    stageQF: 'Quarts',
    stageSF: 'Demi-finales',
    stageBronze: '3ᵉ place',
    stageFinal: 'Finale',
  },
  ui: {
    pageNotFound: 'Page introuvable',
    readMore: 'Lire la suite',
    allArticles: 'Tous les articles',
    moreToRead: 'À lire aussi',
    upNext: 'Suivant',
    advertisement: 'Publicité',
    comingSoon: 'Bientôt disponible',
    backToHome: '← Retour à l\'accueil',
    share: 'Partager',
    tags: 'Tags',
    loadingStandings: 'Chargement du classement…',
    read: 'Lire',
    readingTime: '{n} min de lecture',
    readingTimeSingular: '1 min de lecture',
    timeAgo: {
      justNow: 'À l\'instant',
      minutesAgo: 'Il y a {n} min',
      hoursAgo: 'Il y a {n}h',
      yesterday: 'Hier',
    },
    filter: {
      all: 'Tous',
      live: 'En direct',
      finished: 'Terminés',
      upcoming: 'À venir',
    },
    match: {
      fullTime: 'FT',
      halfTime: 'MT',
      kicksOffIn: 'Coup d\'envoi dans',
      days: 'j',
      hours: 'h',
      mins: 'min',
      secs: 's',
      vs: 'vs',
      venue: 'Stade',
      referee: 'Arbitre',
      quarterFinal: 'Quart de finale',
      semiFinal: 'Demi-finale',
      final: 'Finale',
      roundOf16: 'Huitièmes',
      groupStage: 'Phase de groupes',
      leg1: 'Aller',
      leg2: 'Retour',
    },
    standings: {
      title: 'Classement',
      pos: '#',
      club: 'Club',
      played: 'J',
      won: 'G',
      drawn: 'N',
      lost: 'D',
      gd: 'DB',
      points: 'Pts',
      form: 'Forme',
    },
    player: {
      goals: 'Buts',
      assists: 'Passes décisives',
      appearances: 'Matchs joués',
      minutes: 'Minutes',
      rating: 'Note',
      position: 'Poste',
      nationality: 'Nationalité',
      age: 'Âge',
      height: 'Taille',
      weight: 'Poids',
    },
    footer: {
      tagline: 'Le temple du football marocain.',
      coverage: 'Nos rubriques',
      about: 'À propos',
      aboutUs: 'Qui sommes-nous',
      editorial: 'Charte éditoriale',
      contact: 'Contact',
      advertise: 'Publicité',
      privacy: 'Politique de confidentialité',
      terms: 'Conditions d\'utilisation',
      cookies: 'Paramètres cookies',
      rights: '© 2026 Atlas Kings. Tous droits réservés.',
    },
    search: {
      placeholder: 'Rechercher joueurs, équipes…',
      results: '{n} résultats pour « {q} »',
      noResults: 'Aucun résultat pour « {q} »',
      typeToSearch: 'Tapez pour rechercher articles, joueurs et équipes',
    },
  },
  simulator: {
    loading: 'Chargement du simulateur…',
    continueBestThird: 'Continuer vers les meilleurs 3ᵉ',
    continueKnockout: 'Continuer vers les phases finales',
    controls: {
      groups: 'Groupes', bestThird: 'Meilleurs 3ᵉ', knockout: 'Éliminatoires',
      undo: 'Annuler', redo: 'Rétablir', reset: 'Réinitialiser', share: 'Partager',
    },
    mc: {
      title: 'Monte Carlo',
      subtitle: 'CM 2022 · Euro · Copa · CAN · Asie · Gold Cup · OFC + FIFA + éliminatoires',
      iterations: 'Itérations',
      simulateGroups: 'Simuler les groupes',
      simulateKnockout: 'Simuler les finales',
      running: 'Simulation…',
      lockedUntilGroups: 'Terminez la phase de groupes pour débloquer la simulation des phases finales.',
      footnote: "La force des équipes combine : (1) les résultats à chaque compétition majeure depuis la CM 2022 — CM 2022, Euro 2024, Copa 2024, CAN 2023/2025, Coupe d'Asie 2023, Gold Cup 2023/2025, OFC 2024 ; (2) le parcours de qualification CM 2026 avec un multiplicateur de difficulté par confédération (CONMEBOL 1,0 → OFC 0,45) ; (3) un ajustement ±40 issu des points FIFA actuels ; (4) un bonus pays hôte (USA +35, MEX +25, CAN +25). L'avantage du terrain ne s'applique qu'aux matchs joués dans un pays hôte. Les scores verrouillés restent inchangés. ⚠ = résultat estimé.",
    },
    groups: {
      predicted: 'pronostiqués',
      simulateGroup: 'Simuler le groupe',
      clearGroup: 'Effacer',
      standings: 'Classement',
      teamsAdvance: 'Les 2 premiers qualifiés · Meilleur 3ᵉ pour les 16ᵉ',
      headers: { pos: '#', team: 'Équipe', p: 'J', w: 'V', d: 'N', l: 'D', gd: 'DB', pts: 'Pts' },
      qualified: 'Q',
      moroccoFlag: 'GROUPE DU MAROC',
    },
    bracket: {
      title: 'Coupe du Monde FIFA 2026',
      championTitle: 'Champion',
      awaiting: 'Complétez le tableau pour couronner le champion',
      final: 'Finale',
      bronze: 'Match pour la 3ᵉ place',
      r32: '16ᵉ de finale',
      r16: '8ᵉ de finale',
      qf: 'Quarts',
      sf: 'Demi-finales',
      pens: 'TAB',
      zoomIn: 'Agrandir',
      zoomOut: 'Réduire',
      fit: 'Ajuster',
      shareBracket: 'Partager vos pronostics',
      printBracket: 'Imprimer le tableau',
      linkCopied: 'Lien copié !',
      locked: 'Verrouillé',
      lockedDesc: "Complétez d'abord les résultats des groupes — manuellement ou via Monte Carlo — pour débloquer les phases finales.",
    },
    bestThird: {
      title: 'Meilleurs troisièmes',
      topAdvance: 'Les 8 meilleurs se qualifient',
      emptyState: 'Complétez tous les matchs de groupes pour voir les meilleurs troisièmes.',
      headers: { pos: '#', team: 'Équipe', group: 'Groupe', pts: 'Pts', gd: 'DB', gf: 'BM', status: 'Statut' },
      advances: 'Qualifié',
      eliminated: 'Éliminé',
    },
  },
}

export const TRANSLATIONS: Record<Lang, Translations> = { en, ar, fr }

export function getTranslations(lang: Lang): Translations {
  return TRANSLATIONS[lang] ?? TRANSLATIONS.en
}

export function t(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str
  return Object.entries(vars).reduce(
    (s, [k, v]) => s.replace('{' + k + '}', String(v)),
    str
  )
}
