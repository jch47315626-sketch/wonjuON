/**
 * 네이버 뉴스 검색 API로 '원주' 최신 뉴스를 가져옵니다.
 * 키: https://developers.naver.com 에서 애플리케이션 등록(검색 API) 후 받은
 *     NAVER_CLIENT_ID, NAVER_CLIENT_SECRET (무료, 하루 25,000회).
 * 뉴스 본문은 저장하지 않고, API가 주는 제목·짧은 요약·링크만 씁니다(누르면 언론사 원문으로).
 */
import { createHash } from 'node:crypto';

import { text } from './wonju-notices.mjs';

export const SOURCE = '네이버 뉴스';
const API = 'https://openapi.naver.com/v1/search/news.json';
/** 여러 낱말로 찾아 합칩니다. '원주'만 찾으면 다른 지역 기사도 섞여서 제목에 원주가 있는 것만 남깁니다. */
const QUERIES = ['원주시', '원주'];
const KEEP_DAYS = 3;

/** 원주와 상관없는 낱말(원주민·원주율 등)이나 주민에게 쓸모없는 기사 */
const EXCLUDE = [
  '원주민', '원주율', '원주각', '부고', '[부고]', '인사]', '[인사', '동정]', '[동정', '포토]', '[포토',
  '주가', '특징주', '코스피', '코스닥', '운세', '오늘의 운세', '광고', '[알림]', '사설', '칼럼', '기고',
];

/** 자주 나오는 언론사 주소 → 이름. 없으면 주소를 그대로 씁니다. */
const PRESS = {
  'kwnews.co.kr': '강원일보',
  'kado.net': '강원도민일보',
  'wonjutoday.co.kr': '원주투데이',
  'wonjunews.co.kr': '원주신문',
  'yna.co.kr': '연합뉴스',
  'newsis.com': '뉴시스',
  'news1.kr': '뉴스1',
  'kbs.co.kr': 'KBS',
  'mbc.co.kr': 'MBC',
  'imbc.com': 'MBC',
  'sbs.co.kr': 'SBS',
  'g1tv.co.kr': 'G1방송',
  'wjmbc.co.kr': '원주MBC',
  'chosun.com': '조선일보',
  'joongang.co.kr': '중앙일보',
  'donga.com': '동아일보',
  'hani.co.kr': '한겨레',
  'khan.co.kr': '경향신문',
  'mk.co.kr': '매일경제',
  'hankyung.com': '한국경제',
  'kmib.co.kr': '국민일보',
  'segye.com': '세계일보',
  'seoul.co.kr': '서울신문',
  'hankookilbo.com': '한국일보',
  'nocutnews.co.kr': '노컷뉴스',
  'ohmynews.com': '오마이뉴스',
  'newspim.com': '뉴스핌',
  'edaily.co.kr': '이데일리',
};

export function pressName(url) {
  try {
    const host = new URL(url).hostname.replace(/^(www|m|news|n)\./, '');
    const hit = Object.keys(PRESS).find((d) => host === d || host.endsWith('.' + d));
    return hit ? PRESS[hit] : host;
  } catch {
    return '언론사';
  }
}

/** 서울 시간 기준 YYYY-MM-DD */
function kstDate(d) {
  return new Date(d.getTime() + 9 * 3600_000).toISOString().slice(0, 10);
}

/** 같은 소식을 여러 언론사가 쓴 경우 하나만 남기려고 제목을 줄인 열쇠 */
function titleKey(t) {
  return t.replace(/[^가-힣a-zA-Z0-9]/g, '').slice(0, 14);
}

/** API 응답 하나 → 앱 News, 원주 기사가 아니면 null */
/** 네이버는 찾은 낱말을 <b>로 감싸므로, 띄어쓰기가 생기지 않게 먼저 뗍니다 (원주<b>민</b> → 원주민) */
const unbold = (s) => s.replace(/<\/?b>/gi, '');

export function toNews(item) {
  const title = text(unbold(item.title));
  if (!title.includes('원주')) return null;
  if (EXCLUDE.some((w) => title.includes(w))) return null;
  const url = item.originallink || item.link;
  const published = new Date(item.pubDate);
  if (Number.isNaN(published.getTime())) return null;
  return {
    id: createHash('sha1').update(url).digest('hex').slice(0, 16),
    title,
    summary: text(unbold(item.description)).slice(0, 140),
    url,
    naverUrl: item.link,
    press: pressName(url),
    date: kstDate(published),
    publishedAt: published.toISOString(),
    source: SOURCE,
  };
}

export async function fetchWonjuNews({
  id = process.env.NAVER_CLIENT_ID,
  secret = process.env.NAVER_CLIENT_SECRET,
} = {}) {
  if (!id || !secret) throw new Error('NAVER_CLIENT_ID, NAVER_CLIENT_SECRET 가 없습니다.');
  const cutoff = Date.now() - KEEP_DAYS * 86400_000;
  const seenUrl = new Set();
  const seenTitle = new Set();
  const out = [];
  for (const q of QUERIES) {
    const url = `${API}?query=${encodeURIComponent(q)}&display=100&sort=date`;
    const res = await fetch(url, {
      headers: { 'X-Naver-Client-Id': id, 'X-Naver-Client-Secret': secret },
    });
    if (!res.ok) throw new Error(`네이버 뉴스 API 오류 ${res.status}: ${await res.text()}`);
    const { items = [] } = await res.json();
    for (const it of items) {
      const n = toNews(it);
      if (!n || Date.parse(n.publishedAt) < cutoff) continue;
      const key = titleKey(n.title);
      if (seenUrl.has(n.url) || seenTitle.has(key)) continue;
      seenUrl.add(n.url);
      seenTitle.add(key);
      out.push(n);
    }
  }
  return out.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
