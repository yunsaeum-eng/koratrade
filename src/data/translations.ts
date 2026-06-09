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

    // Sidebar / navigation
    channels: '채널',
    direct: '다이렉트',
    relationship: '관계도',
    logout: '퇴근',
    afterWork: '퇴근 🏠',
    editProfile: '프로필 수정',
    resetProgress: '처음부터 다시 시작',
    deleteAccount: '회원 탈퇴',
    logoutMenu: '로그아웃',
    cancel: '취소',
    confirmReset: '진행상황을 초기화할까요?',
    resetWarning: 'XP, 관계도, 에피소드가 삭제됩니다. 계정은 유지됩니다.',
    doReset: '초기화하기',
    confirmDelete: '정말 탈퇴하시겠어요?',
    deleteWarning: '모든 데이터가 삭제됩니다.',
    doDelete: '탈퇴하기',

    // Characters / levels
    femaleCharacter: '여성 캐릭터',
    maleCharacter: '남성 캐릭터',
    beginnerLevel: '초급',
    intermediateLevel: '중급',
    advancedLevel: '고급',

    // Save states
    save: '저장하기',
    saving: '저장 중...',
    saved: '✓ 저장됨',
    saveFailed: '저장에 실패했습니다. 다시 시도해주세요.',

    // Profile modal
    badges: '획득한 배지',
    levelStatus: '레벨 현황',
    learningProfile: '학습 프로필',
    careerGoal: '커리어 목표',
    englishLevel: '영어 수준',
    industry: '관심 산업',
    learningReason: '학습 동기',

    // Mission labels
    episodeMissions: '에피소드 미션',
    allMissionsDone: '모든 미션 완료! 🎉',
    undoMission: '이 미션 취소',
    autoProgress: '이 단계는 자동으로 진행됩니다...',

    // End of day screen
    endOfDay: '오늘 업무 종료',
    wellDone: '수고했어요!',
    dailySummary: '오늘의 결산',
    totalXp: '총 XP',
    expressionsLearned: '학습 표현',
    level: '레벨',
    tomorrowPreview: '내일 예고 🎬',
    continueUsing: '계속 이용하기 →',
    allFeaturesAvailable: '모든 기능은 정상적으로 이용 가능합니다',

    // Pre-work screen
    beforeWork: '출근 전입니다',
    workHoursInfo: '업무 시간은 09:00~18:00 입니다',
    untilWork: '출근까지',
    earlyEntry: '미리 입장하기 (테스트)',
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

    // Sidebar / navigation
    channels: 'Channels',
    direct: 'Direct',
    relationship: 'Relationship',
    logout: 'Log out',
    afterWork: 'Off work 🏠',
    editProfile: 'Edit Profile',
    resetProgress: 'Reset progress',
    deleteAccount: 'Delete account',
    logoutMenu: 'Log out',
    cancel: 'Cancel',
    confirmReset: 'Reset your progress?',
    resetWarning: 'XP, relationships, and episodes will be deleted. Your account remains.',
    doReset: 'Reset',
    confirmDelete: 'Delete your account?',
    deleteWarning: 'All data will be deleted.',
    doDelete: 'Delete',

    // Characters / levels
    femaleCharacter: 'Female character',
    maleCharacter: 'Male character',
    beginnerLevel: 'Beginner',
    intermediateLevel: 'Intermediate',
    advancedLevel: 'Advanced',

    // Save states
    save: 'Save',
    saving: 'Saving...',
    saved: '✓ Saved',
    saveFailed: 'Failed to save. Please try again.',

    // Profile modal
    badges: 'Badges Earned',
    levelStatus: 'Level Status',
    learningProfile: 'Learning Profile',
    careerGoal: 'Career Goal',
    englishLevel: 'English Level',
    industry: 'Industry',
    learningReason: 'Learning Motivation',

    // Mission labels
    episodeMissions: 'Episode Missions',
    allMissionsDone: 'All missions complete! 🎉',
    undoMission: 'Undo mission',
    autoProgress: 'This phase progresses automatically...',

    // End of day screen
    endOfDay: 'Work Day Over',
    wellDone: 'Great work!',
    dailySummary: "Today's Summary",
    totalXp: 'Total XP',
    expressionsLearned: 'Expressions',
    level: 'Level',
    tomorrowPreview: "Tomorrow's Preview 🎬",
    continueUsing: 'Continue →',
    allFeaturesAvailable: 'All features are available',

    // Pre-work screen
    beforeWork: 'Before Work Hours',
    workHoursInfo: 'Work hours are 09:00–18:00',
    untilWork: 'Time until work',
    earlyEntry: 'Enter early (test)',
  },
} as const

export type TranslationKey = keyof typeof translations.korean

export function tr(key: TranslationKey, lang: UILang): string {
  return (translations[lang] as Record<string, string>)[key] ?? (translations.korean as Record<string, string>)[key] ?? key
}
