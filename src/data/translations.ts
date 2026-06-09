export type UILang = 'korean' | 'english'

export const translations = {
  korean: {
    // Episode selection
    episodeSelect: '에피소드 선택',
    season: '시즌',
    continueEpisode: '이어하기',
    reviewEpisode: '복습하기',
    startEpisode: '플레이 시작',
    locked: '잠금',
    completed: '완료',
    inProgress: '진행중',
    backToEpisodes: '← 에피소드 선택',

    // Sidebar labels
    todaysGoals: '오늘의 학습목표',
    todaysMissions: '오늘의 미션',
    todaysExpressions: '오늘의 표현',
    workNotes: '업무 노트',
    xpSummary: '오늘 획득 XP',

    // Chat
    sendMessage: '보내기',
    notes: '노트',
    people: '인물',
    progress: '진행',
    chat: '채팅',
    phase: '단계',

    // Mission status
    missionAll: '모든 미션 완료! 🎉',
    missionEpisode: '에피소드 미션',

    // Expressions
    learnedCount: '학습 완료',
    clickToLearn: '클릭하면 +{xp} XP',

    // Email
    writeReportEmail: '보고 이메일 작성',
    emailSubject: '제목 (Subject)',
    emailGreeting: '인사말 (Greeting)',
    emailBody: '본문 (Body)',
    emailClosing: '맺음말 (Closing)',
    emailSubmit: '제출하기',
    emailGrading: '채점 중...',
    emailRevise: '수정하기',
    emailClose: '닫기',
    emailDone: '완료',
    emailStrength: '✓ 잘한 점',
    emailFeedback: '💡 개선 포인트',
    emailSuggestedOpening: '✏️ 수정 예시 (첫 문장)',
    emailShowScore: '점수 확인하기',
    emailFinalScore: '최종 점수',
    emailPass: '통과! 이메일 발송 가능 ✓',
    emailFail: '80점 이상 필요 — 수정해 보세요',
    emailErrors: '문법 & 언어 오류',
    emailStructure: '구조 피드백',
    emailVocab: '어휘 개선 제안',
    emailOverall: '종합 코멘트',
    emailCorrected: '수정된 버전',

    // Objectives
    goalAchieved: '목표 달성! ✓',

    // Language selection
    chooseLanguage: '학습 언어를 선택하세요',
    languageKorean: '한국어',
    languageEnglish: 'English',
    languageHintKo: 'UI와 힌트가 한국어로 표시됩니다',
    languageHintEn: 'UI and hints in English',
  },
  english: {
    // Episode selection
    episodeSelect: 'Select Episode',
    season: 'Season',
    continueEpisode: 'Continue',
    reviewEpisode: 'Review',
    startEpisode: 'Start Episode',
    locked: 'Locked',
    completed: 'Completed',
    inProgress: 'In Progress',
    backToEpisodes: '← Episodes',

    // Sidebar labels
    todaysGoals: "Today's Goals",
    todaysMissions: "Today's Missions",
    todaysExpressions: "Today's Expressions",
    workNotes: 'Work Notes',
    xpSummary: 'XP Earned Today',

    // Chat
    sendMessage: 'Send',
    notes: 'Notes',
    people: 'People',
    progress: 'Progress',
    chat: 'Chat',
    phase: 'Phase',

    // Mission status
    missionAll: 'All missions complete! 🎉',
    missionEpisode: 'Episode Missions',

    // Expressions
    learnedCount: 'Learned',
    clickToLearn: 'Click for +{xp} XP',

    // Email
    writeReportEmail: 'Write Report Email',
    emailSubject: 'Subject',
    emailGreeting: 'Greeting',
    emailBody: 'Body',
    emailClosing: 'Closing',
    emailSubmit: 'Submit',
    emailGrading: 'Grading...',
    emailRevise: 'Revise',
    emailClose: 'Close',
    emailDone: 'Done',
    emailStrength: '✓ Strength',
    emailFeedback: '💡 Feedback',
    emailSuggestedOpening: '✏️ Suggested opening',
    emailShowScore: 'See Your Score',
    emailFinalScore: 'Final Score',
    emailPass: 'Pass! Email approved ✓',
    emailFail: 'Need 80+ to pass — try revising',
    emailErrors: 'Grammar & Language Errors',
    emailStructure: 'Structure Feedback',
    emailVocab: 'Vocabulary Suggestions',
    emailOverall: 'Overall Advice',
    emailCorrected: 'Corrected Version',

    // Objectives
    goalAchieved: 'Goals achieved! ✓',

    // Language selection
    chooseLanguage: 'Choose your interface language',
    languageKorean: '한국어',
    languageEnglish: 'English',
    languageHintKo: 'UI and hints in Korean',
    languageHintEn: 'UI and hints in English',
  },
} as const

export type TranslationKey = keyof typeof translations.korean

export function tr(key: TranslationKey, lang: UILang): string {
  return (translations[lang] as Record<string, string>)[key] ?? (translations.korean as Record<string, string>)[key] ?? key
}
