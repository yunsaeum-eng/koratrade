# KoraTrade — 대대적 개편 지시서
# Claude Code에 이 파일 내용을 통째로 붙여넣어줘

---

Read every source file in the project thoroughly before making any changes. Then implement ALL of the following in one go.

---

## TASK 1 — Episode Selection Screen (에피소드 선택 화면)

### 1-1. New route: /main (현재 플레이 화면을 대체)
After commute redirect, go to `/main` which shows the Episode Selection Screen instead of jumping straight into the chat.

### 1-2. Episode Selection Screen layout
- Header: KoraTrade logo + user profile icon
- Season tabs: Season 1, Season 2, ... (only show seasons that have at least one unlocked episode)
- Episode list per season:
  - Each episode card shows:
    - Episode number + title (e.g. "EP1 · 첫 출근, 자기소개")
    - Status badge: 완료(done) / 진행중(in progress) / 🔒잠금(locked)
    - Key missions preview (3 pills shown, e.g. "James에게 자기소개", "Sarah 이메일 초안")
    - XP earned / total XP for this episode
  - Completed episodes show "복습하기 →" button
  - Current in-progress episode shows "이어하기 →" button  
  - Locked episodes are grayed out and not clickable
- Unlock logic: EP1 always unlocked. Each subsequent episode unlocks when the previous episode's key missions are all completed (completedMissionIds includes all missions for that episode)

### 1-3. New route: /play/[episodeId] (에피소드 플레이 화면)
Clicking "플레이 시작" / "이어하기" / "복습하기" navigates to `/play/[episodeId]`

This page shows:
- Top bar: "← 에피소드 선택" back button | Episode title | Day + game time
- Key missions bar: horizontal scrollable pills showing this episode's missions with ✓ if completed
- Then the existing MainLayout (chat, notes, people, progress tabs) — but scoped to this episode

### 1-4. Episode isolation
- Each episode has its own chat history scoped by episodeId
- When entering an episode, load only that episode's chat history from Supabase (filter by episode_id)
- When saving chat messages, include episode_id in the record
- Add `episode_id` column to `chat_history` table in Supabase:
  ```sql
  ALTER TABLE chat_history ADD COLUMN IF NOT EXISTS episode_id text;
  ```
- Learning goals (오늘의 학습목표) reset to unchecked when switching episodes — they should only be checked when the user actually completes them via gameplay, never auto-checked
- Expressions (오늘의 표현) in the right sidebar always show the CURRENT episode's expressions only, never carry over from previous episodes
- NPC system prompt receives the correct episodeId so context is always episode-specific

### 1-5. Episode data
Use the existing `src/data/episodes.ts` and `src/data/missions.ts`. Map each episode's key missions from `MISSION_DEFS`. The episode card should show the top 3 missions as preview pills.

---

## TASK 2 — Email Feedback Overhaul (이메일 피드백 상세화)

### Current problem
When user submits an email, a score appears immediately without showing what was wrong or how to improve.

### Required behavior
When user sends an email (hits Send in email mode):
1. Show a detailed feedback panel FIRST (before score):
   - **Corrected version**: Show the full corrected email with changes highlighted (use a diff-style: strikethrough original, green for correction)
   - **Grammar & language errors**: List each error with explanation (e.g. "❌ 'I am writing to you' → ✅ 'I am writing to inquire about...' — more specific opener")
   - **Structure feedback**: Comment on greeting, body, closing (e.g. "Opening is too abrupt — add context sentence")
   - **Vocabulary suggestions**: Suggest more professional alternatives for any casual words used
   - **Overall advice**: 2-3 sentences of high-level coaching

2. THEN show the score + pass/fail AFTER the user reads the feedback (add a "점수 확인하기" button at the bottom of feedback)

3. Update `src/app/api/grade-email/route.ts` to return this richer structure:
```typescript
{
  score: number,
  pass: boolean,
  feedback: {
    correctedEmail: string,
    errors: Array<{ original: string, corrected: string, explanation: string }>,
    structureFeedback: { greeting: string, body: string, closing: string },
    vocabularySuggestions: Array<{ original: string, better: string }>,
    overallAdvice: string,
    topStrength: string
  }
}
```

4. Update the email grading UI in `ChatPane.tsx` to show this feedback panel before the score.

---

## TASK 3 — iPad Text Selection Popup (아이패드 텍스트 선택 팝업)

### Current problem
On desktop, dragging/selecting text in NPC messages shows an inline lookup popup (word meaning + add to notes). On iPad/touch devices this doesn't work.

### Fix
In `src/components/chat/InlineLookup.tsx` (or wherever the text selection popup is handled):
- Detect touch devices using `'ontouchstart' in window` or `navigator.maxTouchPoints > 0`
- On touch devices, listen for `selectionchange` event on the document
- When text is selected (selection is not empty and is within a chat message), show the lookup popup positioned near the selection
- Use `document.getSelection()` to get selected text and `getBoundingClientRect()` on the range to position the popup
- The popup should show: word/phrase meaning (call existing lookup API) + "노트에 추가" button
- Make sure the popup doesn't get hidden behind the keyboard on iPad

---

## TASK 4 — Language System Overhaul (언어 설정)

### Goal
Support two user groups:
- 🇰🇷 Korean users: learning business English, UI in Korean, hints/explanations in Korean
- 🌏 English-speaking users (e.g. Filipino engineers): learning business English, UI fully in English, hints/explanations in English

### 4-1. Onboarding language selection
In `src/app/onboarding/page.tsx`, add a language selection step:
- "학습 언어를 선택하세요 / Choose your interface language"
- Options: 한국어 (Korean) | English
- Save to Supabase `profiles` table as `ui_language` column:
  ```sql
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ui_language text DEFAULT 'korean';
  ```

### 4-2. UI language application
Create `src/contexts/LanguageContext.tsx` (or update existing `src/hooks/useLanguage.ts`):
- Load `ui_language` from user profile on login
- Provide `t(key)` translation function throughout the app
- All UI strings (mission names, learning goal labels, expression labels, tab names, button text, sidebar headers) must use `t()` 

### 4-3. Translation strings
Create `src/data/translations.ts` with full Korean/English translation map:
```typescript
export const translations = {
  korean: {
    todaysGoals: '오늘의 학습목표',
    todaysMissions: '오늘의 미션',
    todaysExpressions: '오늘의 표현',
    episodeSelect: '에피소드 선택',
    continueEpisode: '이어하기',
    reviewEpisode: '복습하기',
    startEpisode: '플레이 시작',
    locked: '잠금',
    completed: '완료',
    inProgress: '진행중',
    sendMessage: '보내기',
    notes: '노트',
    people: '인물',
    progress: '진행',
    chat: '채팅',
    // ... add all strings
  },
  english: {
    todaysGoals: "Today's Goals",
    todaysMissions: "Today's Missions",
    todaysExpressions: "Today's Expressions",
    episodeSelect: 'Select Episode',
    continueEpisode: 'Continue',
    reviewEpisode: 'Review',
    startEpisode: 'Start Episode',
    locked: 'Locked',
    completed: 'Completed',
    inProgress: 'In Progress',
    sendMessage: 'Send',
    notes: 'Notes',
    people: 'People',
    progress: 'Progress',
    chat: 'Chat',
    // ... add all strings
  }
}
```

### 4-4. NPC language
When `ui_language === 'english'`, the chat API should default to English responses (no Korean mixed in). Pass `ui_language` to the chat API and adjust NPC prompts accordingly — English users get pure English NPC responses, Korean users get the existing Korean/English mixed mode.

### 4-5. English mode adjustments
In English mode:
- Episode titles, mission names, expression names all show in English
- NPC hints and learning tips are in English
- The professionalism rule in the chat API system prompt switches to English-only version
- Email grading feedback is returned in English

---

## TASK 5 — NPC Repetition Fix (NPC 반복 대사 방지)

Already partially fixed but ensure:
- Fallback messages ("Sorry, could you say that again?") are NEVER saved to `chat_history` in Supabase
- Fallback messages are filtered out when loading chat history
- Short user messages like "ok", "got it", "great", "thanks", "알겠어", "좋아" — NPC should acknowledge briefly and move conversation forward, NEVER respond with confusion/fallback
- Add this rule to ALL NPC system prompts in `src/app/api/chat/route.ts`

---

## TASK 6 — Learning Goals Fix (학습목표 자동체크 방지)

- Learning goals (오늘의 학습목표) must NEVER auto-check
- They should only check when the user actually completes the corresponding mission through gameplay
- When switching to a different episode, all learning goals reset to unchecked
- The check state is tied to `completedMissionIds` in game state — only missions in that array should show as checked

---

## Supabase SQL to run BEFORE deploying
Run this in Supabase SQL Editor:
```sql
ALTER TABLE chat_history ADD COLUMN IF NOT EXISTS episode_id text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ui_language text DEFAULT 'korean';
UPDATE profiles SET ui_language = 'korean' WHERE ui_language IS NULL;
```

---

## After implementing all tasks:
```
git add -A && git commit -m "feat: episode selection screen, email feedback overhaul, iPad text selection, language system, NPC fixes" && git push
```
