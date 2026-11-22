import { EventCard } from '@/components/event-card';
import { Screen } from '@/components/screen';
import { sampleEvents } from '@/data/sample';
import { byStartDate } from '@/utils/date';

export default function EventsScreen() {
  // TODO: 이번 주말·무료 필터, 달력 보기, 관심 행사 알림
  const events = [...sampleEvents].sort(byStartDate);
  return (
    <Screen title="행사" subtitle="축제·공연·체험을 날짜순으로">
      {events.map((e) => (
        <EventCard key={e.id} item={e} />
      ))}
    </Screen>
  );
}
