/**
 * 네이버 뉴스에서 고른 원주 뉴스를 Firestore 에 저장합니다. 홈 화면 '지금 원주 이슈'에 나옵니다.
 * GitHub Actions 가 낮 동안 몇 시간마다 실행합니다 (.github/workflows/sync-news.yml).
 *
 *   npm run sync:news     Firestore 에 저장 (NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, FIREBASE_SERVICE_ACCOUNT 필요)
 *   npm run fetch:news    Firestore 없이 src/data/news.json 으로 저장 (미리보기)
 *
 * 저장 구조:
 *   news/{주소 해시}   앱의 News 와 같은 필드
 *   meta/news          { fetchedAt, count }
 * 7일이 지난 뉴스는 지웁니다.
 */
import { writeFile } from 'node:fs/promises';

import { fetchWonjuNews, SOURCE } from './naver-news.mjs';

const KEEP_DAYS = 7;

async function saveFile(items) {
  const out = { fetchedAt: new Date().toISOString(), items };
  await writeFile(new URL('../src/data/news.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
  console.log(`news: ${items.length}건 → src/data/news.json`);
  for (const n of items) console.log(`- ${n.date} [${n.press}] ${n.title}`);
}

async function saveFirestore(items) {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT 가 없습니다 (서비스 계정 키 JSON 전체).');
  const { cert, initializeApp } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');
  initializeApp({ credential: cert(JSON.parse(raw)) });
  const db = getFirestore();
  db.settings({ ignoreUndefinedProperties: true });

  const cutoff = new Date(Date.now() - KEEP_DAYS * 86400_000).toISOString().slice(0, 10);
  const old = (await db.collection('news').where('date', '<', cutoff).get()).docs.filter(
    (d) => d.get('source') === SOURCE,
  );

  const batch = db.batch();
  items.slice(0, 300).forEach((n) => batch.set(db.collection('news').doc(n.id), n));
  old.slice(0, 150).forEach((d) => batch.delete(d.ref));
  batch.set(db.doc('meta/news'), { fetchedAt: new Date().toISOString(), count: items.length });
  await batch.commit();
  console.log(`news: ${items.length}건 저장, 오래된 ${Math.min(old.length, 150)}건 삭제`);
}

try {
  const items = await fetchWonjuNews();
  if (process.argv.includes('--file')) await saveFile(items);
  else await saveFirestore(items);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
