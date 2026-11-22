import type { EventItem } from '@/types';

import data from './events.json';

/**
 * TourAPI에서 수집한 원주 행사 (scripts/fetch-events.mjs 가 만든 파일).
 * 다음 단계에서 Firebase(Firestore)에서 읽어오도록 바꿉니다.
 */
export const events = data.events as EventItem[];
export const eventsFetchedAt: string = data.fetchedAt;
