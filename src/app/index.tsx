import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable } from 'react-native';

import { EventCard } from '@/components/event-card';
import { NoticeCard } from '@/components/notice-card';
import { RestaurantCard } from '@/components/restaurant-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useEvents } from '@/data/events';
import { useNotices } from '@/data/notices';
import { pickOfTheDay, useRestaurants } from '@/data/restaurants';
import { splitEvents } from '@/utils/date';

export default function HomeScreen() {
  const { events } = useEvents();
  const { ongoing, upcoming } = splitEvents(events);
  const current = [...ongoing, ...upcoming].slice(0, 3);
  const { restaurants: all } = useRestaurants();
  const restaurants = pickOfTheDay(all, 3);
  const { notices } = useNotices();
  const [showAllNotices, setShowAllNotices] = useState(false);
  const shownNotices = showAllNotices ? notices : notices.slice(0, 3);

  return (
    <Screen title="원주ON" subtitle="오늘 원주에서 뭐 먹고, 어디 갈까?">
      <SectionHeader title="진행 중·다가오는 행사" href="/events" />
      {current.length === 0 ? (
        <ThemedText themeColor="textSecondary">
          지금은 예정된 행사가 없어요. 행사 탭에서 지난 행사를 볼 수 있어요.
        </ThemedText>
      ) : (
        current.map((e) => <EventCard key={e.id} item={e} />)
      )}

      <SectionHeader title="오늘의 원주 맛집" href="/restaurants" />
      {restaurants.map((r) => (
        <RestaurantCard key={r.id} item={r} />
      ))}

      <ThemedText type="smallBold">원주시청 소식</ThemedText>
      {notices.length === 0 ? (
        <ThemedText themeColor="textSecondary">최근 2주 동안 올라온 시청 소식이 없어요.</ThemedText>
      ) : (
        shownNotices.map((n) => <NoticeCard key={n.id} item={n} />)
      )}
      {notices.length > 3 ? (
        <Pressable onPress={() => setShowAllNotices((v) => !v)} accessibilityRole="button">
          <ThemedText type="smallBold" themeColor="textSecondary">
            {showAllNotices ? '접기' : `시청 소식 ${notices.length - 3}건 더 보기`}
          </ThemedText>
        </Pressable>
      ) : null}
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
