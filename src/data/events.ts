import type { EventItem } from '@/types';

import bundled from './events.json';
import { useCollection } from './use-collection';

/** 원주 행사 목록 (TourAPI 수집, Firestore events 컬렉션) */
export function useEvents() {
  const { items, fetchedAt, origin } = useCollection<EventItem>('events', bundled);
  return { events: items, fetchedAt, origin };
}
