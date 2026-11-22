/**
 * 원주시청 게시판에서 고른 '시청 소식'을 Firestore 에 저장합니다.
 * GitHub Actions 가 하루 2번 실행합니다 (.github/workflows/sync-notices.yml).
 *
 *   npm run sync:notices          Firestore 에 저장 (FIREBASE_SERVICE_ACCOUNT 필요)
 *   npm run fetch:notices         Firestore 없이 src/data/notices.json 으로 저장 (앱 기본 데이터, 미리보기)
 *
 * 저장 구조:
 *   notices/{게시판번호-글번호}   앱의 Notice 와 같은 필드
 *   meta/notices                 { fetchedAt, count }
 * 45일이 지난 시청 소식은 지웁니다. 운영자가 직접 넣은 문서(source 가 다른 값)는 건드리지 않습니다.
 */
import { writeFile } from 'node:fs/promises';

import { fetchWonjuNotices, SOURCE } from './wonju-notices.mjs';

const KEEP_DAYS = 45;

async function saveFile(items) {
  const out = { fetchedAt: new Date().toISOString(), items };
  await writeFile(new URL('../src/data/notices.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
  console.log(`notices: ${items.length}건 → src/data/notices.json`);
  for (const n of items) console.log(`- [${n.topic}] ${n.date} ${n.title}`);
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
  // 필드 하나로만 조회해야 Firestore 색인을 따로 만들 필요가 없음
  const old = (await db.collection('notices').where('date', '<', cutoff).get()).docs.filter(
    (d) => d.get('source') === SOURCE,
  );

  const batch = db.batch();
  // 같은 글은 덮어써서 제목·요약이 바뀌면 따라감. 하루 2번이라 건수가 적어 한 번에 씀(최대 500).
  items.slice(0, 450).forEach((n) => batch.set(db.collection('notices').doc(n.id), n));
  old.slice(0, 40).forEach((d) => batch.delete(d.ref));
  batch.set(db.doc('meta/notices'), { fetchedAt: new Date().toISOString(), count: items.length });
  await batch.commit();
  console.log(`notices: ${items.length}건 저장, 오래된 ${Math.min(old.length, 40)}건 삭제`);
}

try {
  const items = await fetchWonjuNotices();
  if (process.argv.includes('--file')) await saveFile(items);
  else await saveFirestore(items);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
