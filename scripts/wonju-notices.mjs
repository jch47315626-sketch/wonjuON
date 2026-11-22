/**
 * 원주시청 홈페이지(www.wonju.go.kr) 게시판에서 주민이 관심 가질 만한 글을 골라옵니다.
 * 원주시청은 RSS·공개 API가 없어 게시판 목록 HTML을 읽습니다.
 * robots.txt 는 /www/ 경로를 허용합니다(이미지가 있는 /DATA/ 는 막혀 있어 읽지 않음).
 * 사이트에 부담을 주지 않도록 요청 사이에 쉬고, 본문은 고른 글만 읽습니다.
 */

export const SOURCE = '원주시청';
const BASE = 'https://www.wonju.go.kr/www/';

/** 읽을 게시판. 고시·입법예고·분묘개장 공고는 주민 관심사가 거의 없어 뺐습니다. */
export const BOARDS = [
  { bbsNo: 1, key: 211, name: '새소식' },
  { bbsNo: 145, key: 222, name: '보도자료' },
  { bbsNo: 140, key: 216, name: '공고' },
  { bbsNo: 1129, key: 5387, name: '채용·시험' },
];

/** 분류별 단어. 앞에 있는 분류가 먼저 걸립니다. */
const TOPICS = [
  // 일자리 글은 '건강생활지원센터' 처럼 다른 분류 단어가 섞여 있어 먼저 봅니다.
  { topic: '모집·채용', words: ['채용', '임용시험'] },
  {
    topic: '생활·안전',
    words: [
      '교통 통제', '교통통제', '통제', '단수', '정전', '한파', '폭염', '폭설', '제설', '대설', '미세먼지',
      '야간비행', '휴관', '휴무', '운행', '노선', '버스', '주차', '쓰레기', '재활용', '수도', '방역',
      '예방접종', '접종', '검진', '안전', '재난', '공사', '우회',
    ],
  },
  {
    topic: '지원·혜택',
    words: [
      '지원금', '지원사업', '지원', '바우처', '할인', '무료', '감면', '환급', '쿠폰', '상품권', '혜택',
      '장학', '수당', '보조금', '돌봄', '나눔', '배부', '지급',
    ],
  },
  {
    topic: '행사·문화',
    words: [
      '축제', '공연', '음악회', '콘서트', '전시', '행사', '개최', '개장', '개관', '체험', '특강', '강좌',
      '교육 프로그램', '프로그램', '설명회', '마라톤', '대회', '영화', '도서관', '페스티벌', '박람회',
    ],
  },
  {
    topic: '모집·채용',
    words: ['모집', '신청', '접수', '참가자', '참여자', '수강생', '채용', '공개채용', '선발', '임용시험'],
  },
];

/** 이 단어가 있으면 관심 단어가 있어도 뺍니다 (행정 처리, 지난 일, 내부 행사 등). */
const EXCLUDE = [
  '공시송달', '최고공고', '반송', '체납', '명단공개', '명단 공개', '입찰', '낙찰', '계약', '결정고시',
  '결정(변경)', '실시계획', '열람', '합격자', '서류전형', '면접시험', '최종합격', '회의결과', '위원회',
  '기탁', '후원금', '후원', '간담회', '업무협약', '협약', '성료', '성황리', '마무리', '수상', '선정돼',
  '선정됐', '방문', '점검 실시', '교육·훈련', '훈련 실시', '사실조사', '행정처분', '청문', '분묘',
  '토지', '보상', '기술제안서', '공법', '수행기관', '기업체', '견학', '법정교육', '도로명주소', '사업인정', '정보공개', '개방형직위', '인사발령',
];

/** 제목만으로 주민 관심 글인지 판단. 관심 없으면 null, 있으면 분류 이름. */
export function classify(title) {
  const t = title.replace(/\s+/g, ' ');
  if (EXCLUDE.some((w) => t.includes(w))) return null;
  for (const { topic, words } of TOPICS) {
    if (words.some((w) => t.includes(w))) return topic;
  }
  return null;
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

/** HTML 조각 → 평문 */
export function text(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&(\w+);/g, (m, n) => ENTITIES[n] ?? m)
    .normalize('NFKC') // 전각 문자（）＇＂ 등을 보통 문자로
    .replace(/[ \t\r\f\v]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim();
}

/** "2026.11.20" → "2026-11-20" */
function isoDate(s) {
  const m = s.match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

/** 게시판 목록 HTML → [{ nttNo, title, date, dept }] */
export function parseList(html) {
  const tbody = (html.match(/<tbody[\s\S]*?<\/tbody>/g) ?? []).find((t) => t.includes('selectBbsNttView'));
  if (!tbody) return [];
  const rows = [];
  for (const tr of tbody.match(/<tr[\s\S]*?<\/tr>/g) ?? []) {
    const link = tr.match(/<a [^>]*href="[^"]*selectBbsNttView\.do\?[^"]*nttNo=(\d+)[^"]*"[^>]*>([\s\S]*?)<\/a>/);
    if (!link) continue;
    const cells = (tr.match(/<td[\s\S]*?<\/td>/g) ?? []).map(text);
    const di = cells.findIndex((c) => isoDate(c));
    if (di < 0) continue;
    const dept = cells[di + 1] && !/^\d+$/.test(cells[di + 1]) ? cells[di + 1] : undefined;
    rows.push({
      nttNo: link[1],
      title: text(link[2].replace(/<span[^>]*p-icon[^>]*>[\s\S]*?<\/span>/g, '')),
      date: isoDate(cells[di]),
      dept,
    });
  }
  return rows;
}

/** 본문 HTML → { body, dept, tel } (본문은 평문) */
export function parseView(html) {
  const body = html.match(/<div class="ntt_cn_container">([\s\S]*?)<\/div>\s*<\/td>/);
  const th = (name) => {
    const m = html.match(new RegExp(`<th scope="row">${name}</th>\\s*<td[^>]*>([\\s\\S]*?)</td>`));
    return m ? text(m[1]) || undefined : undefined;
  };
  return { body: body ? text(body[1]) : '', dept: th('담당부서'), tel: th('문의전화') };
}

/** 본문 앞부분을 한두 문장으로 (최대 maxLen 자) */
export function summarize(body, maxLen = 140) {
  const flat = body.replace(/\s+/g, ' ').trim();
  if (flat.length <= maxLen) return flat;
  const cut = flat.slice(0, maxLen);
  const end = Math.max(cut.lastIndexOf('다. '), cut.lastIndexOf('다.'));
  return end > 40 ? cut.slice(0, end + 2) : `${cut.trimEnd()}…`;
}

export function listUrl(b, page = 1) {
  return `${BASE}selectBbsNttList.do?bbsNo=${b.bbsNo}&key=${b.key}&pageIndex=${page}`;
}

export function viewUrl(b, nttNo) {
  return `${BASE}selectBbsNttView.do?bbsNo=${b.bbsNo}&key=${b.key}&nttNo=${nttNo}`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 사이트가 가끔 연결을 끊거나 '접속 차단' 화면을 줘서 몇 번 다시 시도합니다. */
async function get(url, tries = 4) {
  let last;
  for (let i = 0; i < tries; i++) {
    if (i) await sleep(2000 * i);
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'wonjuON-notice-bot/1.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      if (!html.includes('selectBbsNttList') && !html.includes('ntt_cn_container')) {
        throw new Error('게시판이 아닌 화면을 받음 (접속 차단 화면일 수 있음)');
      }
      return html;
    } catch (e) {
      last = e;
    }
  }
  throw new Error(`${url} 읽기 실패: ${last?.message}`);
}

/**
 * 최근 days 일 동안 올라온 글 중 관심 글만 골라 본문 요약까지 붙여 돌려줍니다.
 * @returns {Promise<import('../src/types').Notice[]>}
 */
export async function fetchWonjuNotices({ days = 14, pages = 2, log = console.log } = {}) {
  const since = new Date(Date.now() - days * 86400_000 + 9 * 3600_000).toISOString().slice(0, 10);
  const picked = [];
  let seen = 0;

  for (const b of BOARDS) {
    for (let p = 1; p <= pages; p++) {
      const rows = parseList(await get(listUrl(b, p)));
      await sleep(1000);
      seen += rows.length;
      for (const r of rows) {
        if (r.date < since) continue;
        const topic = classify(r.title);
        if (topic) picked.push({ b, r, topic });
      }
      if (rows.length === 0 || rows.at(-1).date < since) break;
    }
  }

  const out = [];
  for (const { b, r, topic } of picked) {
    const url = viewUrl(b, r.nttNo);
    let view = { body: '', dept: undefined, tel: undefined };
    try {
      view = parseView(await get(url));
    } catch (e) {
      log(`본문 건너뜀: ${e.message}`);
    }
    await sleep(800);
    out.push({
      id: `${b.bbsNo}-${r.nttNo}`,
      title: r.title,
      topic,
      board: b.name,
      date: r.date,
      dept: view.dept ?? r.dept,
      tel: view.tel,
      summary: view.body ? summarize(view.body) : undefined,
      url,
      source: SOURCE,
      sourceId: r.nttNo,
    });
  }
  out.sort((a, b) => b.date.localeCompare(a.date) || Number(b.sourceId) - Number(a.sourceId));
  // 매주 오는 '야간비행 훈련 안내 [11월 4주]' 같은 글은 가장 최근 것만 남김
  const seenTitles = new Set();
  const unique = out.filter((n) => {
    const k = n.title.replace(/\[[^\]]*\]|\([^)]*\)/g, '').replace(/\s+/g, '');
    if (seenTitles.has(k)) return false;
    seenTitles.add(k);
    return true;
  });
  log(`원주시청 게시판 ${seen}건 중 최근 ${days}일 관심 글 ${unique.length}건`);
  return unique;
}
