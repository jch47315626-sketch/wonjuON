/**
 * TourAPI 원주 행사를 src/data/events.json 으로 저장합니다 (앱에 기본으로 들어가는 데이터).
 *
 *   npm run fetch:events
 *
 * 인증키는 .env.local 의 TOURAPI_KEY 에서 읽습니다(저장소에 올리지 않음).
 */
import { writeFile } from 'node:fs/promises';

import { fetchWonjuEvents, requireKey } from './tourapi.mjs';

const OUT = new URL('../src/data/events.json', import.meta.url);

try {
  const events = await fetchWonjuEvents(requireKey());
  const out = { fetchedAt: new Date().toISOString(), events };
  await writeFile(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(`원주 행사 ${events.length}건을 저장했습니다 → src/data/events.json`);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
