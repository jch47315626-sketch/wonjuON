/**
 * 한국관광공사 TourAPI(KorService2)에서 원주시 행사를 받아 src/data/events.json 으로 저장합니다.
 *
 *   npm run fetch:events
 *
 * 인증키는 .env.local 의 TOURAPI_KEY 에서 읽습니다(저장소에 올리지 않음).
 * 나중에 Firebase Cloud Functions 로 옮겨 매일 자동 수집할 때도 이 로직을 그대로 씁니다.
 */
import { writeFile } from 'node:fs/promises';

const BASE = 'https://apis.data.go.kr/B551011/KorService2';
// 법정동 코드: 강원특별자치도(51) 원주시(130). 옛 areaCode=32/sigunguCode=9 는 결과가 0건이라 쓰지 않음.
const REGION = { lDongRegnCd: '51', lDongSignguCd: '130' };
// 분류 코드(lclsSystm2) → 앱 분류
const CATEGORY = { EV01: '축제', EV02: '공연', EV03: '행사' };
// 오늘 기준 이만큼 이전에 시작한 행사부터 가져옴 (지난 행사도 일부 보여주기 위해)
const LOOKBACK_DAYS = 365;
const OUT = new URL('../src/data/events.json', import.meta.url);

const key = process.env.TOURAPI_KEY;
if (!key) {
  console.error('TOURAPI_KEY 가 없습니다. .env.example 을 .env.local 로 복사하고 키를 넣어 주세요.');
  process.exit(1);
}

async function call(op, params) {
  const qs = new URLSearchParams({
    MobileOS: 'ETC',
    MobileApp: 'wonjuON',
    _type: 'json',
    ...params,
  });
  // serviceKey 는 이미 인코딩된 키일 수 있으므로 URLSearchParams 로 다시 인코딩하지 않음
  const url = `${BASE}/${op}?serviceKey=${key}&${qs}`;
  const res = await fetch(url);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`${op}: JSON 이 아닌 응답 (HTTP ${res.status}): ${text.slice(0, 200)}`);
  }
  const header = json.response?.header;
  if (header?.resultCode !== '0000') {
    throw new Error(`${op}: ${header?.resultCode} ${header?.resultMsg}`);
  }
  const items = json.response.body.items;
  return items ? items.item : [];
}

/** "20260425" → "2026-04-25" */
const toIso = (yyyymmdd) => `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;

/** TourAPI 문자열에 섞여 오는 <br>, 링크 태그 등을 걷어냄 */
const clean = (s) =>
  (s ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const orUndefined = (s) => (s ? s : undefined);

function startDateParam() {
  const d = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10).replaceAll('-', '');
}

async function main() {
  const list = await call('searchFestival2', {
    ...REGION,
    eventStartDate: startDateParam(),
    numOfRows: '100',
    pageNo: '1',
    arrange: 'A',
  });

  const events = [];
  for (const it of list) {
    const [intro] = await call('detailIntro2', { contentId: it.contentid, contentTypeId: '15' });
    const [common] = await call('detailCommon2', { contentId: it.contentid });
    events.push({
      id: `tour-${it.contentid}`,
      title: clean(it.title),
      category: CATEGORY[it.lclsSystm2] ?? '행사',
      startDate: toIso(it.eventstartdate),
      endDate: toIso(it.eventenddate),
      place: clean(intro?.eventplace) || clean(it.addr1),
      address: orUndefined(clean(it.addr1)),
      fee: orUndefined(clean(intro?.usetimefestival)),
      playtime: orUndefined(clean(intro?.playtime)),
      host: orUndefined(clean(intro?.sponsor1)),
      tel: orUndefined(clean(it.tel)),
      overview: orUndefined(clean(common?.overview)),
      imageUrl: orUndefined(it.firstimage),
      // 공공누리 유형 (Type1: 출처표시, Type3: 출처표시+변경금지)
      imageLicense: orUndefined(it.cpyrhtDivCd),
      lat: it.mapy ? Number(it.mapy) : undefined,
      lng: it.mapx ? Number(it.mapx) : undefined,
      source: '한국관광공사 TourAPI',
      sourceId: it.contentid,
    });
  }

  events.sort((a, b) => a.startDate.localeCompare(b.startDate));
  const out = { fetchedAt: new Date().toISOString(), events };
  await writeFile(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(`원주 행사 ${events.length}건을 저장했습니다 → src/data/events.json`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
