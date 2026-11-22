import type { EventItem } from '@/types';

/** "2026-12-05" → "12월 5일" */
export function formatDay(iso: string): string {
  const [, m, d] = iso.split('-').map(Number);
  return `${m}월 ${d}일`;
}

/** 시작일과 종료일이 같으면 하루만, 다르면 "12월 5일 ~ 12월 31일". */
export function formatPeriod(start: string, end: string): string {
  return start === end ? formatDay(start) : `${formatDay(start)} ~ ${formatDay(end)}`;
}

/** 기기 시간대 기준 오늘 날짜 "YYYY-MM-DD" */
export function todayIso(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** ISO 시각 → "11월 22일 20:58" (기기 시간대) */
export function formatUpdatedAt(isoDateTime: string): string {
  const t = new Date(isoDateTime);
  const hh = String(t.getHours()).padStart(2, '0');
  const mm = String(t.getMinutes()).padStart(2, '0');
  return `${formatDay(todayIso(t))} ${hh}:${mm}`;
}

/**
 * 행사를 진행 중 / 예정 / 지난 행사로 나눔.
 * 진행 중·예정은 시작일 순, 지난 행사는 최근에 끝난 순.
 * (YYYY-MM-DD 는 문자열 비교로 날짜 비교가 됨)
 */
export function splitEvents(list: EventItem[], today: string = todayIso()) {
  const ongoing = list
    .filter((e) => e.startDate <= today && today <= e.endDate)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const upcoming = list
    .filter((e) => e.startDate > today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const past = list
    .filter((e) => e.endDate < today)
    .sort((a, b) => b.endDate.localeCompare(a.endDate));
  return { ongoing, upcoming, past };
}
