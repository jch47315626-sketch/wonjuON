/** "2026-12-05" → "12월 5일" */
export function formatDay(iso: string): string {
  const [, m, d] = iso.split('-').map(Number);
  return `${m}월 ${d}일`;
}

/** 시작일과 종료일이 같으면 하루만, 다르면 "12월 5일 ~ 12월 31일". */
export function formatPeriod(start: string, end: string): string {
  return start === end ? formatDay(start) : `${formatDay(start)} ~ ${formatDay(end)}`;
}

/** 행사 시작일 순으로 정렬 (YYYY-MM-DD는 문자열 비교로 정렬됨). */
export function byStartDate<T extends { startDate: string }>(a: T, b: T): number {
  return a.startDate.localeCompare(b.startDate);
}
