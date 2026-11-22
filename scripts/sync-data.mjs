/**
 * TourAPI 원주 행사·음식점을 Firestore 에 저장합니다.
 * GitHub Actions 가 매일 실행합니다 (.github/workflows/sync-events.yml).
 *
 *   npm run sync:data
 *
 * 필요한 환경 변수:
 *   TOURAPI_KEY               공공데이터포털 인증키
 *   FIREBASE_SERVICE_ACCOUNT  Firebase 서비스 계정 키 JSON (파일 내용 전체)
 *
 * 저장 구조:
 *   events/{id}, restaurants/{id}    앱의 EventItem, Restaurant 와 같은 필드
 *   meta/events, meta/restaurants    { fetchedAt, count }
 * TourAPI 에서 사라진 항목(source 가 TourAPI 인 문서)은 지웁니다.
 * 운영자가 직접 넣은 문서(source 가 다른 값)는 건드리지 않습니다.
 */
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import { fetchWonjuEvents, fetchWonjuRestaurants, requireKey, SOURCE } from './tourapi.mjs';

function serviceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    console.error('FIREBASE_SERVICE_ACCOUNT 가 없습니다 (서비스 계정 키 JSON 전체).');
    process.exit(1);
  }
  return JSON.parse(raw);
}

async function sync(db, name, items) {
  const keep = new Set(items.map((x) => x.id));
  const existing = await db.collection(name).where('source', '==', SOURCE).get();
  const stale = existing.docs.filter((d) => !keep.has(d.id));

  // 한 번에 최대 500건까지 쓸 수 있어 나눠서 씀
  const writes = [
    ...items.map((x) => (b) => b.set(db.collection(name).doc(x.id), x)),
    ...stale.map((d) => (b) => b.delete(d.ref)),
  ];
  for (let i = 0; i < writes.length; i += 400) {
    const batch = db.batch();
    writes.slice(i, i + 400).forEach((w) => w(batch));
    await batch.commit();
  }
  const fetchedAt = new Date().toISOString();
  await db.doc(`meta/${name}`).set({ fetchedAt, count: items.length });
  console.log(`${name}: ${items.length}건 저장, ${stale.length}건 삭제 (${fetchedAt})`);
}

try {
  const key = requireKey();
  initializeApp({ credential: cert(serviceAccount()) });
  const db = getFirestore();
  db.settings({ ignoreUndefinedProperties: true });

  await sync(db, 'events', await fetchWonjuEvents(key));
  await sync(db, 'restaurants', await fetchWonjuRestaurants(key));
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
