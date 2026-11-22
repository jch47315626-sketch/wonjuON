import type { PastelTone } from '@/constants/theme';
import type { News, Notice } from '@/types';
import { formatDay } from '@/utils/date';

/** 홈 '지금 원주 이슈' 카드 한 장 (뉴스나 시청 소식) */
export type Issue = {
  id: string;
  tag: string;
  tone: PastelTone;
  title: string;
  /** 예: "강원일보 · 11월 22일" */
  meta: string;
  url: string;
  date: string;
};

const NOTICE_TONE: Record<Notice['topic'], PastelTone> = {
  '생활·안전': 'peach',
  '지원·혜택': 'butter',
  '행사·문화': 'mint',
  '모집·채용': 'lilac',
};

/**
 * 뉴스와 시청 소식을 섞어 최근 것부터 고릅니다.
 * 한쪽이 다 차지하지 않도록 뉴스는 최대 6건, 시청 소식은 최대 3건까지.
 */
export function pickIssues(news: News[], notices: Notice[], limit = 8): Issue[] {
  const fromNews: Issue[] = news.slice(0, 6).map((n) => ({
    id: `news-${n.id}`,
    tag: '뉴스',
    tone: 'lilac',
    title: n.title,
    meta: `${n.press} · ${formatDay(n.date)}`,
    url: n.url,
    date: n.date,
  }));
  const fromNotices: Issue[] = notices.slice(0, 3).map((n) => ({
    id: `notice-${n.id}`,
    tag: n.topic,
    tone: NOTICE_TONE[n.topic] ?? 'peach',
    title: n.title,
    meta: `원주시 ${n.board} · ${formatDay(n.date)}`,
    url: n.url,
    date: n.date,
  }));
  // 같은 날이면 순서를 지키는 안정 정렬이라 뉴스가 먼저 나옴
  return [...fromNews, ...fromNotices].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}
