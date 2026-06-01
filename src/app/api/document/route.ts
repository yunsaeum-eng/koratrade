import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

// ─── Static fallback document HTML (shown when API key not set) ───────────────

const STATIC_DOCS: Record<string, string> = {
  brand_profile: `
<div style="font-family:system-ui,sans-serif;color:#1a1208;max-width:640px;margin:0 auto;padding:8px">
  <div style="background:#1a1208;color:white;padding:20px 24px;border-radius:12px;margin-bottom:20px">
    <div style="font-size:22px;font-weight:700;letter-spacing:1px">KoraTrade Inc.</div>
    <div style="font-size:13px;opacity:0.7;margin-top:4px">Brand Overview 2024 · Confidential</div>
  </div>

  <div style="margin-bottom:20px">
    <div style="font-size:11px;font-weight:700;color:#8a6530;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">브랜드 철학</div>
    <div style="font-size:15px;font-weight:600;color:#1a1208;margin-bottom:6px">"Move Better, Feel Korean"</div>
    <div style="font-size:13px;color:#4a3a28;line-height:1.7">아시안 체형에 최적화된 핏 + 한국 특유의 컬러 감성으로 차별화. 2018년 창업자 황성민이 필라테스 강사 출신 아내의 "한국에 룰루레몬 같은 브랜드가 없다"는 말에서 시작한 K-애슬레저 브랜드.</div>
  </div>

  <div style="margin-bottom:20px">
    <div style="font-size:11px;font-weight:700;color:#8a6530;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">제품 라인업</div>
    <div style="border:1px solid #e0d8cc;border-radius:10px;overflow:hidden">
      <div style="background:#8a6530;color:white;padding:8px 14px;font-size:12px;font-weight:600">CORE LINE — 베스트셀러</div>
      <div style="padding:12px 14px;border-bottom:1px solid #f0ebe3">
        <div style="font-weight:600;font-size:13px">Signature Leggings 7/8</div>
        <div style="font-size:12px;color:#6b5c3e;margin-top:3px">₩89,000 · MOQ 50pcs · 80% Nylon / 20% Spandex · 4-way stretch</div>
        <div style="font-size:12px;color:#6b5c3e">아시안핏 설계, 오징어 허리 방지 기술 적용</div>
      </div>
      <div style="padding:12px 14px;border-bottom:1px solid #f0ebe3">
        <div style="font-weight:600;font-size:13px">AeroRun Top</div>
        <div style="font-size:12px;color:#6b5c3e;margin-top:3px">₩59,000 · MOQ 50pcs · Moisture-wicking / UPF 50+</div>
        <div style="font-size:12px;color:#6b5c3e">체온 조절 기능, 등판 메시 설계</div>
      </div>
      <div style="background:#faf8f4;padding:8px 14px;font-size:12px;font-weight:600;color:#8a6530">PREMIUM LINE</div>
      <div style="padding:12px 14px;border-bottom:1px solid #f0ebe3">
        <div style="font-weight:600;font-size:13px">ProFit Biker Short</div>
        <div style="font-size:12px;color:#6b5c3e;margin-top:3px">₩79,000 · MOQ 30pcs</div>
      </div>
      <div style="padding:12px 14px">
        <div style="font-weight:600;font-size:13px">ThermoRun Jacket</div>
        <div style="font-size:12px;color:#6b5c3e;margin-top:3px">₩159,000 · MOQ 20pcs</div>
      </div>
    </div>
  </div>

  <div style="margin-bottom:20px">
    <div style="font-size:11px;font-weight:700;color:#8a6530;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">주요 수출 시장 (2023 기준)</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      <div style="background:#faf5ec;border:1px solid #e0d8cc;border-radius:8px;padding:10px 12px">
        <div style="font-weight:700;font-size:16px;color:#8a6530">35%</div>
        <div style="font-size:12px;color:#4a3a28;margin-top:2px">일본 · 약 98억원</div>
      </div>
      <div style="background:#faf5ec;border:1px solid #e0d8cc;border-radius:8px;padding:10px 12px">
        <div style="font-weight:700;font-size:16px;color:#8a6530">30%</div>
        <div style="font-size:12px;color:#4a3a28;margin-top:2px">동남아 · 약 84억원</div>
      </div>
      <div style="background:#faf5ec;border:1px solid #e0d8cc;border-radius:8px;padding:10px 12px">
        <div style="font-weight:700;font-size:16px;color:#8a6530">20%</div>
        <div style="font-size:12px;color:#4a3a28;margin-top:2px">호주 · 약 56억원</div>
      </div>
      <div style="background:#edf7f1;border:1px solid #b8e0c8;border-radius:8px;padding:10px 12px">
        <div style="font-weight:700;font-size:16px;color:#256040">15%</div>
        <div style="font-size:12px;color:#256040;margin-top:2px">유럽 (진출 초기) · 42억원</div>
      </div>
    </div>
  </div>

  <div style="margin-bottom:20px">
    <div style="font-size:11px;font-weight:700;color:#8a6530;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">경쟁 포지션</div>
    <div style="border:1px solid #e0d8cc;border-radius:10px;overflow:hidden">
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <tr style="background:#8a6530;color:white">
          <td style="padding:8px 12px;font-weight:600">브랜드</td>
          <td style="padding:8px 12px;font-weight:600">가격대</td>
          <td style="padding:8px 12px;font-weight:600">포지션</td>
        </tr>
        <tr style="border-bottom:1px solid #f0ebe3">
          <td style="padding:8px 12px">Lululemon</td>
          <td style="padding:8px 12px">$98–148</td>
          <td style="padding:8px 12px">프리미엄, 서양핏</td>
        </tr>
        <tr style="background:#faf8f4;border-bottom:1px solid #f0ebe3">
          <td style="padding:8px 12px;font-weight:600;color:#8a6530">KoraTrade ★</td>
          <td style="padding:8px 12px;font-weight:600">$45–120</td>
          <td style="padding:8px 12px;font-weight:600">아시안핏 특화</td>
        </tr>
        <tr>
          <td style="padding:8px 12px">Andar</td>
          <td style="padding:8px 12px">$30–68</td>
          <td style="padding:8px 12px">가성비 위주</td>
        </tr>
      </table>
    </div>
  </div>

  <div style="margin-bottom:20px">
    <div style="font-size:11px;font-weight:700;color:#8a6530;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">KoraTrade 차별점</div>
    <div style="space-y:6px">
      <div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:6px"><span style="color:#8a6530;font-weight:700;flex-shrink:0">①</span><span style="font-size:13px;color:#4a3a28">아시안핏 전문 설계 (허리-힙 비율 한국 여성 기준)</span></div>
      <div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:6px"><span style="color:#8a6530;font-weight:700;flex-shrink:0">②</span><span style="font-size:13px;color:#4a3a28">K-컬러 감성 — 매 시즌 한국 트렌드 반영 (연 4회 컬렉션)</span></div>
      <div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:6px"><span style="color:#8a6530;font-weight:700;flex-shrink:0">③</span><span style="font-size:13px;color:#4a3a28">합리적 프리미엄 포지션 (룰루레몬의 60–70% 가격)</span></div>
      <div style="display:flex;gap:8px;align-items:flex-start"><span style="color:#8a6530;font-weight:700;flex-shrink:0">④</span><span style="font-size:13px;color:#4a3a28">해외 팝업스토어 — 도쿄, 싱가포르, 시드니 운영 중</span></div>
    </div>
  </div>

  <div style="background:#f0faf4;border:1px solid #b8e0c8;border-radius:10px;padding:14px">
    <div style="font-size:11px;font-weight:700;color:#256040;margin-bottom:6px">인증 현황</div>
    <div style="font-size:12px;color:#1a3a28">KC 인증 · Oeko-Tex Standard 100 · ISO 9001:2015</div>
    <div style="font-size:11px;color:#256040;margin-top:4px">연매출 약 280억원 (2023) · 직원 38명 · 서울 성수동</div>
  </div>
</div>`,

  org_chart: `
<div style="font-family:system-ui,sans-serif;color:#1a1208;padding:8px">
  <div style="font-size:18px;font-weight:700;color:#8a6530;margin-bottom:4px">KoraTrade Inc. 조직도 2024</div>
  <div style="font-size:12px;color:#9c8c6e;margin-bottom:20px">해외영업팀 중심</div>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="background:#1a1208;color:white;padding:10px 16px;border-radius:8px;font-size:13px;font-weight:600;text-align:center">황성민 대표이사</div>
    <div style="border-left:2px solid #e0d8cc;margin-left:40px;padding-left:16px;display:flex;flex-direction:column;gap:10px">
      <div>
        <div style="font-size:11px;font-weight:700;color:#8a6530;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">해외영업팀 (4명)</div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <div style="background:#faf5ec;border:1px solid #e0d8cc;border-radius:6px;padding:8px 12px;font-size:12px"><span style="font-weight:600">김사라 팀장</span> <span style="color:#9c8c6e">— 유럽 전략, 팀 총괄</span></div>
          <div style="background:#faf5ec;border:1px solid #e0d8cc;border-radius:6px;padding:8px 12px;font-size:12px"><span style="font-weight:600">박준혁 대리</span> <span style="color:#9c8c6e">— 일본, 동남아 영업</span></div>
          <div style="background:#edf7f1;border:1px solid #b8e0c8;border-radius:6px;padding:8px 12px;font-size:12px"><span style="font-weight:600;color:#256040">[나] 사원</span> <span style="color:#256040">— 신규 바이어 발굴 (신입)</span></div>
          <div style="background:#faf5ec;border:1px solid #e0d8cc;border-radius:6px;padding:8px 12px;font-size:12px"><span style="font-weight:600">최민준 사원</span> <span style="color:#9c8c6e">— 미주 영업 보조 (신입)</span></div>
        </div>
      </div>
      <div>
        <div style="font-size:11px;font-weight:700;color:#8a6530;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">브랜드/마케팅팀</div>
        <div style="background:#faf5ec;border:1px solid #e0d8cc;border-radius:6px;padding:8px 12px;font-size:12px"><span style="font-weight:600">이지수 (Lisa)</span> <span style="color:#9c8c6e">— 제품 카탈로그, 해외 마케팅 자료</span></div>
      </div>
      <div>
        <div style="font-size:11px;font-weight:700;color:#8a6530;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">물류/운영팀</div>
        <div style="background:#faf5ec;border:1px solid #e0d8cc;border-radius:6px;padding:8px 12px;font-size:12px"><span style="font-weight:600">박철수 과장</span> <span style="color:#9c8c6e">— 선적, 통관, 재고 관리</span></div>
      </div>
    </div>
  </div>
</div>`,

  email_guide: `
<div style="font-family:system-ui,sans-serif;color:#1a1208;padding:8px">
  <div style="font-size:18px;font-weight:700;color:#8a6530;margin-bottom:4px">비즈니스 이메일 기초 가이드</div>
  <div style="font-size:12px;color:#9c8c6e;margin-bottom:20px">KoraTrade Inc. · 신입사원 필독</div>

  <div style="margin-bottom:20px">
    <div style="font-size:13px;font-weight:700;color:#8a6530;margin-bottom:10px">① Subject Line — 제목은 목적이 명확하게</div>
    <div style="background:#f0faf4;border-left:3px solid #256040;padding:10px 14px;border-radius:0 8px 8px 0;margin-bottom:6px;font-size:12px">
      <div style="color:#256040;font-weight:600;margin-bottom:2px">✅ 좋은 예</div>
      <div>"[Report] Brand Profile Review — Yun"</div>
      <div>"[Request] Catalogue Update — Urgent"</div>
    </div>
    <div style="background:#fff5f5;border-left:3px solid #e74c3c;padding:10px 14px;border-radius:0 8px 8px 0;font-size:12px">
      <div style="color:#e74c3c;font-weight:600;margin-bottom:2px">❌ 나쁜 예</div>
      <div>"안녕하세요" · "보고드립니다" · "Hello"</div>
    </div>
  </div>

  <div style="margin-bottom:20px">
    <div style="font-size:13px;font-weight:700;color:#8a6530;margin-bottom:10px">② Greeting — 격식에 맞게</div>
    <div style="font-size:12px;color:#4a3a28;line-height:1.8">
      <div>• 상사: <strong>"Dear Ms. Kim,"</strong> / <strong>"팀장님께,"</strong></div>
      <div>• 동료: <strong>"Hi James,"</strong> / <strong>"박 대리님,"</strong></div>
      <div style="color:#e74c3c">• ❌ 금지: "Hey," / "Hi there," / "안녕"</div>
    </div>
  </div>

  <div style="margin-bottom:20px">
    <div style="font-size:13px;font-weight:700;color:#8a6530;margin-bottom:10px">③ Opening — 목적을 첫 문장에</div>
    <div style="background:#f0faf4;border-left:3px solid #256040;padding:10px 14px;border-radius:0 8px 8px 0;font-size:12px">
      <div style="color:#256040;font-weight:600;margin-bottom:2px">✅ 좋은 예</div>
      <div>"I am writing to report on the brand profile review."</div>
    </div>
  </div>

  <div style="margin-bottom:20px">
    <div style="font-size:13px;font-weight:700;color:#8a6530;margin-bottom:10px">④ Body — 간결하게 3–5문장</div>
    <div style="font-size:12px;color:#4a3a28;line-height:1.7">수치와 구체적 내용 포함. 불필요한 설명 최소화.</div>
  </div>

  <div style="margin-bottom:24px">
    <div style="font-size:13px;font-weight:700;color:#8a6530;margin-bottom:10px">⑤ Closing — 다음 행동 명시</div>
    <div style="font-size:12px;color:#4a3a28;line-height:1.8">
      <div>"Please let me know if you need anything."</div>
      <div>"Best regards," / "Sincerely,"</div>
    </div>
  </div>

  <div style="border:2px solid #8a6530;border-radius:12px;overflow:hidden">
    <div style="background:#8a6530;color:white;padding:10px 16px;font-size:12px;font-weight:600">✅ 좋은 이메일 예시</div>
    <div style="padding:16px;font-size:12px;line-height:1.8;background:#fdfbf7;font-family:Georgia,serif">
      <div><strong>Subject:</strong> [Report] KoraTrade Brand Profile Review — Yun</div>
      <div style="margin-top:10px">Dear Ms. Kim,</div>
      <div style="margin-top:8px">I am writing to report completion of today's assigned task.</div>
      <div style="margin-top:6px">Key findings from the KoraTrade Brand Profile:</div>
      <div>• Main export markets: Japan (35%), Southeast Asia (30%), Australia (20%)</div>
      <div>• Core product: Signature Leggings 7/8 at ₩89,000</div>
      <div>• Key differentiator: Asian-fit design vs. Lululemon's Western fit</div>
      <div style="margin-top:6px">I have a question about the European market strategy. Would it be possible to discuss this briefly?</div>
      <div style="margin-top:8px">Best regards,<br/>Yun</div>
    </div>
  </div>
</div>`,
}

// ─── Pre-read guidelines for each document ────────────────────────────────────

export const PRE_READ_GUIDELINES: Record<string, { ko: string[]; en: string[] }> = {
  brand_profile: {
    ko: [
      'KoraTrade의 주요 수출 시장과 비중을 파악하세요',
      '주력 제품 라인과 가격대를 확인하세요',
      '룰루레몬 대비 KoraTrade의 차별점을 3가지 찾으세요',
      '읽고 나면 Sarah에게 이메일로 보고해야 해요!',
    ],
    en: [
      "Identify KoraTrade's main export markets and their percentages",
      'Note the core product lineup and price ranges',
      'Find 3 key differentiators vs. Lululemon',
      "After reading, you'll need to submit a report email to Sarah!",
    ],
  },
  org_chart: {
    ko: ['각 팀원의 역할과 담당 업무를 파악하세요', '내가 속한 팀의 구조를 이해하세요'],
    en: ["Learn each team member's role and responsibilities", 'Understand the team structure you belong to'],
  },
  email_guide: {
    ko: ['이메일의 5가지 구성요소를 파악하세요', '좋은 이메일과 나쁜 이메일의 차이를 이해하세요', '예시를 참고해서 보고 이메일을 작성해야 해요'],
    en: ['Learn the 5 components of a business email', 'Understand the difference between good and bad emails', "You'll use this guide to write your report email"],
  },
}

// ─── Document prompts (AI-generated, richer than static) ─────────────────────

const DOC_PROMPTS: Record<string, (lang: string) => string> = {
  brand_profile: (lang) => `Generate a professional brand overview document for KoraTrade Inc., a Korean athleisure brand, as clean HTML.

Company details:
- Founded 2018, Seoul Seongsu-dong, 38 employees
- Products: Signature Leggings 7/8 (₩89,000, MOQ 50pcs, 80% Nylon/20% Spandex, 4-way stretch, Asian-fit), AeroRun Top (₩59,000, MOQ 50pcs, moisture-wicking, UPF 50+), ProFit Biker Short (₩79,000, MOQ 30pcs), ThermoRun Jacket (₩159,000, MOQ 20pcs)
- Markets: Japan 35% (~98B KRW), Southeast Asia 30% (~84B KRW), Australia 20% (~56B KRW), Europe 15% (~42B KRW, early stage)
- Positioning: More affordable than Lululemon, Asian-fit specialization, K-color aesthetics
- Certifications: KC, Oeko-Tex Standard 100, ISO 9001:2015
- Popup stores: Tokyo, Singapore, Sydney
- Annual revenue: ~28B KRW (2023)

Language: ${lang === 'ko' ? 'Korean with English product specs' : 'English'}

Format as a real professional brand document with sections: 브랜드 철학/Brand Philosophy, 제품 라인업/Product Lineup, 글로벌 시장/Global Markets, 경쟁 포지션/Competitive Position, 차별점/Differentiators, 인증 현황/Certifications.

Use color #8a6530 for headings. Make it detailed and realistic. Return ONLY a single <div> with all CSS inline.`,

  org_chart: (lang) => `Generate a KoraTrade Inc. organizational chart as clean HTML showing: CEO 황성민, then Overseas Sales Team (김사라 팀장, 박준혁 대리, [Player] 사원 new hire, 최민준 사원 new hire), Brand/Marketing Team (이지수 Lisa), Logistics Team (박철수 과장). Language: ${lang}. Use #8a6530 for headers. Return ONLY a single <div> with inline CSS.`,

  email_guide: (lang) => `Generate a business email guide for KoraTrade new employees as clean HTML. Include: 5 email components (Subject, Greeting, Opening, Body, Closing), good vs bad examples for each, a full example email reporting on brand profile review. Language: ${lang === 'ko' ? 'Korean with English examples' : 'English'}. Use #8a6530 for section headers. Return ONLY a single <div> with inline CSS.`,
}

const DOC_NAMES: Record<string, { ko: string; en: string }> = {
  brand_profile: { ko: 'KoraTrade 브랜드 소개서.pdf',   en: 'KoraTrade_Brand_Profile.pdf' },
  org_chart:     { ko: '해외영업팀 조직도.pdf',          en: 'KoraTrade_Org_Chart.pdf' },
  email_guide:   { ko: '비즈니스 이메일 가이드.pdf',     en: 'Business_Email_Guide.pdf' },
  // Legacy doc types for backwards compat
  company_profile:          { ko: 'KoraTrade 브랜드 소개서.pdf',   en: 'KoraTrade_Brand_Profile.pdf' },
  buyer_database_template:  { ko: '바이어 DB 템플릿.xlsx',          en: 'Buyer_Database_Template.xlsx' },
  email_template_package:   { ko: '이메일 가이드.pdf',              en: 'Email_Guide.pdf' },
  product_catalogue:        { ko: '제품 카탈로그.pdf',              en: 'KoraTrade_Product_Catalogue.pdf' },
  meeting_agenda:           { ko: '팀 미팅 안건.docx',              en: 'Team_Meeting_Agenda.docx' },
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { docType, lang = 'ko' } = await req.json()
  const name = DOC_NAMES[docType]?.[lang as 'ko' | 'en'] ?? 'Document.pdf'

  // Map legacy doc types to new ones
  const resolvedType = docType === 'company_profile' ? 'brand_profile'
    : docType === 'email_template_package' ? 'email_guide'
    : docType

  // Return static doc immediately if available
  if (STATIC_DOCS[resolvedType]) {
    return Response.json({ html: STATIC_DOCS[resolvedType], name })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  const noKey = !apiKey || apiKey.startsWith('sk-ant-...')
  const promptFn = DOC_PROMPTS[resolvedType]

  if (noKey || !promptFn) {
    const fallback = `<div style="padding:24px;font-family:system-ui;color:#1a1208;text-align:center">
      <div style="font-size:32px;margin-bottom:8px">👗</div>
      <div style="font-weight:700;color:#8a6530;margin-bottom:8px">KoraTrade Inc.</div>
      <div style="font-size:13px;color:#9c8c6e">${noKey ? '문서를 생성하려면 Claude API 키가 필요합니다.' : '지원하지 않는 문서 유형입니다.'}</div>
    </div>`
    return Response.json({ html: fallback, name })
  }

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 3000,
      messages: [{ role: 'user', content: promptFn(lang) }],
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
    const cleaned = raw.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '').trim()
    const match = cleaned.match(/<div[\s\S]*<\/div>/i)
    const html = match ? match[0] : cleaned

    return Response.json({ html, name })
  } catch (err: unknown) {
    const msg = (err as { message?: string }).message ?? 'error'
    console.error('Document API error:', msg)
    // Fall back to static if available
    if (STATIC_DOCS[resolvedType]) return Response.json({ html: STATIC_DOCS[resolvedType], name })
    return Response.json({
      html: `<div style="padding:24px;color:#1a1208;font-family:system-ui"><p style="color:#c0392b">문서 생성 중 오류가 발생했습니다.</p></div>`,
      name,
    })
  }
}
