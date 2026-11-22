/**
 * TourAPI 원주 행사를 Firestore 의 events 컬렉션에 저장합니다.
 * GitHub Actions 가 매일 실행합니다 (.github/workflows/sync-events.yml).
 *
 *   npm run sync:events
 *
 * 필요한 환경 변수:
 *   TOURAPI_KEY               공공데이터포털 인증키
 *   FIREBASE_SERVICE_ACCOUNT  Firebase 서비스 계정 키 JSON (파일 내용 전체)
 *
 * 저장 구조:
 *   events/{id}        행사 하나 (앱의 EventItem 과 같은 필드)
 *   meta/events        { fetchedAt, count }
 * TourAPI 에서 사라진 행사(source 가 TourAPI 인 문서)는 지웁니다. 관리자가 직접 넣은 행사는 건드리지 않습니다.
 */
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import { fetchWonjuEvents, requireKey } from './tourapi.mjs';

const SOURCE = '한국관광공사 TourAPI';

function serviceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    console.error('FIREBASE_SERVICE_ACCOUNT 가 없습니다 (서비스 계정 키 JSON 전체).');
    process.exit(1);
  }
  return JSON.parse(raw);
}

try {
  const key = requireKey();
  initializeApp({ credential: cert(serviceAccount()) });
  const db = getFirestore();
  db.settings({ ignoreUndefinedProperties: true });

  const events = await fetchWonjuEvents(key);
  const keep = new Set(events.map((e) => e.id));

  const existing = await db.collection('events').where('source', '==', SOURCE).get();
  const stale = existing.docs.filter((d) => !keep.has(d.id));

  const batch = db.batch();
  for (const e of events) batch.set(db.collection('events').doc(e.id), e);
  for (const d of stale) batch.delete(d.ref);
  const fetchedAt = new Date().toISOString();
  batch.set(db.doc('meta/events'), { fetchedAt, count: events.length });
  await batch.commit();

  console.log(`Firestore 에 원주 행사 ${events.length}건 저장, ${stale.length}건 삭제 (${fetchedAt})`);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
