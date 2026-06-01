# KoraTrade — 완전 명세서 v2.0
# VS Code Claude 채팅창에 이 전체 내용을 붙여넣으세요.

---

## 프로젝트 개요

Build a full Next.js web app called KoraTrade — a Business English learning simulator styled as a workplace RPG. The user plays as a new hire at a Korean trading company called KoraTrade. Learning happens naturally through story, not through explicit study.

Tech stack:
- Next.js with TypeScript
- Tailwind CSS
- Local auth (no Firebase needed for now — simple email/password stored locally)
- Claude API (claude-haiku-4-5) for live NPC responses
- localStorage for data persistence

---

## DESIGN SYSTEM

Colors:
- Background: #f2efe9 (warm off-white)
- Card/Panel: #ffffff
- Secondary bg: #f7f5f1
- Border: rgba(0,0,0,0.08)
- Accent (gold-brown): #8a6530
- Green (success): #256040
- Red (error): #a03828
- Text primary: #1c1a17
- Text secondary: #6b6560
- Text muted: #a09890

Fonts:
- Body: Pretendard
- Logo/Display: DM Serif Display
- Numbers/Clock: DM Mono

---

## PAGE STRUCTURE

### 1. /login — 로그인/회원가입 랜딩

Layout: centered card, max-width 480px

Content:
- KoraTrade logo (DM Serif Display, gold)
- Tagline: "해외영업 인턴으로 입사해서 진짜 비즈니스 영어를 체득하세요"
- Keyword tags: 🎮 스토리 RPG / 💼 실무 시뮬레이션 / 🌍 비즈니스 영어
- Google 로그인 버튼 (UI only, no real OAuth needed for now)
- Apple 로그인 버튼 (UI only)
- Divider "또는"
- 이메일로 회원가입 button → shows email/password form
- 이미 계정이 있어요 → login form toggle

Simple local auth: store user in localStorage. No real backend auth needed yet.

---

### 2. /onboarding — 4단계 입사 지원 플로우

Step indicator at top showing 4 steps.

Step 1 - 계정 만들기:
- Email + password + confirm password fields
- Validation (email format, password 8+ chars, passwords match)
- Next button

Step 2 - 아바타 만들기:
- Large avatar preview circle (shows selected emoji + background color)
- Name input field (shown below preview, 12 char max)
- Emoji grid (6 columns, 22 options): 🧑‍💼👨‍💼👩‍💼🧑‍🏫👨‍🎓👩‍🎓🧑‍💻👨‍💻👩‍💻🧑‍🔬🦸🧙🕵️👨‍✈️👩‍✈️🧑‍🚀🦊🐼🦁🐯🦅🌟
- Color picker (8 background colors for avatar circle)
- Selected emoji/color shows live in preview
- Next button (disabled until name entered)

Step 3 - 학습 목표:
- 4 goal options (single select):
  - 🎯 해외영업 취업 준비
  - 💼 현직 비즈니스 영어 향상
  - 📚 무역 자격증 병행 준비
  - 🌍 그냥 재밌게 영어 공부
- Next button (disabled until selected)

Step 4 - 합격 통보 (Offer Letter):
- Confetti animation 🎉🥳🎊
- Animated offer letter card showing:
  - "KoraTrade Inc. 해외영업팀" header
  - User's name in large DM Serif Display font
  - "Junior Sales Representative" position
  - Welcome message mentioning their goal
  - Sarah Kim's signature
- Loading progress bar (fake loading: "계정 생성 중..." → "프로필 저장 중..." → "팀원들에게 알리는 중..." → "준비 완료!")
- "첫 출근하기 →" button (enabled after loading completes)

---

### 3. /commute — 출근 화면 (매일 접속 시 첫 화면)

This screen appears when user opens the app each day.

Layout: centered card, max-width 500px

Top section:
- Large clock showing current real time (DM Mono font, 36px)
- Date: "2025년 3월 19일 수요일"
- If before 9:00am: show countdown "출근까지 X분" in accent color
- If 9:00am-6:00pm: show "출근하기" button active
- If after 6:00pm: show "오늘 업무가 종료됐어요" message

NPC status cards (show all 5 internal NPCs):
Each card shows:
- Avatar emoji + name + role
- Online/offline dot
- Status tag (오늘의 상태): e.g. "표정 안 좋음", "기분 좋음", "바쁨", "평소와 같음", "긴장한 것 같음"
- Brief hint text explaining the status (1-2 sentences, like insider info)
- Status tags and hints are randomly varied each day

Today's episode card:
- Episode badge (S1·EP01)
- Episode title
- Brief mission description
- Accent background color

"출근하기 🟢" primary button:
- Only active at 9am or later
- Clicking sets checkin time and navigates to /main

---

### 4. /main — 메인 게임 화면

3-column resizable layout. Full viewport height.

#### TOP BAR (height: 54px, white background)
- Left: KoraTrade logo
- Center: Game clock (DM Mono, ticks every real minute, maps 9am-6pm)
- Center: Work hours pill "근무 중 09:00–18:00" with green dot
- Right: Streak pill (🔥 N일 연속), XP pill (⭐ NNN XP), Level badge (JUNIOR/SENIOR etc)

#### LEFT SIDEBAR (default 220px, draggable resize handle on right edge, min 160px max 320px)

Top: "사무실 채팅" label

Room list:
1. Group room: 해외영업팀 전체 (building emoji, square avatar)
2. Individual rooms for each NPC:
   - James Park — 해외영업 대리 (3년차) — status tag: 기분 좋음
   - Sarah Kim — 팀장 (10년차) — status tag: 표정 안 좋음  
   - Lisa Lee — 무역서류팀 — status tag: 바쁨
   - Min Choi — 동기 신입 — status tag: 긴장한 것 같음
   - 박철수 과장 — 생산관리팀 — status tag: 평소와 같음
   - Klaus Müller — GermanParts·독일 (buyer section) — offline

Each room item shows:
- Avatar emoji with online dot (color varies: green=online, red=busy, gray=offline)
- Name + preview of last message
- Status tag
- Unread badge if applicable
- Active room highlighted in accent background
- HOVER EFFECT: when mouse hovers over NPC, show floating popup card with:
  - Avatar, name, role
  - Relationship bar
  - Today's status
  - One personality keyword
  - Smooth fade in/out

Bottom of left sidebar:
- User profile card showing:
  - User avatar + name
  - Title (Junior Sales Rep)
  - XP bar (current/max)
  - CLICKING this opens user profile modal

Navigation icons (bottom):
- 💬 채팅 (current)
- 📒 업무 노트 → navigates to /notes
- 👥 인물 도감 → navigates to /characters
- 📊 내 성장 (stats page - future)

#### CENTER CHAT AREA (flex: 1, min-width 300px)

Chat header (56px):
- Current NPC avatar + online dot
- Name + role
- Online status text
- "프로필 보기" and "📒 노트" buttons

Message area (scrollable):
- Date separator at top
- KakaoTalk-style message grouping:
  - First message in a group: show avatar + name + bubble + timestamp
  - Consecutive messages from same person (within 1-2 min): show ONLY bubble, no avatar/name repeated
  - New group starts when: different sender, or time gap >2 minutes
  - This applies to both NPC and user messages
- Message bubble styles:
  - NPC: white background, subtle border, rounded, bottom-left corner flat
  - User: accent-tinted background, bottom-right corner flat
  - System messages: centered, purple tint, smaller text
- Typing indicator: three bouncing dots in NPC bubble style

Hint system (replaces choice buttons):
- NO multiple choice buttons
- Instead: 💡 hint button in input area
- When clicked: shows popup with 2-3 relevant expressions for current situation
- Auto-popup hint when receiving work instructions (dismissable with X)
- Hints are reference only — user types freely

Input area:
- Hint text: "자유롭게 대화하거나 영어로 답장을 연습해보세요"
- 💡 button (opens hint popup)
- Text input field (textarea, auto-resize)
- Send button

#### RIGHT SIDEBAR (default 256px, draggable resize handle on left edge, min 180px max 380px)

Header: "오늘의 미션" (14px bold)

Mission card:
- Episode badge (e.g. S1·EP01)
- Episode title (13px bold)
- Progress label + fraction (e.g. "핵심 표현 습득 2 / 5")
- Progress bar

Expression cards section:
- Section label: "오늘의 표현" (13px bold, underline separator)
- 5 expression cards, each showing:
  - English sentence (12px medium weight)
  - Korean translation (11px)
  - Situation tag (e.g. 첫 자기소개, 업무 확인)
  - "클릭하면 +20 XP" hint text
- CLICKING toggles learned/unlearned (checkmark appears/disappears)
- Brief undo option appears for 3 seconds after checking

Work notes section:
- Section label: "업무 노트" (13px bold)
- Shows 3 most recent saved terms
- Each: term name (accent color, bold) + brief definition
- "전체 노트 보기 →" button

---

### 5. /notes — 업무 노트 전체 탭

4-tab layout: 용어집 | 표현 모음 | 틀린 문장 | 내 메모

용어집 tab:
- Search bar + "직접 추가" button
- Each entry: term (bold accent), definition, tag (자동저장 green / 직접추가 purple), SRS review date
- Clicking entry opens detail popup with example sentence, native tip, save to note button
- SRS dots showing review progress (5 dots, filled = reviewed)

표현 모음 tab:
- Same structure but for full expressions
- Tags: situation context (#협상 #이메일 #클레임 etc)
- Can add memo to each expression

틀린 문장 tab:
- Stats row: 누적 오답 N | 복습 대기 N | 완전 정복 N
- List of wrong answers with: sentence, episode source, times wrong, "지금 복습하기" button
- Red-tinted cards

내 메모 tab:
- Free textarea, auto-saves
- Shows saved date

---

### 6. /characters — 인물 도감

Grid layout, 2 columns

Filter buttons: 전체 | 사내 | 바이어 | 잠금

Character cards:
Each card shows:
- Colored banner background
- Avatar emoji (large, circular, positioned overlapping banner and body)
- Online dot
- Name + role
- Personality tags
- Relationship/trust bar with color
- 4 unlock stage indicators (colored bars showing progress)
- "다음 잠금 해제: XX% 달성 시" hint
- "프로필 보기 →" button

Clicking card or button opens CHARACTER MODAL:
- Banner with avatar + name + role + tags
- Close button
- Relationship bar with 4 stage markers (0-30%, 31-60%, 61-85%, 86-100%)

Progressive info sections:
1. 기본 정보 (always visible): personality description
2. 업무 스타일 (31%+): how they work, communication style
   - If locked: padlock icon + "관계도 31% 달성 시 공개"
3. 개인 이야기 (61%+): personal background, hobbies
   - If locked: padlock icon + "관계도 61% 달성 시 공개"  
4. 숨겨진 서사 (86%+): secret backstory — SPECIAL golden animation on unlock
   - If locked: padlock icon + "관계도 86% 달성 시 공개 — 반전 있음"

Chat preview section (always visible):
- 3 example dialogue bubbles showing character's typical speech

Footer buttons: 닫기 | 대화하러 가기 →

NPC DATA:

Sarah Kim (김사라):
- Role: 해외영업팀장 · 10년차
- Emoji: 👩‍💼, bg: warm gold tint
- Tags: 멘토, 든든한 우군
- Relationship: 75%
- Basic: 냉철하지만 따뜻함. 말수 적고 결과로 말하는 스타일. Yun을 가장 많이 챙기지만 티를 잘 안 냄.
- Work style: 이메일은 항상 간결하고 명확하게. 회의에서 말 한마디가 결론. 감정보다 데이터로 설득.
- Personal: 신입 때 엄청난 실수를 했던 과거가 있음. 커피는 아메리카노, 항상 블랙.
- Secret: Klaus Müller와 전 직장 동료. KoraTrade가 Müller의 첫 거래처가 된 건 사실 Sarah 때문. 아무도 모름.

James Park (박준혁):
- Role: 해외영업 대리 · 3년차
- Emoji: 👨‍💼, bg: blue tint
- Tags: 친한 선배, 가끔 민폐
- Relationship: 60%
- Basic: 친근하고 유머있음. 영어 실력은 좋은데 가끔 덜렁거려서 사고를 침.
- Work style: 이메일 답장 속도 팀 최고. 바이어랑 친해지는 속도도 빠름. 단 서류 꼼꼼함은 팀 최하.
- Personal: (locked at 60%)
- Secret: 사실 이직 준비 중. Yun한테만 털어놓는 고민. 마케팅팀 유나씨를 짝사랑 중.

Lisa Lee (이지수):
- Role: 무역서류팀 · 5년차
- Emoji: 👩‍🦱, bg: purple tint
- Tags: 꼼꼼한 조력자, 원칙주의
- Relationship: 40%
- Basic: 원칙주의자. 서류 하나하나 다 따짐. 속은 따뜻한데 표현을 못 함. 고양이 집사.
- Work style: 서류 오타 용납 불가. 마감 하루 전에 제출 안 하면 압박 메시지 옴.
- Personal: (locked)
- Secret: 사실 해외영업팀으로 이동하고 싶어함. 고양이 이름은 "L/C".

Park Cheolsu (박철수 과장):
- Role: 생산관리팀 · 15년차
- Emoji: 👨‍🏭, bg: gray tint
- Tags: 초반 빌런, 현실주의자
- Relationship: 20%
- Basic: 영업팀을 노골적으로 무시함. "현장도 모르면서"가 입버릇.
- Work style: (locked)
- Personal: (locked)
- Secret: 딸이 Yun이랑 동갑 취준생. 그래서 사실 Yun이 마음에 걸림.

Klaus Müller:
- Role: GermanParts · 구매팀장 · 독일
- Emoji: 🧑‍💼, bg: red-orange tint
- Tags: 까다로운 바이어, K-문화 덕후
- Trust: 45%
- Basic: 직설적이고 원칙적. 독일식 효율 최우선. 짧은 이메일 선호.
- Work style: 납기와 품질에 타협 없음. "I need specifics"가 입버릇.
- Personal: (locked)
- Secret: Sarah의 전 직장 동료. 한국 드라마를 딸한테 배워서 몰래 봄.

Min Choi (최민준):
- Role: 해외영업 동기 신입
- Emoji: 🧑‍💻, bg: teal tint
- Tags: 동기 라이벌, 찐친 예정
- Relationship: 55%
- Basic: 같은 날 입사한 동기. 영어는 Yun보다 잘하지만 실무 센스가 부족함.
- Work style: 영어 이메일은 빠르고 유창하게. 단 비즈니스 맥락 파악이 약함.
- Personal: (locked)
- Secret: 사실 해외영업이 적성이 아님. 부모님 권유로 지원했음.

---

### 7. USER PROFILE MODAL

Triggered by clicking user avatar at bottom of left sidebar.

Sections:
1. Profile header: avatar (editable), name, title, level badge
2. Personal info form (editable):
   - 학습 목표 (job goal dropdown: 취업준비/현직향상/자격증/재미)
   - 영어 수준 (beginner/intermediate/advanced)
   - 관심 산업 (manufacturing/beauty/IT/fashion/general)
   - 학습 동기 (free text, 100 chars)
   - 이름 (editable)
3. Stats section:
   - 총 XP, 연속 학습일, 완료 에피소드 수, 습득 표현 수
4. Badges section:
   - Grid of earned badges (filled) and locked badges (grayed)
   - First badges: 🎉 첫 로그인, 💬 첫 메시지, 📖 첫 표현 습득, 🔥 3일 연속, ✅ 첫 에피소드 완료

IMPORTANT: The user's personal info (goal, level, industry, motivation) must be stored and injected into the Claude AI system prompt when generating NPC responses. NPCs should naturally reference this info in conversation. Example: if user's industry interest is automotive, James might say "너 자동차 부품 쪽 관심있다고 했잖아, Müller가 딱이네"

---

## NPC DIALOGUE SYSTEM

Language toggle in top-left of main page:
- Two options only: 한국어 | English
- NO mixed mode

Korean mode NPC dialogue styles:
- Sarah: 세미격식 한국어. 짧고 명확. 이모지 거의 없음. 가끔 인간적인 한마디. Example: "Yun씨, 오늘 보고서 3시까지요. 수고해요."
- James: 친근한 한국어. 자연스러운 직장 선배 말투. 줄임말 가능. ㅋㅋ 가끔. Example: "야 그 이메일 벌써 보냈어? 나였으면 못 보냈다 ㅋㅋ"
- Min: 동기 친구 말투. 솔직하고 편함. Example: "나도 똑같은 실수했었는데 ㅠ 같이 밥 먹으면서 얘기하자"
- Lisa: 격식있고 정확한 한국어. 감정 표현 적음. Example: "Yun씨, L/C 서류 오타났어요. 세 번째예요."
- 박 과장: 짧고 무뚝뚝. 칭찬을 돌려서 함. Example: "...그나마 낫네."
- Klaus: English only regardless of language setting

English mode NPC dialogue styles:
- Sarah: Professional but warm English. Clear instructions. Minimal slang.
- James: Casual conversational English. Natural slang when it fits (not forced). Example: "Did you send that email yet? Honestly I would've chickened out."
- Min: Friendly casual English. Natural reactions. Example: "Wait that actually worked? Nice."
- Lisa: Precise formal English. Example: "The B/L has an error. This is the third time."
- 박 과장: Blunt, short English. Example: "That's not how it works. Do it again."
- Klaus: Formal professional English. Rare dry humor at high relationship. Example: "Efficient. I appreciate that."

RULES for all NPC dialogue:
- lol/omg/lmao etc: only use when it genuinely fits the moment, NEVER forced
- Each NPC's speech pattern must be consistent and recognizable
- Senior characters (Sarah, 박과장, Klaus) always more formal than peers
- Dialogue should feel like real people, not textbook examples

---

## GAME MECHANICS

### Time System
- Real-world clock maps to game time
- Before 9am: pre-work screen (countdown)
- 9am-6pm: active game time, clock shown in topbar
- After 6pm: end-of-day summary screen showing:
  - XP earned today
  - Expressions learned count
  - Relationship changes
  - Tomorrow's episode teaser (cliffhanger — one intriguing line)
- App closed = time paused
- Missed days: next login shows brief recap "X일 동안 자리를 비웠네요" + compressed briefing

### Relationship System
- Each NPC has relationship % (0-100)
- Changes based on:
  - Quality of English expressions used (+3 to +10)
  - Choices made in story (+5 to +15 for good choices)
  - Ignoring messages (-2)
  - Wrong/rude responses (-5)
- Relationship affects:
  - Info unlocked in character profiles
  - NPCs offering hints proactively
  - Story branches (high relationship = better outcomes)
  - NPCs referencing past conversations

### XP & Level System
- Expression learned: +20 XP
- Good response: +30 XP  
- Episode complete: +50 XP
- Daily login: +10 XP
- Streak bonus: +5 XP per day
- Levels: 0-200 Intern → 200-500 Junior → 500-1000 Senior → 1000+ Manager

### Badge System
Badges with unlock conditions:
- 🎉 입사 완료: Complete onboarding
- 💬 첫 대화: Send first message
- 📖 표현 마스터: Learn first expression
- 🔥 3일 연속: 3-day login streak
- 🔥 7일 연속: 7-day streak
- ✅ EP완료: Complete first episode
- 🤝 첫 답장: Receive first reply from Klaus
- 📝 노트 기록: Save first work note
- 🌟 네이티브: Use a native-level expression

### Hint System (replaces choice buttons)
- 💡 button in chat input area
- When clicked: popup shows 2-3 contextually relevant expressions
- Each hint shows: English expression + Korean translation + situation tag
- Auto-popup appears when receiving work instructions (one-time, dismissable)
- Expressions in hints are tracked — if user incorporates them, award XP

---

## EPISODE CONTENT — Season 1

S1·EP01 — First Day Jitters (입사 첫날):
NPC messages sequence (Korean mode):
James: "오셨어요! 저 박준혁 대리예요 — James라고 불러주세요. 자리 바로 옆이에요 ㅋ"
James: "첫날이죠? 너무 긴장 안 하셔도 돼요. 다들 좋은 분들이에요 — 박 과장님만 빼고요 ㅎㅎ"
James: "팀장님한테 말씀드릴 때는 짧게 요점만 말하는 게 포인트예요. 길게 설명하면 좋아하지 않으세요 😅"
James: "참, 오늘 오전에 신규 바이어 리스트 정리 부탁하실 것 같더라고요. 미리 알아두세요~"
Sarah: "Yun씨, 오셨어요. 자리 안내받았죠? 오늘은 팀 업무 파악하고, 오후에 바이어 DB 정리 부탁드려요."

Today's expressions (EP01):
1. "Nice to meet you. I'm [name], new to the overseas sales team." — 첫 자기소개
2. "Could you walk me through the process?" — 도움 요청
3. "I apologize for the confusion. I'll make sure it doesn't happen again." — 실수 수습
4. "Just to confirm — the deadline is this Friday, correct?" — 업무 확인
5. "I'll get right on it." — 업무 수락

S1·EP02 — The Unwritten Rules:
James gives insider tips about office culture, 박과장 first encounter, Min introduces himself

S1·EP03 — First Assignment:
Sarah assigns buyer research task, James gives KOTRA tips, Min is also assigned same task (rivalry begins)

S1·EP04 — Cold Email Draft:
Writing first cold email to GermanParts, James reviews draft, Sarah gives feedback

S1·EP05 — The Long Silence:
Two weeks no reply from Klaus, learning follow-up expressions, Min gets a reply first (complex emotions)

S1·EP06 — Klaus Replies:
Klaus sends short, direct reply, Sarah's strange reaction (foreshadowing), learning response expressions

---

## CLAUDE API INTEGRATION

For live NPC responses, use Claude API with this structure:

System prompt template:
```
You are [NPC_NAME] at KoraTrade, a Korean trading company.

Your character:
- Role: [ROLE]
- Personality: [PERSONALITY]
- Speech style: [SPEECH_STYLE based on language setting]
- Current relationship with user: [RELATIONSHIP]%
- Your secret (never reveal directly, but can hint): [SECRET]

User profile:
- Name: [USER_NAME]
- Goal: [USER_GOAL]
- English level: [LEVEL]
- Industry interest: [INDUSTRY]

Current episode: [EPISODE]
Current situation: [SITUATION]

Rules:
- Stay completely in character
- Reference user's personal info naturally when relevant
- Match speech style to relationship level (more casual as relationship grows)
- Keep responses concise (2-4 sentences max)
- In Korean mode: respond in Korean matching your character's formality level
- In English mode: respond in English matching your character's formality level
- Never break character or mention you are AI
- Never reveal secrets directly
```

---

## MISSING FEATURES TO IMPLEMENT (previously confirmed but not yet built)

1. ✅ Character profiles page with progressive unlock
2. ✅ NPC hover popup in sidebar  
3. ✅ User profile modal with personal info that affects NPC responses
4. ✅ Time system (pre-work, work hours, end of day)
5. ✅ Full work notes page with 4 tabs
6. ✅ Badge system
7. ✅ KakaoTalk-style message grouping (no repeated avatars for consecutive messages)
8. ✅ Expression cards toggle (click to check/uncheck + brief undo)
9. ✅ Language setting (Korean/English only, no Mix)
10. ✅ Natural NPC dialogue per character's position/personality
11. ✅ Hint popup system (no multiple choice buttons)
12. ✅ End of day summary with cliffhanger
13. ✅ Resizable sidebars (drag handles)

Please build the complete app with ALL of the above. Start with the core pages: login, onboarding, commute, main chat, then add characters and notes pages. Make sure all features listed are implemented.
