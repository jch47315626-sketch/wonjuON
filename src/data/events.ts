import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { getDb } from '@/lib/firebase';
import type { EventItem } from '@/types';

import bundled from './events.json';

type EventsState = {
  events: EventItem[];
  fetchedAt: string;
  /** 'bundled': 앱에 들어 있는 데이터, 'live': Firestore 에서 받은 최신 데이터 */
  origin: 'bundled' | 'live';
};

const initial: EventsState = {
  events: bundled.events as EventItem[],
  fetchedAt: bundled.fetchedAt,
  origin: 'bundled',
};

/**
 * 원주 행사 목록.
 * 먼저 앱에 들어 있는 데이터(src/data/events.json)를 보여주고,
 * Firebase 가 설정돼 있으면 Firestore 에서 최신 목록을 받아 바꿉니다.
 * 인터넷이 안 되거나 Firestore 가 비어 있으면 앱에 들어 있는 데이터를 그대로 씁니다.
 */
export function useEvents(): EventsState {
  const [state, setState] = useState<EventsState>(initial);

  useEffect(() => {
    const db = getDb();
    if (!db) return;
    let cancelled = false;

    (async () => {
      try {
        const [snap, meta] = await Promise.all([
          getDocs(collection(db, 'events')),
          getDoc(doc(db, 'meta', 'events')),
        ]);
        if (cancelled || snap.empty) return;
        setState({
          events: snap.docs.map((d) => ({ ...(d.data() as EventItem), id: d.id })),
          fetchedAt: (meta.data()?.fetchedAt as string | undefined) ?? initial.fetchedAt,
          origin: 'live',
        });
      } catch (e) {
        console.warn('Firestore 에서 행사를 읽지 못해 앱에 들어 있는 데이터를 씁니다.', e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
