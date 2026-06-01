// Pre-written script exchanges for story progression phases.
// Script mode shows NPC lines and A/B/C choices instead of free text input.
// Once all scripted exchanges in a room are done, the room switches to free input mode.

export interface ScriptChoice {
  id: string
  label: { ko: string; en: string }       // displayed on the choice button (what the player says)
  npcResponse: { ko: string; en: string } // NPC's reaction to this choice
  relationshipDelta: number               // relationship score change
}

export interface ScriptExchange {
  id: string
  npcId: string
  npcLine: { ko: string; en: string }     // NPC says this first
  choices: ScriptChoice[]
  missionIds?: string[]                   // missions to complete after any choice is picked
}

export interface RoomScript {
  roomId: string
  episodeId: string
  phase: number
  exchanges: ScriptExchange[]
}

export const ROOM_SCRIPTS: RoomScript[] = [
  // ── EP01 Phase 1 — dm-james (introduce_to_james) ──────────────────────────
  {
    roomId: 'dm-james',
    episodeId: 'ep01',
    phase: 1,
    exchanges: [
      {
        id: 'james_intro_1',
        npcId: 'james',
        npcLine: {
          ko: '박준혁입니다. 오늘 첫 출근이시죠? 어색하지 않게 챙겨드릴게요. 성함이 어떻게 되세요?',
          en: 'I am James Park. It is your first day, right? I will help you get settled. What is your name?',
        },
        choices: [
          {
            id: 'a',
            label: {
              ko: '"안녕하세요, 저는 [이름]입니다. 잘 부탁드립니다."',
              en: '"Hello, I am [name]. Nice to meet you. I look forward to working with you."',
            },
            npcResponse: {
              ko: '반갑습니다! 첫날이니까 천천히 익히시면 돼요. 모르는 거 있으면 편하게 물어보세요. 팀장님이 오늘 브랜드 소개서 읽어보라고 하실 거예요.',
              en: 'Nice to meet you! Take it easy on the first day. Feel free to ask me anything. Sarah will probably ask you to review the brand profile today.',
            },
            relationshipDelta: 8,
          },
          {
            id: 'b',
            label: {
              ko: '"안녕하세요! 저 [이름]이에요. 많이 떨리는데 잘 부탁드려요."',
              en: '"Hi! I am [name]. I am a bit nervous but really glad to be here!"',
            },
            npcResponse: {
              ko: '반가워요! 긴장 많이 되시죠? 저도 처음엔 그랬어요. 금방 익숙해질 거예요. 한 가지만요 — 팀장님은 보고받는 거 좋아하세요. 오늘 브랜드 소개서 읽으면 이메일로 알려드려요.',
              en: 'Great to meet you! I was nervous on my first day too. You get used to it quickly. One tip — Sarah likes updates. After you read the brand profile today, send her a quick email.',
            },
            relationshipDelta: 12,
          },
          {
            id: 'c',
            label: {
              ko: '"안녕하세요. [이름]이라고 합니다."',
              en: '"Hello. My name is [name]."',
            },
            npcResponse: {
              ko: '네, 반갑습니다. 모르는 거 생기면 말씀해 주세요.',
              en: 'Nice to meet you. Let me know if you need anything.',
            },
            relationshipDelta: 4,
          },
        ],
        missionIds: ['introduce_to_james'],
      },
    ],
  },

  // ── EP01 Phase 1 — dm-sarah (greet_sarah) ─────────────────────────────────
  {
    roomId: 'dm-sarah',
    episodeId: 'ep01',
    phase: 1,
    exchanges: [
      {
        id: 'sarah_greet_1',
        npcId: 'sarah',
        npcLine: {
          ko: '왔어요. 오늘부터 우리 팀이에요. 첫 출근 소감은요?',
          en: 'You are here. Welcome to the team. How are you feeling on your first day?',
        },
        choices: [
          {
            id: 'a',
            label: {
              ko: '"잘 부탁드립니다 팀장님. 열심히 하겠습니다."',
              en: '"Thank you. I will do my best."',
            },
            npcResponse: {
              ko: '열심히 하는 건 기본이에요. 오늘 브랜드 소개서 읽어두세요. 공유 드라이브에 있어요. 읽고 나서 이메일로 간단히 검토 내용 보내줘요.',
              en: 'That is expected. Please read the brand profile today. It is in the shared drive. After you finish, send me a brief summary by email.',
            },
            relationshipDelta: 5,
          },
          {
            id: 'b',
            label: {
              ko: '"긴장되지만 빨리 적응해서 도움이 되고 싶습니다."',
              en: '"I am a bit nervous, but I really want to contribute as soon as I can."',
            },
            npcResponse: {
              ko: '적응은 금방 돼요. 오늘 할 일 하나 줄게요 — 브랜드 소개서 읽고 검토 내용 이메일로 보내줘요. 마감은 오늘 중으로요.',
              en: 'You will adapt quickly. Here is your first task — read the brand profile and send me your review by email. Today.',
            },
            relationshipDelta: 8,
          },
          {
            id: 'c',
            label: {
              ko: '"감사합니다. 오늘 어떤 것부터 시작하면 될까요?"',
              en: '"Thank you. What should I start with today?"',
            },
            npcResponse: {
              ko: '브랜드 소개서요. 공유 드라이브에 있어요. 읽고 나서 이메일로 검토 내용 보내줘요.',
              en: 'The brand profile. It is in the shared drive. Read it and send me your review by email.',
            },
            relationshipDelta: 6,
          },
        ],
        missionIds: ['greet_sarah'],
      },
    ],
  },

  // ── EP01 Phase 2 — team-general (send_group_intro) ────────────────────────
  {
    roomId: 'team-general',
    episodeId: 'ep01',
    phase: 2,
    exchanges: [
      {
        id: 'team_welcome',
        npcId: 'sarah',
        npcLine: {
          ko: '팀 여러분, 오늘부터 새로운 팀원이 합류했어요. 간단히 자기소개 부탁해요.',
          en: 'Team, we have a new member joining us today. Please give a brief introduction.',
        },
        choices: [
          {
            id: 'a',
            label: {
              ko: '"안녕하세요 여러분! 저는 [이름]입니다. 해외영업팀에 합류하게 돼서 기쁩니다. 잘 부탁드립니다!"',
              en: '"Hello everyone! I am [name]. I am excited to join the overseas sales team. Nice to meet you all!"',
            },
            npcResponse: {
              ko: '반갑습니다. 팀에 잘 녹아들 거예요.',
              en: 'Welcome. You will fit right in.',
            },
            relationshipDelta: 10,
          },
          {
            id: 'b',
            label: {
              ko: '"안녕하세요! [이름]이라고 해요. 처음이라 많이 배워야 할 것 같은데, 잘 부탁드립니다."',
              en: '"Hi! I am [name]. I know I have a lot to learn, but I look forward to working with everyone."',
            },
            npcResponse: {
              ko: '잘 왔어요. 모르는 거 있으면 편하게 물어봐요.',
              en: 'Welcome. Do not hesitate to ask if you need anything.',
            },
            relationshipDelta: 8,
          },
          {
            id: 'c',
            label: {
              ko: '"처음 뵙겠습니다. [이름]입니다. 만나서 반갑습니다."',
              en: '"Nice to meet you all. I am [name]. I look forward to working with the team."',
            },
            npcResponse: {
              ko: '반갑습니다.',
              en: 'Welcome.',
            },
            relationshipDelta: 5,
          },
        ],
        missionIds: ['send_group_intro', 'use_expression_1'],
      },
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getScript(roomId: string, episodeId: string): RoomScript | null {
  return ROOM_SCRIPTS.find(s => s.roomId === roomId && s.episodeId === episodeId) ?? null
}

export function isScriptRoom(roomId: string, episodeId: string): boolean {
  return ROOM_SCRIPTS.some(s => s.roomId === roomId && s.episodeId === episodeId)
}

export function getScriptMissions(roomId: string, episodeId: string): string[] {
  const script = getScript(roomId, episodeId)
  if (!script) return []
  return script.exchanges.flatMap(e => e.missionIds ?? [])
}
