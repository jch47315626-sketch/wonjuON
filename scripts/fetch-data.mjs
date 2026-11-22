/**
 * TourAPI 원주 행사·음식점을 앱 기본 데이터 파일로 저장합니다.
 *   src/data/events.json, src/data/restaurants.json
 *
 *   npm run fetch:data
 *
 * 인증키는 .env.local 의 TOURAPI_KEY 에서 읽습니다(저장소에 올리지 않음).
 * 앱은 이 파일을 먼저 보여주고, Firestore 에서 최신 데이터를 받으면 바꿔 보여줍니다.
 */
import { writeFile } from 'node:fs/promises';

import { fetchWonjuEvents, fetchWonjuRestaurants, requireKey } from './tourapi.mjs';

async function save(name, items) {
  const out = { fetchedAt: new Date().toISOString(), items };
  await writeFile(new URL(`../src/data/${name}.json`, import.meta.url), JSON.stringify(out, null, 2) + '\n');
  console.log(`${name}: ${items.length}건 → src/data/${name}.json`);
}

try {
  const key = requireKey();
  await save('events', await fetchWonjuEvents(key));
  await save('restaurants', await fetchWonjuRestaurants(key));
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
