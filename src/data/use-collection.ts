import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { getDb } from '@/lib/firebase';

export type CollectionState<T> = {
  items: T[];
  fetchedAt: string;
  /** 'bundled': 앱에 들어 있는 데이터, 'live': Firestore 에서 받은 최신 데이터 */
  origin: 'bundled' | 'live';
};

type Bundled = { fetchedAt: string; items: unknown[] };

/**
 * 먼저 앱에 들어 있는 데이터(src/data/*.json)를 보여주고,
 * Firebase 가 설정돼 있으면 Firestore 의 {name} 컬렉션과 meta/{name} 문서를 읽어 바꿉니다.
 * 인터넷이 안 되거나 Firestore 가 비어 있으면 앱에 들어 있는 데이터를 그대로 씁니다.
 */
export function useCollection<T extends { id: string }>(
  name: string,
  bundled: Bundled,
): CollectionState<T> {
  const [state, setState] = useState<CollectionState<T>>({
    items: bundled.items as T[],
    fetchedAt: bundled.fetchedAt,
    origin: 'bundled',
  });

  useEffect(() => {
    const db = getDb();
    if (!db) return;
    let cancelled = false;

    (async () => {
      try {
        const [snap, meta] = await Promise.all([
          getDocs(collection(db, name)),
          getDoc(doc(db, 'meta', name)),
        ]);
        if (cancelled || snap.empty) return;
        setState({
          items: snap.docs.map((d) => ({ ...(d.data() as T), id: d.id })),
          fetchedAt: (meta.data()?.fetchedAt as string | undefined) ?? bundled.fetchedAt,
          origin: 'live',
        });
      } catch (e) {
        console.warn(`Firestore 에서 ${name} 을(를) 읽지 못해 앱에 들어 있는 데이터를 씁니다.`, e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [name, bundled]);

  return state;
}
