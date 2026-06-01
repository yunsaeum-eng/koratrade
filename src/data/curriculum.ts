import { EpisodePhase, CurriculumEpisode, Expression } from '@/types'

// ─── Phase definitions (shared across all episodes) ──────────────────────────

export const PHASE_DEFS: EpisodePhase[] = [
  { id: 1, name: 'Morning Briefing',        nameKr: '아침 브리핑',         duration: '10 min', clockAdvance: 60,  description: '팀 모임 및 오늘 업무 개요 공유' },
  { id: 2, name: 'Internal Communication',  nameKr: '내부 커뮤니케이션',   duration: '20 min', clockAdvance: 120, description: '동료 및 상사와 업무 조율·보고' },
  { id: 3, name: 'Core Work Mission',        nameKr: '핵심 업무',           duration: '25 min', clockAdvance: 150, description: '에피소드 핵심 과제 수행' },
  { id: 4, name: 'Buyer Communication',      nameKr: '바이어 커뮤니케이션', duration: '15 min', clockAdvance: 90,  description: '해외 바이어 이메일 작성 또는 답변' },
  { id: 5, name: 'Wrap Up',                  nameKr: '마무리',              duration: '10 min', clockAdvance: 120, description: '일일 결과 정리 및 팀 보고' },
]

// ─── Episode emojis ───────────────────────────────────────────────────────────

export const EPISODE_EMOJI: Record<string, string> = {
  ep01: '🎉', ep02: '💪', ep03: '📝',
  ep04: '🤝', ep05: '✉️', ep06: '💬', ep07: '⭐',
}

// ─── Season overview data (S1 active, S2-S6 locked previews) ─────────────────

export interface SeasonOverview {
  season: number
  title: string
  subtitle: string
  objective: string
  episodeCount: number
  badge: { emoji: string; name: string }
  previewEpisodes?: string[]  // locked seasons show episode title previews
}

export const SEASON_OVERVIEWS: SeasonOverview[] = [
  {
    season: 1,
    title: '입사 온보딩',
    subtitle: '회사생활 기초',
    objective: '이 시즌을 완료하면 직장 내 기본 커뮤니케이션을 자연스럽게 할 수 있고, 모르는 것을 물어보고 실수를 수습하는 영어 표현을 체득하며, 비즈니스 이메일의 기본 형식을 이해할 수 있습니다.',
    episodeCount: 7,
    badge: { emoji: '🏢', name: 'Office Starter' },
  },
  {
    season: 2,
    title: '바이어 발굴',
    subtitle: '해외 시장 탐색',
    objective: 'KOTRA와 LinkedIn을 활용해 유럽·미주 바이어를 직접 발굴하고, 첫 콜드 이메일을 보낼 수 있는 실력을 기릅니다.',
    episodeCount: 7,
    badge: { emoji: '🔍', name: 'Buyer Hunter' },
    previewEpisodes: ['KOTRA 데이터베이스 탐색', '바이어 크레딧 검증', '첫 바이어 리스트 완성', '콜드 이메일 작성', '이메일 A/B 테스트', '팔로업 전략', 'Sophie 첫 접촉'],
  },
  {
    season: 3,
    title: '첫 미팅과 전시회',
    subtitle: '대면 영업 시작',
    objective: '화상 미팅과 전시회 현장에서 바이어와 직접 대화하고, 프레젠테이션과 아이스브레이킹 영어를 실전에서 쓸 수 있게 됩니다.',
    episodeCount: 7,
    badge: { emoji: '🤝', name: 'First Meeting' },
    previewEpisodes: ['첫 화상 미팅 준비', '미팅 영어 핵심 표현', '전시회 네트워킹', '프레젠테이션 스킬', '바이어 니즈 파악', '미팅 후 팔로업', 'Sophie 첫 미팅'],
  },
  {
    season: 4,
    title: '가격 협상과 오퍼',
    subtitle: '비즈니스 협상',
    objective: 'Incoterms·결제 조건·견적서를 실제로 작성하고, 협상에서 관계를 유지하면서 원하는 조건을 얻는 표현을 익힙니다.',
    episodeCount: 7,
    badge: { emoji: '💰', name: 'Deal Maker' },
    previewEpisodes: ['Incoterms 완전 정복', '결제 조건 협상', '견적서 작성', '가격 방어 전략', '협상 유연성', '계약 전 체크리스트', 'Sophie 오퍼 협상'],
  },
  {
    season: 5,
    title: '계약과 선적',
    subtitle: '실무 완성',
    objective: '계약서 검토, 선적 서류 관리, 납기 조율을 영어로 처리하고 클레임 발생 시 사과와 해결책을 전달하는 표현을 익힙니다.',
    episodeCount: 7,
    badge: { emoji: '📦', name: 'Deal Closed' },
    previewEpisodes: ['계약서 영어 이해', '선적 서류 준비', '납기 관리 커뮤니케이션', '클레임 대응', '사과와 해결책', '배송 문제 수습', 'Sophie 계약 완료'],
  },
  {
    season: 6,
    title: '관계 심화',
    subtitle: '장기 파트너십',
    objective: '대금 수령 후 재오더를 유도하고, 장기 파트너십을 제안하는 고급 영어 표현으로 비즈니스 관계를 심화합니다.',
    episodeCount: 7,
    badge: { emoji: '🌟', name: 'Global Partner' },
    previewEpisodes: ['인보이스 관리', '재오더 유도 이메일', '파트너십 제안', '연간 계약 협상', '관계 유지 전략', '추천인 마케팅', 'Sophie 장기 계약'],
  },
]

// ─── Season 1 curriculum ──────────────────────────────────────────────────────

export const CURRICULUM: CurriculumEpisode[] = [

  // ── EP01 — First Day Jitters ──────────────────────────────────────────────
  {
    id: 'ep01', season: 1, episode: 1,
    title: 'First Day Jitters',
    titleKr: '입사 첫날',
    estimatedMinutes: 60,
    objectives: [
      '첫 직장에서 영어로 자기소개를 자연스럽게 할 수 있다',
      '상사와 동료에게 적절한 격식의 인사를 할 수 있다',
      '업무 지시를 받고 마감을 확인하는 표현을 쓸 수 있다',
      'KoraTrade 회사 구조와 해외영업팀 역할을 이해한다',
    ],
    synopsis: 'James가 들뜬 표정으로 사무실 투어. Sarah의 짧은 공식 환영 인사. Min의 긴장한 자기소개. Lisa는 거의 눈길도 안 줌. 박 과장의 짧고 냉담한 한 마디.',
    phases: PHASE_DEFS,
    expressions: [
      { id: 'ep01-e1', english: "Nice to meet you. I'm [name], new to the team.", korean: '만나서 반갑습니다. 저는 팀에 새로 합류한 [이름]입니다.', context: '첫 자기소개', learned: false, xp: 20 },
      { id: 'ep01-e2', english: 'Could you show me how this works?', korean: '이게 어떻게 사용되는지 보여주실 수 있나요?', context: '도움 요청', learned: false, xp: 20 },
      { id: 'ep01-e3', english: 'Thank you so much for your help.', korean: '도움 주셔서 정말 감사드립니다.', context: '감사 표현', learned: false, xp: 20 },
      { id: 'ep01-e4', english: "I'll get right on it.", korean: '바로 처리하겠습니다.', context: '업무 수락', learned: false, xp: 20 },
      { id: 'ep01-e5', english: 'Just to confirm — I should finish this by end of day, correct?', korean: '확인차 여쭤보는데요, 오늘 안으로 완료하면 되는 거 맞나요?', context: '업무 확인', learned: false, xp: 20 },
    ],
  },

  // ── EP02 — Survival Week ──────────────────────────────────────────────────
  {
    id: 'ep02', season: 1, episode: 2,
    title: 'Survival Week',
    titleKr: '첫 주 생존기',
    estimatedMinutes: 60,
    objectives: [
      '모르는 것을 부끄럽지 않게 물어보는 표현을 쓸 수 있다',
      '실수했을 때 자연스럽고 적절하게 사과할 수 있다',
      '타부서 동료에게 정중하게 요청하는 방법을 안다',
      '바이어 DB가 무엇인지 이해하고 기본 구조를 파악한다',
    ],
    synopsis: '박 과장과 납기 관련 갈등. Lisa가 서류 실수를 냉정하게 지적하고 수정을 도와줌. Min이 자기도 모르겠다고 고백. James가 사내 정치 인사이더 정보를 공유.',
    phases: PHASE_DEFS,
    unlockRequiresEpisode: 'ep01',
    expressions: [
      { id: 'ep02-e1', english: "I'm not entirely sure — could you clarify?", korean: '확실하지 않아서요, 확인해 주실 수 있나요?', context: '명확화 요청', learned: false, xp: 20 },
      { id: 'ep02-e2', english: "I apologize for the mistake. I'll make sure it doesn't happen again.", korean: '실수한 점 사과드립니다. 다시는 이런 일이 없도록 하겠습니다.', context: '실수 사과', learned: false, xp: 20 },
      { id: 'ep02-e3', english: 'Could I ask you something? I want to make sure I understand correctly.', korean: '여쭤봐도 될까요? 제가 올바르게 이해하고 있는지 확인하고 싶어요.', context: '이해 확인', learned: false, xp: 20 },
      { id: 'ep02-e4', english: "I might be missing something, but would it be possible to...?", korean: '제가 놓친 부분이 있을 수도 있는데, ...이 가능할까요?', context: '정중한 요청', learned: false, xp: 20 },
      { id: 'ep02-e5', english: "I'll look into it and get back to you.", korean: '확인해 보고 다시 연락드리겠습니다.', context: '확인 후 답변', learned: false, xp: 20 },
    ],
  },

  // ── EP03 — First Solo Mission ─────────────────────────────────────────────
  {
    id: 'ep03', season: 1, episode: 3,
    title: 'First Solo Mission',
    titleKr: '첫 업무 독립',
    estimatedMinutes: 60,
    objectives: [
      '업무 진행상황을 상사에게 보고하는 표현을 쓸 수 있다',
      '피드백을 요청하고 반영하는 프로세스를 익힌다',
      '비즈니스 이메일의 기본 구조를 이해한다',
      '초안 작성 후 수정하는 업무 사이클을 경험한다',
    ],
    synopsis: 'Sarah가 바이어 조사 업무를 지시. James가 KOTRA 활용법 설명. Min도 같은 업무를 받아 라이벌 구도. Min이 리스트 먼저 제출하지만 파산한 회사 포함.',
    phases: PHASE_DEFS,
    unlockRequiresEpisode: 'ep02',
    expressions: [
      { id: 'ep03-e1', english: "I'd like to report on the progress of [task].", korean: '[업무] 진행 상황을 보고드리겠습니다.', context: '진행 보고', learned: false, xp: 20 },
      { id: 'ep03-e2', english: 'Would it be alright if I asked for your feedback on this?', korean: '이 부분에 대한 피드백을 주실 수 있을까요?', context: '피드백 요청', learned: false, xp: 20 },
      { id: 'ep03-e3', english: "I've completed the first draft — please let me know if any changes are needed.", korean: '초안을 완성했습니다. 수정이 필요하면 말씀해 주세요.', context: '초안 제출', learned: false, xp: 20 },
      { id: 'ep03-e4', english: 'I was wondering if there is a better approach to this.', korean: '더 좋은 방법이 있는지 생각해 봤는데요.', context: '방법 탐색', learned: false, xp: 20 },
      { id: 'ep03-e5', english: "I'll have it ready by [deadline].", korean: '[마감]까지 준비해 드리겠습니다.', context: '마감 약속', learned: false, xp: 20 },
    ],
  },

  // ── EP04 — Office Politics 101 ────────────────────────────────────────────
  {
    id: 'ep04', season: 1, episode: 4,
    title: 'Office Politics 101',
    titleKr: '사내 네트워킹',
    estimatedMinutes: 60,
    objectives: [
      '타부서에 정중하게 협조를 요청할 수 있다',
      '바쁜 상대방에게 시간 조율을 제안할 수 있다',
      '도움받았을 때 진심 어린 감사를 표현할 수 있다',
      '한국 직장 내 부탁 문화의 특수성을 이해한다',
    ],
    synopsis: '조사 중 Galeries Lafayette Sport 발견, 구매 담당자로 Sophie Beaumont 확인. Sarah에게 보고하자 묘한 표정 변화. James도 그 이름을 어디서 들어봤다고 함. LinkedIn에서 Sarah와 Sophie가 공통 지인 1명.',
    phases: PHASE_DEFS,
    unlockRequiresEpisode: 'ep03',
    expressions: [
      { id: 'ep04-e1', english: "I understand you're very busy, but could you help me with...?", korean: '많이 바쁘신 건 알지만, ...에 도움을 받을 수 있을까요?', context: '협조 요청', learned: false, xp: 20 },
      { id: 'ep04-e2', english: 'This is time-sensitive — could you give me an ETA?', korean: '시간이 촉박한 사안인데, 언제쯤 가능하실까요?', context: '시간 조율', learned: false, xp: 20 },
      { id: 'ep04-e3', english: 'I really appreciate your help on this.', korean: '이 건 도와주셔서 정말 감사드립니다.', context: '진심 어린 감사', learned: false, xp: 20 },
      { id: 'ep04-e4', english: 'Would you be available for a quick chat about...?', korean: '...에 대해 잠깐 이야기 나눌 시간이 있으실까요?', context: '미팅 제안', learned: false, xp: 20 },
      { id: 'ep04-e5', english: "I'll make sure to return the favor.", korean: '꼭 보답할게요.', context: '호의 약속', learned: false, xp: 20 },
    ],
  },

  // ── EP05 — Email Mastery ──────────────────────────────────────────────────
  {
    id: 'ep05', season: 1, episode: 5,
    title: 'Email Mastery',
    titleKr: '비즈니스 이메일 완전정복',
    estimatedMinutes: 75,
    objectives: [
      '비즈니스 이메일 5가지 유형을 직접 작성할 수 있다',
      '정보요청 팔로업 사과 감사 보고 이메일을 구분해서 쓴다',
      '이메일 제목줄을 효과적으로 작성하는 법을 안다',
      '이메일 발송 전 체크리스트를 습관화한다',
    ],
    synopsis: 'Sophie Beaumont에게 보낼 첫 콜드 이메일 작성. James가 절반을 다시 씀. Sarah가 첨삭투성이로 돌려보냄. 세 번 다시 씀. 발송 직후 브로셔 첨부 누락 발견.',
    phases: PHASE_DEFS,
    unlockRequiresEpisode: 'ep04',
    expressions: [
      { id: 'ep05-e1', english: 'I am writing to inquire about [topic].', korean: '[주제]에 대해 문의드리고자 연락드립니다.', context: '정보 요청 이메일', learned: false, xp: 20 },
      { id: 'ep05-e2', english: 'I wanted to follow up on our previous conversation regarding [topic].', korean: '[주제]에 대한 이전 대화의 후속으로 연락드립니다.', context: '팔로업 이메일', learned: false, xp: 20 },
      { id: 'ep05-e3', english: 'I sincerely apologize for any inconvenience this may have caused.', korean: '불편을 드린 점 진심으로 사과드립니다.', context: '사과 이메일', learned: false, xp: 20 },
      { id: 'ep05-e4', english: 'Thank you for taking the time to [action].', korean: '[행동]을 위해 시간 내주셔서 감사합니다.', context: '감사 이메일', learned: false, xp: 20 },
      { id: 'ep05-e5', english: 'I am writing to update you on the progress of [project].', korean: '[프로젝트] 진행 상황을 업데이트해 드리고자 연락드립니다.', context: '보고 이메일', learned: false, xp: 20 },
    ],
  },

  // ── EP06 — Workplace Survival English ────────────────────────────────────
  {
    id: 'ep06', season: 1, episode: 6,
    title: 'Workplace Survival English',
    titleKr: '직장 생존 영어 총정리',
    estimatedMinutes: 60,
    objectives: [
      '회의에서 자신의 의견을 자연스럽게 말할 수 있다',
      '나쁜 소식을 전달하는 방법을 안다',
      '동료를 칭찬하고 격려하는 표현을 쓸 수 있다',
      '우선순위 조율과 일정 변경을 요청할 수 있다',
    ],
    synopsis: '2주간 답장 없음. Min이 먼저 바이어 회신을 받음. James가 팔로업 전략 코칭. 박 과장이 자신의 실패담을 처음으로 꺼냄.',
    phases: PHASE_DEFS,
    unlockRequiresEpisode: 'ep05',
    expressions: [
      { id: 'ep06-e1', english: "I'd like to add something, if I may.", korean: '한 가지 덧붙여도 될까요?', context: '미팅 의견 추가', learned: false, xp: 20 },
      { id: 'ep06-e2', english: 'I have some difficult news to share.', korean: '드리기 어려운 소식이 있습니다.', context: '나쁜 소식 전달', learned: false, xp: 20 },
      { id: 'ep06-e3', english: 'You did a great job on this.', korean: '이 건 정말 잘 하셨어요.', context: '칭찬 표현', learned: false, xp: 20 },
      { id: 'ep06-e4', english: 'Could we go over the priorities together?', korean: '우선순위를 같이 검토해볼 수 있을까요?', context: '우선순위 조율', learned: false, xp: 20 },
      { id: 'ep06-e5', english: "I'll have it ready by [time].", korean: '[시간]까지 준비해 드리겠습니다.', context: '일정 약속', learned: false, xp: 20 },
    ],
  },

  // ── EP07 — Ready for Action (Season 1 Finale) ────────────────────────────
  {
    id: 'ep07', season: 1, episode: 7,
    title: 'Ready for Action',
    titleKr: '시즌 1 피날레',
    estimatedMinutes: 60,
    objectives: [
      'S1에서 배운 표현 30개를 자연스럽게 종합 활용한다',
      '한 달간의 업무 성과를 영어로 보고할 수 있다',
      'S2 바이어 발굴 업무에 대한 브리핑을 이해한다',
      '동료들과 의미있는 관계를 형성했음을 확인한다',
    ],
    synopsis: '18일 침묵 끝에 Sophie Beaumont로부터 짧고 정중한 회신. Sarah가 이름을 보고 조용해짐. James는 들떠있지만 Sophie가 까다롭다고 경고. Sarah가 사석에서 Sophie와 옛 동료였다고 처음 언급.',
    phases: PHASE_DEFS,
    unlockRequiresEpisode: 'ep06',
    expressions: [
      { id: 'ep07-e1', english: 'Thank you for getting back to me, Ms. Beaumont.', korean: '보몽 씨, 회신 주셔서 감사합니다.', context: '회신 감사', learned: false, xp: 20 },
      { id: 'ep07-e2', english: 'Please find attached our product catalogue and relevant certifications.', korean: '제품 카탈로그와 관련 인증서를 첨부드립니다.', context: '첨부 안내', learned: false, xp: 20 },
      { id: 'ep07-e3', english: "Should you have any questions after reviewing, I'd be happy to arrange a call at your convenience.", korean: '검토 후 궁금하신 점이 있으시면 편하신 시간에 통화 일정을 잡겠습니다.', context: '다음 단계 제안', learned: false, xp: 20 },
      { id: 'ep07-e4', english: 'We look forward to the possibility of working together.', korean: '함께 일할 수 있는 가능성을 기대합니다.', context: '관계 유지', learned: false, xp: 20 },
      { id: 'ep07-e5', english: "I'll follow up in one week if I haven't heard back.", korean: '일주일 후 연락이 없으시면 다시 연락드리겠습니다.', context: '다음 팔로업 예고', learned: false, xp: 20 },
    ],
  },
]

// ─── Utilities ────────────────────────────────────────────────────────────────

export function getCurriculumEpisode(id: string): CurriculumEpisode | undefined {
  return CURRICULUM.find(ep => ep.id === id)
}

export function getEpisodeExpressions(episodeId: string): Expression[] {
  const ep = getCurriculumEpisode(episodeId)
  if (!ep) return []
  return ep.expressions.map(expr => ({ ...expr, learned: false, xp: 20 }))
}

// How many objectives are checked based on episode progress (0-100)
export function getCheckedObjectives(progress: number, total: number): number {
  if (progress >= 100) return total
  if (total <= 0) return 0
  return Math.floor((progress / 100) * total)
}
