import { EventCard } from '@/components/event-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useEvents } from '@/data/events';
import { formatUpdatedAt, splitEvents } from '@/utils/date';

/** 지난 행사는 최근 것만 이만큼 보여줌 */
const PAST_LIMIT = 10;

export default function EventsScreen() {
  // TODO: 이번 주말·무료 필터, 달력 보기, 관심 행사 알림
  const { events, fetchedAt } = useEvents();
  const { ongoing, upcoming, past } = splitEvents(events);
  const current = [...ongoing, ...upcoming];

  return (
    <Screen title="행사" emoji="🎪" subtitle={`원주 축제·공연·행사 · ${formatUpdatedAt(fetchedAt)} 갱신`}>
      <ThemedText type="smallBold">진행 중·예정</ThemedText>
      {current.length === 0 ? (
        <ThemedText themeColor="textSecondary">
          지금 진행 중이거나 예정된 행사가 없어요. 새 행사가 등록되면 여기에 보여요.
        </ThemedText>
      ) : (
        current.map((e) => <EventCard key={e.id} item={e} />)
      )}

      {past.length > 0 ? (
        <>
          <ThemedText type="smallBold">지난 행사</ThemedText>
          {past.slice(0, PAST_LIMIT).map((e) => (
            <EventCard key={e.id} item={e} dimmed />
          ))}
        </>
      ) : null}
    </Screen>
  );
}
