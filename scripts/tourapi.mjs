/**
 * 한국관광공사 TourAPI(KorService2)에서 원주시 행사·음식점을 받아 앱 형식(EventItem, Restaurant)으로 바꿉니다.
 * fetch-data.mjs(앱 기본 데이터 파일 저장)와 sync-data.mjs(Firestore 저장)가 함께 씁니다.
 */
const BASE = 'https://apis.data.go.kr/B551011/KorService2';
// 법정동 코드: 강원특별자치도(51) 원주시(130). 옛 areaCode=32/sigunguCode=9 는 결과가 0건이라 쓰지 않음.
const REGION = { lDongRegnCd: '51', lDongSignguCd: '130' };
// 분류 코드(lclsSystm2) → 앱 분류
const CATEGORY = {
  EV01: '축제',
  EV02: '공연',
  EV03: '행사',
  FD01: '한식',
  FD02: '외국식',
  FD03: '간이음식',
  FD04: '주점',
  FD05: '카페·찻집',
};
export const SOURCE = '한국관광공사 TourAPI';
// 오늘 기준 이만큼 이전에 시작한 행사부터 가져옴 (지난 행사도 일부 보여주기 위해)
const LOOKBACK_DAYS = 365;

export function requireKey() {
  const key = process.env.TOURAPI_KEY;
  if (!key) {
    console.error('TOURAPI_KEY 가 없습니다. .env.example 을 .env.local 로 복사하고 키를 넣어 주세요.');
    process.exit(1);
  }
  return key;
}

async function call(key, op, params) {
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
    // "11:30~22:00- 준비시간 15:00~17:30- 마지막 주문" 처럼 붙어 오는 목록을 줄바꿈
    .replace(/(?<=\S)- (?=\S)/g, '\n- ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const orUndefined = (s) => (s ? s : undefined);

function startDateParam() {
  const d = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10).replaceAll('-', '');
}

/** 원주 행사 목록을 시작일 순으로 돌려줌 */
export async function fetchWonjuEvents(key) {
  const list = await call(key, 'searchFestival2', {
    ...REGION,
    eventStartDate: startDateParam(),
    numOfRows: '100',
    pageNo: '1',
    arrange: 'A',
  });

  const events = [];
  for (const it of list) {
    const [intro] = await call(key, 'detailIntro2', { contentId: it.contentid, contentTypeId: '15' });
    const [common] = await call(key, 'detailCommon2', { contentId: it.contentid });
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
      source: SOURCE,
      sourceId: it.contentid,
    });
  }

  events.sort((a, b) => a.startDate.localeCompare(b.startDate));
  return events;
}

/**
 * 주소에서 읍·면·동을 뽑음.
 * "강원특별자치도 원주시 소방서길 10-1 (명륜동)" → "명륜동"
 * "강원특별자치도 원주시 지정면 작압길 183" → "지정면"
 */
export function dongFromAddress(addr) {
  const paren = addr.match(/\(([^,)]+?[동읍면리])(?:,[^)]*)?\)/);
  if (paren) return paren[1];
  const word = addr.match(/원주시\s+(\S+[읍면동])(?:\s|$)/);
  return word ? word[1] : '원주시';
}

/** 원주 음식점 목록을 이름 순으로 돌려줌 */
export async function fetchWonjuRestaurants(key) {
  const list = [];
  for (let page = 1; ; page++) {
    const items = await call(key, 'areaBasedList2', {
      ...REGION,
      contentTypeId: '39',
      numOfRows: '100',
      pageNo: String(page),
      arrange: 'C',
    });
    list.push(...items);
    if (items.length < 100) break;
  }

  const restaurants = [];
  for (const it of list) {
    const [intro] = await call(key, 'detailIntro2', { contentId: it.contentid, contentTypeId: '39' });
    const address = clean(it.addr1);
    restaurants.push({
      id: `tour-${it.contentid}`,
      name: clean(it.title),
      category: CATEGORY[it.lclsSystm2] ?? '기타',
      dong: dongFromAddress(address),
      address,
      mainMenu: orUndefined(clean(intro?.firstmenu)),
      menus: orUndefined(clean(intro?.treatmenu)),
      hours: orUndefined(clean(intro?.opentimefood)),
      closedDays: orUndefined(clean(intro?.restdatefood)),
      parking: orUndefined(clean(intro?.parkingfood)),
      phone: orUndefined(clean(intro?.infocenterfood) || clean(it.tel)),
      badges: it.lclsSystm3 === 'FD010200' ? ['모범음식점'] : [],
      imageUrl: orUndefined(it.firstimage),
      imageLicense: orUndefined(it.cpyrhtDivCd),
      lat: it.mapy ? Number(it.mapy) : undefined,
      lng: it.mapx ? Number(it.mapx) : undefined,
      source: SOURCE,
      sourceId: it.contentid,
    });
  }

  restaurants.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  return restaurants;
}
