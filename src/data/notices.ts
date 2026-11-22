import type { Notice } from '@/types';

import bundled from './notices.json';
import { useCollection } from './use-collection';

/** 원주시청 게시판에서 고른 주민 관심 소식 (하루 2번 수집, Firestore notices 컬렉션). 최근 글 먼저. */
export function useNotices() {
  const { items, fetchedAt, origin } = useCollection<Notice>('notices', bundled);
  const notices = [...items].sort(
    (a, b) => b.date.localeCompare(a.date) || Number(b.sourceId ?? 0) - Number(a.sourceId ?? 0),
  );
  return { notices, fetchedAt, origin };
}
