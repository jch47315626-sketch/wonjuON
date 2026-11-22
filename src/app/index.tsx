import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { EventCard } from '@/components/event-card';
import { IssueCarousel } from '@/components/issue-carousel';
import { MiniRestaurantCard } from '@/components/mini-restaurant-card';
import { NoticeCard } from '@/components/notice-card';
import { QuickMenu } from '@/components/quick-menu';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { WonjuHero } from '@/components/wonju-hero';
import { Spacing } from '@/constants/theme';
import { useEvents } from '@/data/events';
import { pickIssues } from '@/data/issues';
import { useNews } from '@/data/news';
import { useNotices } from '@/data/notices';
import { pickOfTheDay, useRestaurants } from '@/data/restaurants';
import { splitEvents } from '@/utils/date';

export default function HomeScreen() {
  const { events } = useEvents();
  const { ongoing, upcoming } = splitEvents(events);
  const current = [...ongoing, ...upcoming].slice(0, 3);
  const { restaurants: all } = useRestaurants();
  const restaurants = pickOfTheDay(all, 2);
  const { notices } = useNotices();
  const { news } = useNews();
  const issues = pickIssues(news, notices);
  const [showAllNotices, setShowAllNotices] = useState(false);
  const shownNotices = showAllNotices ? notices : notices.slice(0, 3);

  return (
    <Screen title="원주ON" hero={(top) => <WonjuHero topInset={top} />}>
      <SectionHeader title="🔥 지금 원주 이슈" />
      {issues.length === 0 ? (
        <ThemedText themeColor="textSecondary">새 소식을 모으는 중이에요.</ThemedText>
      ) : (
        <IssueCarousel issues={issues} />
      )}

      <SectionHeader title="무엇을 찾으세요?" />
      <QuickMenu />

      <SectionHeader title="오늘의 원주 맛집" href="/restaurants" />
      <View style={styles.pair}>
        {restaurants.map((r) => (
          <MiniRestaurantCard key={r.id} item={r} />
        ))}
      </View>

      <SectionHeader title="진행 중·다가오는 행사" href="/events" />
      {current.length === 0 ? (
        <ThemedText themeColor="textSecondary">
          지금은 예정된 행사가 없어요. 행사 탭에서 지난 행사를 볼 수 있어요.
        </ThemedText>
      ) : (
        current.map((e) => <EventCard key={e.id} item={e} />)
      )}

      <SectionHeader title="원주시청 소식" />
      {notices.length === 0 ? (
        <ThemedText themeColor="textSecondary">최근 2주 동안 올라온 시청 소식이 없어요.</ThemedText>
      ) : (
        shownNotices.map((n) => <NoticeCard key={n.id} item={n} />)
      )}
      {notices.length > 3 ? (
        <Pressable onPress={() => setShowAllNotices((v) => !v)} accessibilityRole="button">
          <ThemedText type="smallBold" themeColor="accentText" style={styles.more}>
            {showAllNotices ? '접기' : `시청 소식 ${notices.length - 3}건 더 보기`}
          </ThemedText>
        </Pressable>
      ) : null}
    </Screen>
  );
}

function SectionHeader({ title, href }: { title: string; href?: '/events' | '/restaurants' }) {
  return (
    <View style={styles.header}>
      <ThemedText style={styles.headerTitle}>{title}</ThemedText>
      {href ? (
        <Link href={href} asChild>
          <Pressable accessibilityRole="link" hitSlop={8}>
            <ThemedText type="small" themeColor="textSecondary">
              더보기 ›
            </ThemedText>
          </Pressable>
        </Link>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
    marginBottom: -Spacing.one,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: 700,
  },
  pair: {
    flexDirection: 'row',
    gap: Spacing.two + Spacing.half,
  },
  more: {
    textAlign: 'center',
  },
});
