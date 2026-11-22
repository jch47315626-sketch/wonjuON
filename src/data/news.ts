import type { News } from '@/types';

import bundled from './news.json';
import { useCollection } from './use-collection';

/** 네이버 뉴스에서 모은 원주 뉴스 (낮 동안 3시간마다 수집, Firestore news 컬렉션). 최근 기사 먼저. */
export function useNews() {
  const { items, fetchedAt, origin } = useCollection<News>('news', bundled);
  const news = [...items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return { news, fetchedAt, origin };
}
