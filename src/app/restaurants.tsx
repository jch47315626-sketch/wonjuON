import { RestaurantCard } from '@/components/restaurant-card';
import { Screen } from '@/components/screen';
import { sampleRestaurants } from '@/data/sample';

export default function RestaurantsScreen() {
  // TODO: 분류·동네·"지금 영업 중" 필터, 지도 보기
  return (
    <Screen title="맛집" subtitle="원주 사람이 실제로 가는 곳">
      {sampleRestaurants.map((r) => (
        <RestaurantCard key={r.id} item={r} />
      ))}
    </Screen>
  );
}
