import type { EventItem, Restaurant } from '@/types';

/**
 * 화면 개발용 예시 데이터입니다. 실제 가게·행사가 아닙니다.
 * 다음 단계에서 Firebase에 저장된 실제 데이터(TourAPI·KOPIS 수집 + 운영자 입력)로 바꿉니다.
 */
export const sampleRestaurants: Restaurant[] = [
  {
    id: 'r1',
    name: '예시 막국수집',
    category: '국수·면',
    dong: '단구동',
    address: '원주시 단구동 (예시 주소)',
    mainMenu: '물막국수 9,000원',
    hours: '11:00~20:00, 화요일 휴무',
    localTip: '점심시간 전에 가면 기다리지 않아요.',
    badges: ['주민추천', '착한가격'],
    source: '예시 데이터',
  },
  {
    id: 'r2',
    name: '예시 한정식',
    category: '한식',
    dong: '반곡동',
    address: '원주시 반곡동 (예시 주소)',
    mainMenu: '점심 정식 13,000원',
    hours: '11:30~21:00',
    localTip: '혁신도시 직장인 점심 단골집.',
    badges: ['모범음식점'],
    source: '예시 데이터',
  },
  {
    id: 'r3',
    name: '예시 베이커리 카페',
    category: '카페·디저트',
    dong: '무실동',
    address: '원주시 무실동 (예시 주소)',
    mainMenu: '아메리카노 4,500원',
    hours: '09:00~22:00',
    localTip: '아이 동반하기 좋은 넓은 매장.',
    badges: ['주민추천'],
    source: '예시 데이터',
  },
];

export const sampleEvents: EventItem[] = [
  {
    id: 'e1',
    title: '예시 겨울 빛 축제',
    category: '축제',
    startDate: '2026-12-05',
    endDate: '2026-12-31',
    place: '원주시 (예시 장소)',
    fee: '무료',
    host: '예시 주최',
    source: '예시 데이터',
  },
  {
    id: 'e2',
    title: '예시 송년 음악회',
    category: '공연',
    startDate: '2026-12-20',
    endDate: '2026-12-20',
    place: '원주시 (예시 공연장)',
    fee: '전석 20,000원',
    host: '예시 주최',
    source: '예시 데이터',
  },
  {
    id: 'e3',
    title: '예시 어린이 공예 체험',
    category: '체험·교육',
    startDate: '2026-12-13',
    endDate: '2026-12-14',
    place: '원주시 (예시 장소)',
    fee: '5,000원',
    host: '예시 주최',
    source: '예시 데이터',
  },
];
