import type { Restaurant } from '@/types';

/**
 * 화면 개발용 예시 맛집입니다. 실제 가게가 아닙니다.
 * 다음 단계에서 운영자가 고른 실제 맛집 + TourAPI 음식점 정보로 바꿉니다.
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
