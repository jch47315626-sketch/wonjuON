import { Link } from 'expo-router';
import { Pressable } from 'react-native';

import { EventCard } from '@/components/event-card';
import { RestaurantCard } from '@/components/restaurant-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { sampleEvents, sampleRestaurants } from '@/data/sample';
import { byStartDate } from '@/utils/date';

export default function HomeScreen() {
  const events = [...sampleEvents].sort(byStartDate).slice(0, 3);
  const restaurants = sampleRestaurants.slice(0, 3);

  return (
    <Screen title="원주ON" subtitle="오늘 원주에서 뭐 먹고, 어디 갈까?">
      <SectionHeader title="다가오는 행사" href="/events" />
      {events.map((e) => (
        <EventCard key={e.id} item={e} />
      ))}

      <SectionHeader title="주민 추천 맛집" href="/restaurants" />
      {restaurants.map((r) => (
        <RestaurantCard key={r.id} item={r} />
      ))}
    </Screen>
  );
}

function SectionHeader({ title, href }: { title: string; href: '/events' | '/restaurants' }) {
  return (
    <Link href={href} asChild>
      <Pressable>
        <ThemedText type="smallBold">{title} ›</ThemedText>
      </Pressable>
    </Link>
  );
}
