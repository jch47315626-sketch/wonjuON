import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { ChipRow } from '@/components/chip-row';
import { RestaurantCard } from '@/components/restaurant-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useRestaurants } from '@/data/restaurants';
import type { Restaurant } from '@/types';
import { formatUpdatedAt } from '@/utils/date';

const FILTERS = ['전체', '한식', '카페·찻집', '외국식', '간이음식', '주점'] as const;
type Filter = (typeof FILTERS)[number];

export default function RestaurantsScreen() {
  // TODO: 동네 필터, "지금 영업 중" 필터, 지도 보기, 주민 추천 맛집 따로 모아 보기
  const { restaurants, fetchedAt } = useRestaurants();
  // 홈 바로가기(예: 카페)에서 ?filter=카페·찻집 으로 들어오면 그 분류부터 보여줌
  const params = useLocalSearchParams<{ filter?: string }>();
  const fromLink = FILTERS.find((x) => x === params.filter);
  const [filter, setFilter] = useState<Filter>(fromLink ?? '전체');
  // 탭이 열려 있는 채로 다른 바로가기로 다시 들어오면 그 분류로 바꿈
  const [lastLink, setLastLink] = useState(params.filter);
  if (params.filter !== lastLink) {
    setLastLink(params.filter);
    if (fromLink) setFilter(fromLink);
  }

  const counts = new Map<Restaurant['category'], number>();
  for (const r of restaurants) counts.set(r.category, (counts.get(r.category) ?? 0) + 1);
  const options = FILTERS.filter((f) => f === '전체' || counts.has(f));
  const shown = filter === '전체' ? restaurants : restaurants.filter((r) => r.category === filter);

  return (
    <Screen title="맛집" emoji="🍜" subtitle={`원주 음식점 ${restaurants.length}곳 · ${formatUpdatedAt(fetchedAt)} 갱신`}>
      <ChipRow options={options} value={filter} onChange={setFilter} />
      <ThemedText type="small" themeColor="textSecondary">
        {shown.length}곳
      </ThemedText>
      {shown.map((r) => (
        <RestaurantCard key={r.id} item={r} />
      ))}
    </Screen>
  );
}
