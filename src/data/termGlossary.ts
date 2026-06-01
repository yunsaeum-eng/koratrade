// Terms to auto-highlight in chat messages + document viewer.
// Sorted longest-first within each group to prevent partial-match bugs.

export interface GlossaryTerm {
  id: string
  patterns: string[]          // all forms to match (longest first)
  desc: { ko: string; en: string }
  episodeMax: number          // stop highlighting after this episode (user knows it by then)
}

export const GLOSSARY: GlossaryTerm[] = [
  // ── Office hierarchy ──────────────────────────────────────────────────────
  {
    id: 'team_leader',
    patterns: ['팀장'],
    desc: {
      ko: '팀을 이끄는 리더. 우리 팀에선 김사라 팀장님이에요.',
      en: 'Team manager/leader. Sarah Kim is our team leader.',
    },
    episodeMax: 2,
  },
  {
    id: 'daeri',
    patterns: ['대리'],
    desc: {
      ko: '대리는 사원 위, 과장 아래 직급이에요. James가 대리예요.',
      en: 'Associate — the rank above staff, below section chief. James is an associate.',
    },
    episodeMax: 2,
  },
  {
    id: 'gwajang',
    patterns: ['과장'],
    desc: {
      ko: '과장은 대리 위 직급이에요. 박철수 과장님이 생산관리팀에 계세요.',
      en: 'Section chief — senior rank above associate. Mr. Park is a section chief.',
    },
    episodeMax: 2,
  },

  // ── Core trade terms ──────────────────────────────────────────────────────
  {
    id: 'buyer_db',
    patterns: ['바이어 DB', 'Buyer DB', 'buyer DB'],
    desc: {
      ko: '바이어(해외 고객사) 정보를 정리한 파일. 회사명·담당자·연락처·관심 품목을 기록해요.',
      en: 'Buyer database — a file listing overseas customers with their contact info and purchase interests.',
    },
    episodeMax: 3,
  },
  {
    id: 'buyer',
    patterns: ['바이어', 'buyer', 'buyers'],
    desc: {
      ko: '우리 제품을 구매하는 해외 고객사. 쉽게 말해 외국에서 우리 제품을 사는 회사예요.',
      en: 'The overseas company that buys your products — your foreign customer.',
    },
    episodeMax: 4,
  },
  {
    id: 'kotra',
    patterns: ['KOTRA', 'Kotra', 'kotra', '코트라'],
    desc: {
      ko: '한국무역투자진흥공사. 정부 기관으로 해외 바이어 정보와 시장 조사 자료를 제공해요.',
      en: 'Korea Trade-Investment Promotion Agency — a government body with overseas buyer databases and market research.',
    },
    episodeMax: 4,
  },
  {
    id: 'cold_email',
    patterns: ['콜드 이메일', 'cold email', 'cold-email'],
    desc: {
      ko: '사전 관계 없이 처음 보내는 영업 이메일. 낯선 바이어에게 첫 연락하는 거예요.',
      en: 'A cold email is the first outreach message sent to a buyer you have no prior relationship with.',
    },
    episodeMax: 5,
  },
  {
    id: 'follow_up',
    patterns: ['팔로업', 'follow-up', 'follow up', 'followup'],
    desc: {
      ko: '이전 이메일에 대한 후속 연락. 답장이 없을 때 다시 연락하는 거예요.',
      en: 'A follow-up is a second message sent after no reply to your first email.',
    },
    episodeMax: 6,
  },
  {
    id: 'claim',
    patterns: ['클레임', 'claim'],
    desc: {
      ko: '납품한 제품에 문제가 생겼을 때 바이어가 제기하는 이의. 품질·납기 클레임이 대표적이에요.',
      en: 'A claim is a formal complaint raised by the buyer when there is a problem with delivered goods.',
    },
    episodeMax: 6,
  },
  {
    id: 'invoice',
    patterns: ['인보이스', 'invoice', 'Invoice'],
    desc: {
      ko: '상업 송장. 수출입 거래에서 판매 금액·품목·조건이 적힌 청구서예요.',
      en: 'A commercial invoice — the billing document listing items, quantities, and price in an export deal.',
    },
    episodeMax: 6,
  },
  {
    id: 'shipment',
    patterns: ['선적', '선적하다', '선적됩니다'],
    desc: {
      ko: '제품을 배에 싣는 것. "선적 완료"는 배에 다 올렸다는 뜻이에요.',
      en: 'Shipment — loading goods onto a ship. "선적 완료" means the goods are on board.',
    },
    episodeMax: 5,
  },
  {
    id: 'quotation',
    patterns: ['견적', '견적서'],
    desc: {
      ko: '제품 가격·수량·납기 조건을 적어 보내는 문서. "견적 내달라"는 가격 알려달라는 뜻이에요.',
      en: 'A quotation (or quote) — a document showing price, quantity, and delivery terms you offer.',
    },
    episodeMax: 5,
  },
  {
    id: 'contract',
    patterns: ['계약서'],
    desc: {
      ko: '양측이 서명하는 거래 조건 문서. 가격·납기·품질 기준이 법적으로 효력을 가져요.',
      en: 'A sales contract — the legally binding document signed by both sides covering price, delivery, and quality.',
    },
    episodeMax: 6,
  },

  // ── Incoterms ─────────────────────────────────────────────────────────────
  {
    id: 'incoterms',
    patterns: ['인코텀즈', 'Incoterms', 'incoterms'],
    desc: {
      ko: '국제 무역 조건 규칙. 누가 운임·보험·통관을 책임지는지 정한 국제 기준이에요.',
      en: 'International rules defining who pays for freight, insurance, and customs in a trade deal.',
    },
    episodeMax: 7,
  },
  {
    id: 'fob',
    patterns: ['FOB'],
    desc: {
      ko: 'Free On Board. 수출항 선적까지 판매자 책임, 이후는 바이어 책임. "FOB 부산"이면 부산항까지 우리가 책임이에요.',
      en: 'Free On Board. Seller is responsible until goods are loaded at the port — buyer handles everything after.',
    },
    episodeMax: 7,
  },
  {
    id: 'cif',
    patterns: ['CIF'],
    desc: {
      ko: 'Cost, Insurance, Freight. 목적항까지의 비용·보험·운임을 판매자가 부담하는 조건이에요.',
      en: 'Cost, Insurance, Freight. Seller covers cost, insurance, and freight to the buyer\'s destination port.',
    },
    episodeMax: 7,
  },
  {
    id: 'lc',
    patterns: ['L/C', 'LC', '신용장'],
    desc: {
      ko: '신용장(Letter of Credit). 바이어 은행이 보증하는 결제 방식. 안전하지만 서류 처리가 복잡해요.',
      en: 'Letter of Credit — a bank-guaranteed payment method. Safe but requires strict document compliance.',
    },
    episodeMax: 7,
  },
  {
    id: 'bl',
    patterns: ['B/L', 'BL', '선하증권'],
    desc: {
      ko: '선하증권(Bill of Lading). 선적 완료를 증명하는 문서. 물건의 소유권 이전 증서이기도 해요.',
      en: 'Bill of Lading — a shipping document proving goods are on board. Also transfers ownership.',
    },
    episodeMax: 7,
  },
  {
    id: 'trade_association',
    patterns: ['무역협회', '무역 협회'],
    desc: {
      ko: '한국무역협회(KITA). 수출입 기업을 지원하는 단체로 무역 통계·바이어 정보 등을 제공해요.',
      en: 'KITA (Korea International Trade Association) — provides trade statistics, buyer info, and support for exporters.',
    },
    episodeMax: 4,
  },
]

// Sorted longest-pattern-first so we match "바이어 DB" before "바이어"
export const GLOSSARY_SORTED = [...GLOSSARY].sort(
  (a, b) => Math.max(...b.patterns.map(p => p.length)) - Math.max(...a.patterns.map(p => p.length))
)

export function getTermById(id: string): GlossaryTerm | undefined {
  return GLOSSARY.find(t => t.id === id)
}
