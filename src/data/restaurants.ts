import type { Restaurant } from '@/types';

import bundled from './restaurants.json';
import { useCollection } from './use-collection';

/** 원주 맛집 목록 (TourAPI 음식점 수집, Firestore restaurants 컬렉션) */
export function useRestaurants() {
  const { items, fetchedAt, origin } = useCollection<Restaurant>('restaurants', bundled);
  return { restaurants: items, fetchedAt, origin };
}

/** 사진 있는 곳 중에서 날짜마다 바뀌는 추천 n곳 (홈 화면용) */
export function pickOfTheDay(list: Restaurant[], n: number, now: Date = new Date()): Restaurant[] {
  const withPhoto = list.filter((r) => r.imageUrl);
  const pool = withPhoto.length >= n ? withPhoto : list;
  if (pool.length === 0) return [];
  const day = Math.floor(now.getTime() / 86_400_000);
  const start = (day * n) % pool.length;
  return Array.from({ length: Math.min(n, pool.length) }, (_, i) => pool[(start + i) % pool.length]);
}
