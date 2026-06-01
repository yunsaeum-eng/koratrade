# KoraTrade — 완전 마스터 명세서 v3.0
# 이 문서가 모든 개발의 기준이 됩니다

---

# PART 1. 프로젝트 철학

## 핵심 원칙

1. **학습이 먼저다**: UI, 스토리, 게임성보다 학습 효과가 최우선
2. **맥락 속 체득**: "외워라"가 아니라 상황 속에서 자연스럽게 습득
3. **빌드업 필수**: 모든 미션은 앞선 스토리가 자연스럽게 이끌어야 함
4. **자료의 실제성**: 모든 문서/자료는 실제 업무에서 쓰이는 것과 동일한 품질
5. **프로그램이 주도**: 미션 완료 판단, 스토리 진행을 프로그램이 자율적으로 함
6. **사용자는 따라가기만**: 지시를 따라가다 보면 저절로 학습이 완료되는 구조

---

# PART 2. 세계관 설정

## 회사: KoraTrade Inc.

| 항목 | 내용 |
|------|------|
| 회사명 | KoraTrade Inc. (주식회사 코라트레이드) |
| 설립 | 2018년 (스타트업 출신, 6년차 브랜드) |
| 대표 | 황성민 |
| 소재지 | 서울특별시 성동구 성수일로 89, 4층 |
| 직원 수 | 38명 |
| 업종 | K-애슬레저 브랜드 해외영업 (자사 제품 직접 판매) |
| 주력 제품 | 레깅스, 러닝웨어, 요가복, 스포츠 잡화 |
| 브랜드 포지션 | 룰루레몬보다 합리적 가격 + K-디자인 + 아시안핏 |
| 주요 시장 | 일본(35%), 동남아(30%), 호주(20%), 유럽(15%) |
| 연매출 | 약 280억원 (2023) |
| 특징 | 성수동 스타트업 분위기, 수평적 문화, 빠른 의사결정 |

## 브랜드 스토리

```
2018년 창업자 황성민이 필라테스 강사 출신 아내의 
"한국에 룰루레몬 같은 브랜드가 없다"는 말에서 시작.
아시안 체형에 맞는 핏 + 한국 특유의 컬러감으로 차별화.
현재 일본, 싱가포르, 호주에 팝업스토어 운영 중.
유럽 진출이 이번 해의 최대 목표.
```

---

# PART 3. 등장인물 (NPC)

## 사내 팀원

### 김사라 (Sarah Kim) — 해외영업팀장, 10년차
```
나이: 36세
성격: 냉철하지만 따뜻함. 말수 적고 결과로 말함
말투 (한국어): 세미격식 존댓말. 짧고 명확.
말투 (영어): Professional, concise, warm undertone
담당: 팀 총괄, 유럽 시장 전략, 주요 바이어 관계 관리
숨겨진 서사: 전 직장 (룰루레몬 한국지사)에서 Sophie와 
             같이 일한 적 있음. 아무도 모름.
관계도 시작: 30%
```

### 박준혁 (James Park) — 해외영업 대리, 3년차
```
나이: 28세
성격: 친근하고 유머있음. 가끔 덜렁거림
말투 (한국어): 친근한 직장 선배. 존댓말 기본이나 자연스러운 말투
말투 (영어): Casual professional. Natural, not forced
담당: 일본, 동남아 시장 영업
숨겨진 서사: 이직 준비 중. 플레이어한테만 고백
관계도 시작: 50%
```

### 이지수 (Lisa Lee) — 브랜드/마케팅팀, 5년차
```
나이: 31세
성격: 꼼꼼하고 원칙적. 감정 표현 서툼. 고양이 집사
말투: 격식있고 정확. 짧게 말함
담당: 브랜드 가이드라인, 제품 카탈로그, 해외 마케팅 자료
숨겨진 서사: 해외영업팀 오고 싶어함. 플레이어가 롤모델
관계도 시작: 20%
```

### 박철수 과장 — 물류/운영팀, 15년차
```
나이: 47세
성격: 무뚝뚝하고 직설적. 처음엔 적대적
말투: 짧고 블런트. 감정 없음
담당: 선적, 물류, 통관, 재고 관리
숨겨진 서사: 딸이 플레이어와 동갑 취준생. 속으로 챙김
관계도 시작: 10%
```

### 최민준 (Min Choi) — 동기 신입
```
나이: 25세 (플레이어와 동갑)
성격: 솔직하고 불안함. 친해지면 찐친
말투: 친구같은 직장 동료. 격식 기본이나 편한 표현
담당: 미주 시장 영업 보조
숨겨진 서사: 적성 아님. 진짜 하고 싶은 것 있음
관계도 시작: 55%
```

## 해외 바이어 NPC

### Sophie Beaumont — 프랑스 바이어
```
소속: Galeries Lafayette (갤러리 라파예트) 스포츠 편집숍 바이어
나이: 42세
국적: 프랑스
성격: 품질과 디자인 최우선. 느린 의사결정. 관계 중시
말투: 격식 영어. 감정 표현 절제. 미적 감각 언급 많음
숨겨진 서사: Sarah의 전 직장 동료. S3에서 밝혀짐
신뢰도 시작: 0% (S2부터 등장)
특이점: 프랑스어 간단한 인사 섞음 ("Bonjour", "Merci")
```

### Jake Williams — 미국 바이어
```
소속: FitPro Distribution (미국 피트니스 유통사)
나이: 35세
국적: 미국
성격: 빠른 결정. 숫자와 데이터 중심. 직설적
말투: 캐주얼 비즈니스 영어. 효율 중시
신뢰도 시작: 0% (S3부터 등장)
```

### Aiko Tanaka — 일본 바이어
```
소속: Sports Avenue Japan
나이: 38세
국적: 일본
성격: 꼼꼼하고 정중함. 품질 민감. 관계 중시
말투: 격식 영어. 배려심 넘침
신뢰도 시작: 0% (S2부터 등장)
```

---

# PART 4. 학습 설계 원칙 (가장 중요)

## 원칙 1 — 빌드업 3단계 필수

모든 미션은 반드시 이 순서를 따른다:

```
① 씨앗 (Seed): NPC 대화에서 관련 맥락 자연스럽게 등장
② 필요성 (Need): 사용자가 "이걸 해야겠구나" 느끼는 순간
③ 실행 (Action): 그제서야 미션 등장 → 전혀 어색하지 않음
```

예시:
```
[씨앗] James: "팀장님은 보고받을 때 수치 좋아하세요"
[필요성] Sarah: "오늘 브랜드 소개서 읽고 궁금한 것 정리해두세요"
[실행] Sarah: "간단히 이메일로 검토 내용 보내줘요"
→ 보고 이메일 미션 등장 — 완전히 자연스러움
```

## 원칙 2 — 자료 품질 기준

모든 제공 자료는 반드시:
```
✓ 실제 애슬레저 업계에서 쓰이는 형식과 동일
✓ 구체적 수치/날짜/스펙 포함 (추상적 설명 금지)
✓ A4 1장 이상 충분한 분량
✓ 전문 용어 포함 (클릭하면 팝업 설명)
✓ 사전 가이드라인 → 자료 → 사후 미션 세트로 구성
✓ 자료 내에 다음 미션에서 활용할 내용 포함
```

## 원칙 3 — 표현 3회 이상 반복

각 에피소드의 핵심 표현 5개는:
```
1회: NPC 대화에서 자연스럽게 등장 (노출)
2회: 힌트 팝업으로 설명 (이해)
3회: 사용자가 직접 사용 (체득)
4-5회 (보너스): 다른 맥락에서 변형 등장 (심화)
```

## 원칙 4 — 미션 자동 감지

사용자가 직접 체크하지 않는다.
프로그램이 대화 내용을 분석해서 자동으로 완료 처리.

```
미션 감지 방법:
→ Claude API로 대화 분석
→ 사용자 행동/발화 기반 판단
→ 완료 시 자동 체크 애니메이션
→ 다음 스토리 자동 트리거
```

## 원칙 5 — 혼합 학습 방식

```
스크립트 구간 (NPC 대화, 상황 전개):
→ 선택지 제공 (A/B/C)
→ 선택에 따라 관계도 변화, 스토리 분기

자유 입력 구간 (핵심 실습):
→ 이메일 직접 작성
→ 영어로 바이어에게 답장
→ 보고서 작성
→ Claude API로 자동 채점 + 피드백
```

## 원칙 6 — 에피소드 내 학습 흐름

하루 에피소드 약 60-90분:
```
Phase 1 (10분): 출근 + 오늘 상황 파악 + 그룹챗 확인
Phase 2 (20분): 사내 소통 (사담 + 업무 대화) + 표현 첫 노출
Phase 3 (25분): 자료 읽기 + 핵심 업무 실습 + 미션 수행
Phase 4 (15분): 표현 실전 적용 (이메일 작성 or 바이어 소통)
Phase 5 (10분): 마무리 + 피드백 + 하루 정산 + 내일 예고
```

---

# PART 5. 전체 시즌/에피소드 커리큘럼

## S1 — 입사 온보딩 (7 episodes)

### 시즌 목표
```
완료 후 가능한 것:
✓ 직장 내 기본 커뮤니케이션 (상사/동료/타부서)
✓ 모르는 것 물어보기, 실수 수습, 업무 확인 표현
✓ 비즈니스 이메일 5가지 유형 작성
✓ KoraTrade 브랜드와 제품 기본 이해
```

### EP01 — 첫날 (First Day)
```
스토리: 입사 첫날. James 만남. 사무실 투어. Sarah 첫 미팅.
        브랜드 소개서 읽기. 첫 보고 이메일 작성.

핵심 표현 5개:
1. "Nice to meet you. I'm [name], new to the overseas sales team."
2. "Could you show me how this works?"
3. "Thank you so much for your help."
4. "I'll get right on it."
5. "Just to confirm — I should finish this by end of day, correct?"

제공 자료:
- KoraTrade 브랜드 소개서 (회사 개요, 제품 라인업, 주요 시장, 경쟁 포지션)
- 해외영업팀 조직도
- 비즈니스 이메일 기초 가이드

핵심 미션:
- James에게 자기소개
- Sarah에게 첫 업무 확인
- 브랜드 소개서 읽기 (가이드라인 따라)
- 보고 이메일 작성 (80점 이상 통과)

빌드업:
09:00 James 만남 → 09:30 Sarah 업무 지시 → 10:00 자료 제공
→ 10:30 James "Sarah는 수치 좋아해" 힌트
→ 13:00 보고 이메일 미션 (완전히 자연스러움)

에피소드 이벤트:
James가 전체 단톡에 실수로 개인 메시지 발송 → 사무실 웃음바다
```

### EP02 — 첫 주 생존 (Survival Week)
```
스토리: 첫 주. 박 과장 첫 충돌. Lisa 첫 만남.
        바이어 DB 정리 보조. 첫 실수와 수습.

핵심 표현 5개:
1. "I'm not entirely sure — could you clarify?"
2. "I apologize for the mistake. I'll make sure it doesn't happen again."
3. "Could I ask you something? I want to make sure I understand correctly."
4. "I might be missing something, but would it be possible to...?"
5. "I'll look into it and get back to you."

제공 자료:
- 바이어 DB 양식 (회사명, 국가, 담당자, 연락처, 제품 관심사, 거래상태)
- 타부서 협업 이메일 템플릿
- 직장 문화 노트 (보고 체계, 호칭 사용법)

핵심 미션:
- 바이어 DB 오류 찾고 보고하기
- 박 과장에게 물류 일정 문의 (정중하게)
- Lisa에게 카탈로그 자료 요청하기
- 팀 미팅 참석 (그룹챗에서 진행)

에피소드 이벤트:
팀 미팅에서 Sarah와 박 과장 간 묘한 긴장감 (복선)
Min이 "나도 모르겠어" 처음으로 속마음 털어놓음
```

### EP03 — 제품 완전 정복 (Product Expert)
```
스토리: Sarah가 "제품 모르면 영업 못 한다"고 지시.
        컬렉션 라인업, 소재 기술, 경쟁사 분석.
        첫 번째 제품 소개 이메일 작성.

핵심 표현 5개:
1. "I'd like to report on the progress of [task]."
2. "Would it be alright if I asked for your feedback on this?"
3. "I've completed the first draft. Please let me know if changes are needed."
4. "I was wondering if there's a better approach to this."
5. "I'll have it ready by [time/date]."

제공 자료:
- KoraTrade 시즌 컬렉션 카탈로그 (제품별 소재, 가격, MOQ, 납기)
- 경쟁사 비교표 (룰루레몬 vs KoraTrade vs 안다르)
- 제품 소개 이메일 템플릿

핵심 미션:
- 컬렉션 카탈로그 분석 (가이드라인 따라)
- 경쟁사 대비 KoraTrade 강점 3가지 정리
- 제품 소개 이메일 초안 작성
- James, Sarah 피드백 반영 후 최종본 완성

에피소드 이벤트:
Min이 경쟁사 비교에서 실수 → Sarah 지적
"제품을 모르면 바이어를 설득할 수 없다"
```

### EP04 — 사내 네트워킹 (Office Relationships)
```
스토리: 타부서와 첫 협업. 박 과장에게 납기 문의.
        Lisa와 관계 개선. 사내 정치 배우기.

핵심 표현 5개:
1. "I understand you're very busy, but could you help me with...?"
2. "This is time-sensitive — could you give me an ETA?"
3. "I really appreciate your help on this."
4. "Would you be available for a quick chat about...?"
5. "I'll make sure to return the favor."

제공 자료:
- 타부서 협업 요청 이메일 템플릿
- ETA, MOQ, SKU 등 실무 약어 정리
- 직장 내 부탁 문화 가이드

핵심 미션:
- 박 과장에게 선적 일정 확인 이메일 발송
- Lisa에게 카탈로그 영문 버전 요청
- 박 과장 거절 시 대안 찾기
- Sarah에게 협업 결과 보고

에피소드 이벤트:
박 과장이 처음으로 플레이어에게 작은 팁을 줌 (관계 변화 시작)
Lisa가 고양이 사진을 단톡에 올리는 뜻밖의 모습
```

### EP05 — 이메일 완전 정복 (Email Mastery)
```
스토리: Sarah가 이메일이 영업의 얼굴이라고 강조.
        5가지 이메일 유형 집중 훈련.

핵심 이메일 유형 5가지:
1. 정보 요청 (Information Request)
2. 팔로업 확인 (Follow-up/Confirmation)
3. 사과 수정 (Apology)
4. 감사 (Thank You)
5. 진행 보고 (Status Update)

제공 자료:
- 비즈니스 이메일 5유형 완전 가이드
- 좋은 이메일 vs 나쁜 이메일 비교 10쌍
- 이메일 제목줄 작성법
- 이메일 발송 전 체크리스트

핵심 미션:
- 5가지 유형 각각 실제 작성 (각 80점 이상)
- James, Sarah 피드백 받기
- 최종본 완성

에피소드 이벤트:
James가 Reply All 실수로 대표님에게 불만 이메일 전송 → 긴장
"Reply All 절대 조심" 실무 팁 자연스럽게 체득
```

### EP06 — 직장 생존 영어 (Workplace Survival)
```
스토리: 첫 팀 발표. 회의에서 처음으로 의견 말하기.
        어려운 상황 대처법 배우기.

핵심 상황별 표현:
1. 회의에서 의견 말하기: "I'd like to add something if I may..."
2. 바쁠 때 시간 조율: "I'm tied up until [time] — can we reschedule?"
3. 우선순위 정하기: "Could we go over the priorities together?"
4. 나쁜 소식 전하기: "I have some difficult news to share..."
5. 칭찬하기: "You did a great job on this."

제공 자료:
- 비즈니스 미팅 영어 완전 가이드
- 어려운 상황별 표현 30개
- 월간 업무 보고서 양식

핵심 미션:
- 팀 미팅에서 처음으로 의견 발언
- 월간 보고서 초안 작성
- S1 전체 복습 퀴즈 통과 (30개 표현 중 25개)

에피소드 이벤트:
Sarah가 "사실 나도 첫날 실수투성이였어요" 처음으로 인간적인 모습
```

### EP07 — 시즌 1 피날레 (Ready for Action)
```
스토리: 첫 달 마무리. Sarah가 첫 해외 바이어 접촉 프로젝트 예고.
        팀원들과 의미있는 대화들.

통합 미션:
- S1 전체 표현 30개 실전 활용
- Sarah에게 첫 달 성과 보고
- 다음 프로젝트 브리핑 이해
- 각 팀원과 의미있는 대화 1번씩

시즌 클리어 보상:
- "첫 달 생존" 뱃지
- S2 해금
- Aiko Tanaka (일본 바이어) NPC 등장 예고
```

---

## S2 — 바이어 발굴 (8 episodes)

### 시즌 목표
```
완료 후 가능한 것:
✓ 바이어 리서치와 프로파일링
✓ 콜드 이메일 전략적 작성
✓ 팔로업 이메일 3가지 전략
✓ 첫 바이어 회신 대응
```

| EP | 제목 | 핵심 내용 |
|----|------|---------|
| EP01 | 시장 조사 기초 | 일본/동남아 애슬레저 시장 분석, KOTRA 활용 |
| EP02 | 타겟 바이어 선정 | Sports Avenue Japan 발견, Aiko 프로파일링 |
| EP03 | 콜드 이메일 전략 | 후킹 첫 줄, 가치 제안, CTA |
| EP04 | 첫 발송 | 최종 이메일 검토 후 Aiko에게 발송 |
| EP05 | 침묵과의 싸움 | 2주 무응답, 팔로업 전략 학습 |
| EP06 | 다중 바이어 접촉 | 3개 바이어에 각각 개인화 이메일 |
| EP07 | 첫 회신! | Aiko 회신, Sarah 묘한 반응 (복선) |
| EP08 | 시즌 피날레 | S2 정산, Sophie Beaumont 등장 예고 |

---

## S3 — 첫 접촉 & 미팅 (8 episodes)

### 시즌 목표
```
완료 후 가능한 것:
✓ 화상회의 영어로 진행
✓ 제품 프레젠테이션 영어로
✓ 전시회 네트워킹 영어
✓ Sophie Beaumont (프랑스 바이어) 접촉 및 미팅
```

| EP | 제목 | 핵심 내용 |
|----|------|---------|
| EP01 | 미팅 요청과 준비 | Aiko에게 화상미팅 요청, 아젠다 작성 |
| EP02 | 첫 화상회의 | Aiko와 첫 미팅 시뮬레이션 |
| EP03 | 제품 프레젠테이션 | KoraTrade 제품 5분 피치 작성 및 실습 |
| EP04 | 전시회 준비 | 엘리베이터 피치, 명함 교환 영어 |
| EP05 | 전시회 현장 | 3명의 가상 바이어와 대화 시뮬레이션 |
| EP06 | Sophie와 첫 접촉 | 프랑스 바이어 Sophie Beaumont 등장 |
| EP07 | Sarah의 비밀 (복선 심화) | Sophie-Sarah 연결고리 힌트 |
| EP08 | 시즌 피날레 | Jake Williams (미국 바이어) 등장 예고 |

---

## S4 — 가격 협상 & 오퍼 (8 episodes)

### 시즌 목표
```
완료 후 가능한 것:
✓ 가격 제시와 협상 영어
✓ Incoterms 주요 5개 실무 적용 (FOB, CIF, EXW, DDP, DAP)
✓ 결제 조건 협의 (T/T, L/C)
✓ 경쟁사 압박 대응
```

---

## S5 — 계약 & 선적 & 클레임 (8 episodes)

### 시즌 목표
```
완료 후 가능한 것:
✓ 계약서 주요 조항 영어로 이해/협의
✓ 선적 서류 처리 (B/L, Commercial Invoice, Packing List)
✓ 납기 지연 대응
✓ 품질 클레임 협상
```

---

## S6 — 대금수령 & 관계관리 (7 episodes)

### 시즌 목표
```
완료 후 가능한 것:
✓ 인보이스 발행 및 대금 확인
✓ 결제 지연 정중하게 독촉
✓ 장기 파트너십 제안
✓ 재오더 유도 및 신제품 소개
```

---

# PART 6. 에피소드별 자료 시스템

## 자료 생성 규칙 (전 에피소드 공통)

```
모든 자료는 다음을 반드시 충족:
1. 실제 애슬레저 업계 문서 형식과 동일
2. 구체적 수치/날짜/스펙 포함
3. A4 1장 이상 충분한 분량
4. 전문 용어에 클릭 가능한 설명 팝업
5. 자료 열기 전 "사전 가이드라인 팝업" 필수
6. 자료 내용이 다음 미션에서 직접 활용됨
```

## S1 EP01 자료 목록 (상세)

### 자료 1: KoraTrade 브랜드 소개서

사전 가이드라인 팝업:
```
📋 읽기 전 체크포인트
이 자료를 읽으면서 3가지를 파악하세요:
1. KoraTrade의 주요 수출 시장과 비중
2. 주력 제품 라인과 가격대
3. 룰루레몬 대비 KoraTrade의 차별점
→ 읽고 나면 Sarah에게 이메일로 보고해야 해요!
```

자료 내용 (실제 업계 수준):
```
KoraTrade Inc. Brand Overview 2024

■ 브랜드 철학
"Move Better, Feel Korean"
아시안 체형에 최적화된 핏 + 한국 특유의 컬러 감성

■ 제품 라인업
CORE LINE (베스트셀러)
- Signature Leggings 7/8: ₩89,000 / MOQ 50pcs
  소재: 80% Nylon, 20% Spandex / 4-way stretch
  특징: 아시안핏 설계, 오징어 허리 방지 기술 적용
  
- AeroRun Top: ₩59,000 / MOQ 50pcs  
  소재: Moisture-wicking fabric / UPF 50+
  특징: 체온 조절 기능, 등판 메시 설계

PREMIUM LINE
- ProFit Biker Short: ₩79,000 / MOQ 30pcs
- ThermoRun Jacket: ₩159,000 / MOQ 20pcs

■ 주요 수출 시장 (2023 기준)
일본: 35% / 연간 약 98억원
동남아 (싱가포르, 태국, 말레이시아): 30% / 84억원
호주: 20% / 56억원
유럽 (진출 초기): 15% / 42억원

■ 경쟁 포지션
룰루레몬: $98-148 / 프리미엄, 서양핏
KoraTrade: ₩59,000-159,000 (약 $45-120) / 아시안핏 특화
안다르: ₩39,000-89,000 / 가성비 위주

KoraTrade 차별점:
1. 아시안핏 전문 설계 (허리-힙 비율 한국 여성 기준)
2. K-컬러 감성 (매 시즌 한국 트렌드 반영)
3. 합리적 프리미엄 포지션 (룰루레몬의 60-70% 가격)
4. 빠른 시즌 전환 (연 4회 컬렉션)

■ 인증 현황
KC 인증 / Oeko-Tex Standard 100 / ISO 9001:2015

■ 해외 거점
싱가포르 팝업스토어 (2023.03~)
도쿄 팝업스토어 (2023.09~)
시드니 팝업스토어 (2024.01~)
```

### 자료 2: 해외영업팀 조직도

```
KoraTrade Inc. 조직도 2024

황성민 대표이사
│
├── 해외영업팀 (4명)
│   ├── 김사라 팀장 — 유럽 전략, 팀 총괄
│   ├── 박준혁 대리 — 일본, 동남아
│   ├── [Yun] 사원 — 신규 바이어 발굴
│   └── 최민준 사원 — 미주 보조
│
├── 브랜드/마케팅팀
│   └── 이지수 (Lisa) — 제품 카탈로그, 해외 마케팅 자료
│
└── 물류/운영팀
    └── 박철수 과장 — 선적, 통관, 재고
```

### 자료 3: 비즈니스 이메일 가이드

```
비즈니스 이메일 5가지 구성요소

① Subject Line: 목적이 명확하게
   좋은 예: "[Report] Brand Profile Review — Yun"
   나쁜 예: "안녕하세요", "보고드립니다"

② Greeting: 격식에 맞게
   상사: "Dear Ms. Kim," / "팀장님께,"
   동료: "Hi James," / "박 대리님,"
   ❌ 금지: "Hey," / "Hi there,"

③ Opening: 목적을 첫 문장에
   좋은 예: "I am writing to report on..."
   나쁜 예: "Hope you're doing well." (진부, 사용 금지)

④ Body: 간결하게 3-5문장
   수치와 구체적 내용 포함

⑤ Closing: 다음 행동 명시
   "Please let me know if you need anything."
   "Best regards, / Sincerely,"

❌ 나쁜 이메일 예시:
Subject: 안녕
Hi Sarah, I read the file. It was good. Thanks, Yun

✅ 좋은 이메일 예시:
Subject: [Report] KoraTrade Brand Profile Review — Yun
Dear Ms. Kim,
I am writing to report completion of today's assigned task.
Key findings from the KoraTrade Brand Profile:
• Main export markets: Japan (35%), Southeast Asia (30%), Australia (20%)
• Core product: Signature Leggings 7/8 at ₩89,000
• Key differentiator: Asian-fit design vs. Lululemon's Western fit
I have a question about the European market strategy mentioned briefly in the profile. Would it be possible to discuss this briefly?
Best regards,
Yun [성]
```

---

# PART 7. 미션 자동 감지 시스템

## 구현 방법

매 메시지마다 Claude API 호출:
```
Prompt:
"현재 에피소드: [EP_ID]
미완료 미션 목록: [PENDING_MISSIONS]
최근 대화 20개: [CONVERSATION]
사용자 방금 발화: [USER_MESSAGE]

각 미완료 미션이 완료됐는지 판단하세요.
완료 기준: 사용자가 실제로 그 행동을 했을 때
단순 언급이나 의도 표현은 완료 아님

JSON 응답:
{completedNow: [미션ID 배열], reasoning: {}}"
```

## S1 EP01 미션 정의

```
mission_01_introduce_james:
완료 기준: James 채팅에서 자기소개 메시지 발송
감지: 사용자 메시지에 이름 or "new here" or "first day" 포함

mission_02_confirm_task_sarah:
완료 기준: Sarah에게 업무 내용/마감 확인 메시지
감지: Sarah 채팅에서 확인 질문 발송

mission_03_read_brand_profile:
완료 기준: 브랜드 소개서 문서 모달 열기
감지: 문서 열기 이벤트 발생

mission_04_group_intro:
완료 기준: 그룹 채팅에 자기소개 메시지
감지: 그룹챗 사용자 메시지 존재

mission_05_report_email:
완료 기준: 보고 이메일 작성 제출 후 80점 이상
감지: 이메일 채점 결과 >= 80
```

---

# PART 8. UI/UX 설계

## 전체 화면 구조

### 1. 온보딩 플로우 (/onboarding)
```
Step 1: 이메일 + 비밀번호
Step 2: 이름 + 이모지 아바타 (22개) + 배경색 (8개)
Step 3: 학습 목표 선택 (4개)
Step 4: 입사 제안서 애니메이션 + "첫 출근하기" 버튼
```

### 2. 출근 화면 (/commute)
```
- 게임 내부 시계 (로그인 시 09:00 시작)
- NPC 5명 오늘 상태 카드
  (각각: 아바타 + 이름 + 상태 태그 + 한 줄 힌트)
- 오늘 에피소드 카드 + 미션 예고
- "출근하기 🟢" 버튼
```

### 3. 메인 화면 (/main)
```
3단 레이아웃 (모두 드래그로 크기 조절 가능)

[왼쪽 사이드바 — 기본 220px]
- 채팅방 목록
  - 해외영업팀 (그룹)
  - James Park / Sarah Kim / Lisa Lee / Min Choi / 박철수 과장
  - (S2부터) Aiko Tanaka / Sophie Beaumont / Jake Williams
- 각 NPC: 온라인 점 + 오늘 상태 태그 + 마지막 메시지 미리보기
- NPC 호버 시: 이름/역할/관계도/오늘 상태 팝업
- 하단: 내 프로필 (아바타 + 이름 + XP 바)
- 하단 네비: Chat / Notes / People / Progress

[중앙 채팅창]
- 카카오톡 스타일 (연속 메시지는 첫 번째만 아바타/이름 표시)
- 게임 내부 시계 기반 타임스탬프
- NPC 응답: Claude API 실시간 (타이핑 인디케이터)
- 💡 힌트 버튼: 현재 상황 관련 표현 2-3개 팝업
- 자료 첨부: [📄 파일명] [열어보기] 카드
- 이메일 작성 모드: 빈 양식 + 제출 + AI 채점

[오른쪽 사이드바 — 기본 256px]
- 🎯 오늘의 학습 목표 (접힘/펼침, 자동 체크)
- 오늘의 미션 진행률 (자동 감지)
- 오늘의 표현 5개 (더블클릭: 뜻 팝업, 드래그: 노트 저장)
- 업무 노트 최근 3개
```

### 4. 업무 노트 (/notes)
```
4탭: 용어집 / 표현 모음 / 틀린 문장 / 내 메모
- 모든 항목 편집 가능 (인라인 편집)
- 더블클릭으로 뜻 조회 (Claude API)
- 드래그 선택 → "표현 모음에 추가" 버튼
- SRS 복습 날짜 표시
```

### 5. 인물 도감 (/characters)
```
2열 그리드
관계도에 따라 정보 점진적 공개:
0-30%: 이름, 역할, 기본 성격
31-60%: 업무 스타일
61-85%: 개인 이야기
86-100%: 숨겨진 서사 🔓 (특별 애니메이션)
새 시즌 클리어 시 새 바이어 NPC 해금
```

### 6. 진행 상황 (/progress)
```
상단: 전체 진행률 (X/46 에피소드)
      스탯 4개: 완료 에피소드 / 습득 표현 / 연속 학습일 / 뱃지
      
시즌 탭 (S1-S6):
- S1 확장: 7개 에피소드 카드 상세 보기
  각 카드: 번호, 제목, 상태, 학습목표 체크리스트, 표현 목록
- S2-S6 잠금: 시즌 목표 미리보기 + 잠금 아이콘

스킬 레이더 차트 (6축):
이메일 작성 / 미팅 영어 / 협상 표현 / 무역 실무 / 직장 커뮤니케이션 / 비즈니스 문화
```

---

# PART 9. NPC 대화 시스템

## Claude API 시스템 프롬프트 구조

모든 NPC에 공통 적용:
```
"You are [NPC_NAME] at KoraTrade Inc., a Korean athleisure brand.
This is a TEXT-BASED simulation game. There are no physical spaces.
All meetings happen in this group chat.
Never mention conference rooms or physical locations.

Current episode: [EPISODE_ID]
Episode context: [WHAT_CAN_BE_DISCUSSED]
User name: [USER_NAME]
Current game time: [HH:MM]
Relationship level: [RELATIONSHIP]%
Language setting: [KOREAN/ENGLISH]

CRITICAL RULES:
1. Always respond to exactly what the user said
2. Never refer to yourself in third person
3. If user asks what something means, explain it naturally first
4. Keep response 2-4 sentences
5. Stay strictly within episode context
6. Maintain professional workplace speech (no ㅋㅋ, lol, excessive slang)
7. [NPC-specific personality rules]"
```

## 언어 설정

```
한국어 모드:
- Sarah: 세미격식 존댓말
- James: 친근하되 존댓말 기본
- Min: 동갑 친구 톤 (격식 기본)
- Lisa: 격식 정확한 말투
- 박과장: 짧고 직설적
- 바이어: 항상 영어

영어 모드:
- 모든 사내 NPC: Professional casual English
- 바이어: 각 캐릭터 특성에 맞는 영어
```

## 에티켓 피드백 시스템

```
매 메시지 분석:
"사용자가 [NPC]에게 이 메시지를 보냈습니다: [MESSAGE]
상황: [CONTEXT]
명확한 문법 오류 또는 심각한 에티켓 위반이 있나요?

JSON: {
  hasGrammarError: bool,
  grammarFix: {original, corrected, explanation(한국어)},
  hasEtiquetteIssue: bool,
  etiquetteSeverity: 'mild'|'serious',
  etiquetteTip: string(한국어)
}"

문법 오류: 메시지 아래 노란 배너
에티켓 위반 (mild): NPC가 자연스럽게 반응
에티켓 위반 (serious): 골드 테두리 팝업 💼
```

---

# PART 10. 게임 시스템

## 시간 시스템
```
로그인 후 출근 버튼 클릭 = 게임 시계 09:00 시작
실제 시간과 무관 (밤에 해도 09:00 시작)
에피소드 완료 = 게임 시계 18:00 도달
앱 닫으면 시계 멈춤
재접속 시 멈춘 시간부터 재개
```

## XP & 레벨
```
표현 습득: +20 XP
좋은 선택지: +30 XP
미션 완료: +50 XP
이메일 80점 이상: +100 XP
일일 접속: +10 XP

레벨: Intern → Junior → Senior → Manager
```

## 관계도 시스템
```
영어 표현 품질에 따라 자동 변화
선택지 결과에 따라 변화
관계도 = 인물 도감 정보 공개 기준
관계도 높을수록 NPC가 더 많은 도움 제공
```

## 뱃지 시스템
```
🎉 입사 완료 / 💬 첫 메시지 / 📖 첫 표현 습득
🔥 3일 연속 / 🔥 7일 연속 / ✅ EP완료
🤝 첫 바이어 회신 / 📝 노트 기록 / 🌟 네이티브 표현
```

## 리셋 기능
```
프로필 모달 하단 빨간 버튼
확인 다이얼로그 후 전체 localStorage 초기화
온보딩으로 리다이렉트
```

---

# PART 11. 데이터 구조 (localStorage)

```json
{
  "profile": {
    "name": "", "email": "", "avatar": "", "avatarColor": "",
    "goal": "", "englishLevel": "", "industry": "athleisure"
  },
  "gameState": {
    "currentSeason": 1, "currentEpisode": 1, "currentPhase": 1,
    "gameClockMinutes": 540, "checkedInToday": false
  },
  "progress": {
    "completedEpisodes": [],
    "completedMissions": {},
    "learnedExpressions": []
  },
  "relationships": {
    "sarah": 30, "james": 50, "lisa": 20,
    "park": 10, "min": 55,
    "sophie": 0, "jake": 0, "aiko": 0
  },
  "stats": {
    "xp": 0, "level": 1, "streakDays": 0,
    "lastLoginDate": "", "badgesEarned": []
  },
  "notes": {
    "terms": [], "expressions": [], "wrongAnswers": [], "memos": []
  },
  "chatHistory": {
    "team": [], "james": [], "sarah": [],
    "lisa": [], "min": [], "park": [],
    "sophie": [], "jake": [], "aiko": []
  }
}
```

---

# PART 12. 개발 구현 순서

## Phase 1 — 핵심 학습 엔진 (최우선)
```
1. Claude API 연동 (/api/chat, /api/mission-check, /api/document, /api/grade-email)
2. NPC 실시간 대화 (에피소드 컨텍스트 정확히 반영)
3. 미션 자동 감지 시스템
4. 이메일 작성 + AI 채점
5. 자료 문서 생성 및 표시
```

## Phase 2 — 화면 구성
```
6. 온보딩 플로우
7. 출근 화면
8. 메인 채팅 (3단 레이아웃)
9. 오른쪽 패널 (학습 목표, 표현, 노트)
```

## Phase 3 — 부가 기능
```
10. 업무 노트 전체 기능
11. 인물 도감
12. 진행 상황 (Progress)
13. 에티켓 피드백
14. 더블클릭 뜻 조회 / 드래그 저장
```

## Phase 4 — 완성도
```
15. 뱃지 시스템
16. 리셋 기능
17. 언어 전환 완전 적용
18. S1 전체 에피소드 콘텐츠
```

