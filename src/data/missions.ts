export interface MissionDef {
  id: string
  episodeId: string
  phase: number
  nameKr: string
  name: string
  xp: number
  condition: string
}

export interface StoryBeat {
  afterPhase: number
  episodeId: string
  npcId: string
  roomId: string
  message: { ko: string; en: string }
  delayMs: number
}

export const MISSION_DEFS: MissionDef[] = [
  // ── EP01 ──────────────────────────────────────────────────────────────────

  // Phase 1 — 첫 인사 (Morning Briefing)
  {
    id: 'introduce_to_james',
    episodeId: 'ep01', phase: 1,
    nameKr: 'James에게 자기소개',
    name: 'Introduce yourself to James',
    xp: 30,
    condition: 'Active room is dm-james AND user message includes their name OR "new here" OR "first day" OR any self-introduction content',
  },
  {
    id: 'greet_sarah',
    episodeId: 'ep01', phase: 1,
    nameKr: 'Sarah 팀장께 인사',
    name: 'Greet Sarah',
    xp: 20,
    condition: 'Active room is dm-sarah AND user has sent at least one message',
  },

  // Phase 2 — 사내 소통 (Internal Communication)
  {
    id: 'send_group_intro',
    episodeId: 'ep01', phase: 2,
    nameKr: '팀 채팅에 자기소개',
    name: 'Introduce in Group Chat',
    xp: 30,
    condition: 'Active room is team-general AND user message contains introduction content (name, new, hello everyone, first day, etc.)',
  },
  {
    id: 'use_expression_1',
    episodeId: 'ep01', phase: 2,
    nameKr: '"만나서 반갑습니다" 사용',
    name: 'Use Greeting Expression',
    xp: 20,
    condition: 'User message (any room) contains "nice to meet" OR "반갑습니다" OR "반가워요" OR "만나서" OR similar first-meeting greeting',
  },

  // Phase 3 — 핵심 업무 (Core Work)
  {
    id: 'read_brand_profile',
    episodeId: 'ep01', phase: 3,
    nameKr: '브랜드 소개서 열람',
    name: 'Read Brand Profile',
    xp: 40,
    condition: 'User opened the brand profile document modal OR user message mentions reading/seeing the brand profile or company profile',
  },
  {
    id: 'confirm_first_task',
    episodeId: 'ep01', phase: 3,
    nameKr: '첫 업무 마감 확인',
    name: 'Confirm First Task Deadline',
    xp: 30,
    condition: 'Active room is dm-sarah AND user message asks about deadline/when/마감 OR confirms they will complete the task OR asks what they should do next',
  },
  {
    id: 'write_report_email',
    episodeId: 'ep01', phase: 3,
    nameKr: '보고 이메일 작성 (80점 이상)',
    name: 'Write Report Email (pass 80+)',
    xp: 100,
    condition: 'User submitted a report email and received a grade of 80 or higher from the AI grader',
  },

  // ── EP02 ──────────────────────────────────────────────────────────────────

  {
    id: 'ask_for_clarification',
    episodeId: 'ep02', phase: 1,
    nameKr: '명확화 질문하기',
    name: 'Ask for Clarification',
    xp: 30,
    condition: 'User message contains a clarification request expression in any work-related conversation',
  },
  {
    id: 'apologize_for_mistake',
    episodeId: 'ep02', phase: 2,
    nameKr: '실수에 사과하기',
    name: 'Apologize for Mistake',
    xp: 30,
    condition: 'User message contains an apology for a mistake: "I apologize", "sorry about", "죄송합니다", "사과드립니다"',
  },
  {
    id: 'contact_park',
    episodeId: 'ep02', phase: 3,
    nameKr: '박 과장에게 연락',
    name: 'Contact Mr. Park',
    xp: 20,
    condition: 'Active room is dm-park AND user has sent at least one message',
  },
  {
    id: 'get_lisa_help',
    episodeId: 'ep02', phase: 3,
    nameKr: 'Lisa에게 도움 요청',
    name: "Get Lisa's Help",
    xp: 30,
    condition: 'Active room is dm-lisa AND user message asks for help, information, or assistance about documents or brand materials',
  },
  {
    id: 'attend_team_meeting',
    episodeId: 'ep02', phase: 4,
    nameKr: '팀 미팅 참여',
    name: 'Attend Team Meeting',
    xp: 40,
    condition: 'Active room is team-general AND user message relates to a meeting, agenda, or team discussion',
  },
]

// ── Story beats — auto-sent NPC messages after each phase completes ───────────

export const STORY_BEATS: StoryBeat[] = [
  {
    afterPhase: 1, episodeId: 'ep01',
    npcId: 'james', roomId: 'dm-james',
    message: {
      en: "Hey, quick heads-up — Sarah usually asks new people to review the brand profile document on day one. It's in our shared drive. If she hasn't mentioned it yet, she will. I can send you the link if you need it.",
      ko: "참, 알려드릴 게 있어요 — 팀장님이 신입들한테 보통 첫날에 브랜드 소개서 읽어보라고 하세요. 아직 말씀 안 하셨으면 곧 하실 거예요. 공유 드라이브에 있는데 링크 보내드릴까요?",
    },
    delayMs: 7000,
  },
  {
    afterPhase: 2, episodeId: 'ep01',
    npcId: 'sarah', roomId: 'dm-sarah',
    message: {
      en: "Do you have a moment? I'd like to check in. Have you had a chance to look through the brand profile document? And if you have any questions about your first assignment or the deadline, feel free to ask.",
      ko: "잠깐 시간 있어요? 확인하고 싶은 게 있어서요. 혹시 브랜드 소개서는 읽어봤어요? 첫 업무나 마감 관련해서 궁금한 게 있으면 편하게 물어봐요.",
    },
    delayMs: 9000,
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getMissionsForEpisode(episodeId: string): MissionDef[] {
  return MISSION_DEFS.filter(m => m.episodeId === episodeId)
}

export function getMissionsForPhase(episodeId: string, phase: number): MissionDef[] {
  return MISSION_DEFS.filter(m => m.episodeId === episodeId && m.phase === phase)
}
