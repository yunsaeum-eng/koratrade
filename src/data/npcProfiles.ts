export interface CharacterProfile {
  id: string
  name: string
  nameKr: string
  role: string
  roleKr: string
  avatar: string
  nationality: string
  personalityTags: string[]
  personalityTagsEn: string[]
  basicInfo: string
  unlockSeason: number  // 1 = from start, 2+ = locked until that season clears
  tiers: {
    workStyle: { text: string; minPct: number }
    personal:  { text: string; minPct: number }
    secret:    { text: string; minPct: number }
  }
}

export const CHARACTER_PROFILES: CharacterProfile[] = [
  {
    id: 'james',
    name: 'James Park',
    nameKr: '박준혁',
    role: 'Sales Associate',
    roleKr: '해외영업 대리 3년차',
    avatar: '👨‍💻',
    nationality: '🇰🇷',
    personalityTags: ['친근함', '유머', '영업 감각'],
    personalityTagsEn: ['Friendly', 'Humor', 'Sales intuition'],
    basicInfo: '해외영업팀의 분위기 메이커. 3년차지만 클라이언트 관계 형성은 팀 내 최고.',
    unlockSeason: 1,
    tiers: {
      workStyle: { minPct: 31, text: '관계 형성에 탁월하지만 서류 작업은 다소 느림. 그래도 현장 영업에서 결과를 낸다. 먼저 친해지고, 나중에 일 얘기 — 그게 그의 방식.' },
      personal:  { minPct: 61, text: '사실 더 큰 회사로의 이직을 준비 중. 팀원 중 아무도 모르지만, 플레이어에게만 조심스럽게 털어놓기 시작했다.' },
      secret:    { minPct: 86, text: '팀장 Sarah Kim을 좋아한다. 4년째. 물론 아무도, 절대로 모른다.' },
    },
  },
  {
    id: 'sarah',
    name: 'Sarah Kim',
    nameKr: '김사라',
    role: 'Team Leader',
    roleKr: '해외영업팀장 10년차',
    avatar: '👩‍💼',
    nationality: '🇰🇷',
    personalityTags: ['냉철함', '신뢰', '결단력'],
    personalityTagsEn: ['Cool-headed', 'Trustworthy', 'Decisive'],
    basicInfo: '10년 경력의 팀장. 말수는 적지만 한 마디가 팀 전체 방향을 바꾼다. 신뢰를 얻기 어렵지만, 한번 얻으면 끝까지 간다.',
    unlockSeason: 1,
    tiers: {
      workStyle: { minPct: 31, text: '의사결정이 빠르고 군더더기가 없다. 감정보다 데이터 우선. 보고는 결론부터, 한 줄짜리 요약을 선호한다.' },
      personal:  { minPct: 61, text: '유럽 바이어들과 20개국 이상 파트너십을 구축했다. 주말에는 혼자 북한산에 오른다. 아무도 초대하지 않는다.' },
      secret:    { minPct: 86, text: 'Sophie Beaumont는 전 직장 동료. 파리 바이어 시절 함께 일했다. 지금도 연락하지만, 비즈니스 테이블에선 철저히 모르는 척한다.' },
    },
  },
  {
    id: 'lisa',
    name: 'Lisa Lee',
    nameKr: '이지수',
    role: 'Trade Documentation',
    roleKr: '무역서류팀 5년차',
    avatar: '👩‍📋',
    nationality: '🇰🇷',
    personalityTags: ['꼼꼼함', '원칙주의', '신뢰성'],
    personalityTagsEn: ['Detail-oriented', 'By-the-book', 'Reliable'],
    basicInfo: '무역서류팀의 최고 전문가. B/L 하나에도 세 번씩 검토한다. 틀린 서류를 낸 적이 없다.',
    unlockSeason: 1,
    tiers: {
      workStyle: { minPct: 31, text: '서류 하나하나를 법적 책임 기준으로 검토. 실수를 허용하지 않는다. 같은 실수를 두 번 하면 신뢰를 잃는다.' },
      personal:  { minPct: 61, text: '사실 해외영업팀으로 오고 싶었다. 플레이어가 영업에서 성과를 낼수록 조용히 응원하고 있다. 은근히 롤모델로 보기 시작했다.' },
      secret:    { minPct: 86, text: '대학교 때 국제통상 전공. 부모님 권유로 안전한 서류팀을 택했지만, 5년이 지난 지금도 후회하고 있다.' },
    },
  },
  {
    id: 'min',
    name: 'Min Choi',
    nameKr: '최민준',
    role: 'Junior Sales Rep',
    roleKr: '해외영업팀 신입 동기',
    avatar: '🧑‍💼',
    nationality: '🇰🇷',
    personalityTags: ['솔직함', '고민 많음', '영어 능통'],
    personalityTagsEn: ['Candid', 'Overthinks', 'Fluent in English'],
    basicInfo: '같은 날 입사한 동기. 영어 실력은 팀 내 최상위지만, 실무에서의 감각은 아직 배우는 중.',
    unlockSeason: 1,
    tiers: {
      workStyle: { minPct: 31, text: '영어 실력은 발군. 하지만 관계 형성보다 정확성에 집중하는 스타일이라 바이어와의 라포 형성에서 시행착오를 겪고 있다.' },
      personal:  { minPct: 61, text: '해외영업이 적성인지 확신이 없다. 퇴근 후 혼자 고민하는 시간이 많다. 가끔 플레이어에게 진로 고민을 털어놓는다.' },
      secret:    { minPct: 86, text: '사실 스타트업 창업을 꿈꾸고 있다. B2B SaaS. 비즈니스 영어 실력을 쌓으러 온 것이 진짜 목적이다.' },
    },
  },
  {
    id: 'manager',
    name: 'Mr. Park',
    nameKr: '박철수 과장',
    role: 'Production Manager',
    roleKr: '생산관리팀 과장 15년차',
    avatar: '👨‍🏭',
    nationality: '🇰🇷',
    personalityTags: ['무뚝뚝함', '완벽주의', '베테랑'],
    personalityTagsEn: ['Blunt', 'Perfectionist', 'Veteran'],
    basicInfo: '생산관리팀의 살아있는 전설. 처음엔 쉽지 않지만, 그의 도움 없이는 납기를 맞출 수 없다.',
    unlockSeason: 1,
    tiers: {
      workStyle: { minPct: 31, text: '칭찬을 돌려서 한다. "그 정도면 됐어"가 그의 최고 찬사다. 말이 없을수록 잘 되고 있다는 신호.' },
      personal:  { minPct: 61, text: '딸이 플레이어와 동갑 취준생이다. 누가 봐도 모르지만, 플레이어를 남몰래 챙기고 있다. 간식을 책상에 두고 간다.' },
      secret:    { minPct: 86, text: '젊었을 때 해외영업을 꿈꿨다. 기회가 없었다. 그래서 영업팀 신입을 유독 지켜보는 것이다.' },
    },
  },
  // ── Season 2 unlock ──────────────────────────────────────────────────────────
  {
    id: 'amanda',
    name: 'Amanda Ross',
    nameKr: '아만다 로스',
    role: 'Procurement Director',
    roleKr: '미국 바이어 · Ford Motor Company',
    avatar: '👩‍💼',
    nationality: '🇺🇸',
    personalityTags: ['빠른 결정', '트렌드 중심', '직설적'],
    personalityTagsEn: ['Quick decision-maker', 'Trend-focused', 'Direct'],
    basicInfo: '미국 자동차 업계 구매 디렉터. 빠른 결정과 높은 기대치. 마음에 들면 대형 오더가 바로 나온다.',
    unlockSeason: 2,
    tiers: {
      workStyle: { minPct: 31, text: '결정이 빠르고 번복이 없다. 첫 미팅에서 "왜 당신 회사여야 하는가"에 답하지 못하면 그걸로 끝이다.' },
      personal:  { minPct: 61, text: '주말에는 사이클링. LinkedIn 팔로워 5만명. 트렌드 리포트를 직접 읽는다.' },
      secret:    { minPct: 86, text: '사실 한국 뷰티에 빠져있다. 구매 미팅 후 항상 면세점에 들른다.' },
    },
  },
  {
    id: 'sophie',
    name: 'Sophie Beaumont',
    nameKr: '소피 보몽',
    role: 'Sports & Athleisure Buyer',
    roleKr: '프랑스 바이어 · Galeries Lafayette Sport',
    avatar: '👩‍💼',
    nationality: '🇫🇷',
    personalityTags: ['품질 최우선', '브랜드 스토리', '신중한 결정'],
    personalityTagsEn: ['Quality-first', 'Brand storytelling', 'Deliberate decision-maker'],
    basicInfo: 'Galeries Lafayette 파리 플래그십 스토어의 스포츠&애슬레저 바이어. 품질과 브랜드 스토리가 최우선. 서두르면 무조건 실패한다.',
    unlockSeason: 2,
    tiers: {
      workStyle: { minPct: 31, text: '의사결정이 느리지만, 한번 결정하면 장기 계약이다. 브랜드 스토리와 디자인 퀄리티를 가장 먼저 본다. "Très bien"은 최고의 칭찬이다.' },
      personal:  { minPct: 61, text: '파리 17구에서 자랐다. 주말엔 마레 지구를 걷는다. 한국 K-athleisure 브랜드에 최근 관심이 생겼다.' },
      secret:    { minPct: 86, text: 'Sarah Kim과는 과거 한 프로젝트에서 함께 일한 사이. 비즈니스 테이블에선 처음 만난 척하지만, 속으로는 믿을 수 있는 파트너라는 걸 안다.' },
    },
  },
]
