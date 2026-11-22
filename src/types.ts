/** 맛집 한 곳. TourAPI 음식점 정보, 나중에는 운영자가 직접 고른 곳도 같은 형태로 저장. */
export type Restaurant = {
  id: string;
  name: string;
  /** TourAPI 분류(FD01~05)를 따름 */
  category: '한식' | '외국식' | '간이음식' | '주점' | '카페·찻집' | '기타';
  /** 읍·면·동 (주소에서 뽑음, 못 찾으면 "원주시") */
  dong: string;
  address: string;
  /** 대표 메뉴 */
  mainMenu?: string;
  /** 그 밖의 메뉴 */
  menus?: string;
  /** 예: "11:00~19:30 (마지막 주문 19:00)" */
  hours?: string;
  /** 예: "매주 월요일", "연중무휴" */
  closedDays?: string;
  parking?: string;
  phone?: string;
  /** 운영자가 쓴 한 줄 추천 이유 (직접 고른 곳만) */
  localTip?: string;
  badges: ('착한가격' | '모범음식점' | '주민추천')[];
  imageUrl?: string;
  /** 공공누리 유형 (Type1: 출처표시, Type3: 출처표시+변경금지) */
  imageLicense?: string;
  lat?: number;
  lng?: number;
  /** 정보 출처 표시용 */
  source: string;
  sourceId?: string;
};

/** 축제·공연·행사 하나. 한국관광공사 TourAPI 분류(EV01~03)를 따름. */
export type EventItem = {
  id: string;
  title: string;
  category: '축제' | '공연' | '행사';
  /** YYYY-MM-DD */
  startDate: string;
  /** YYYY-MM-DD */
  endDate: string;
  place: string;
  address?: string;
  /** 예: "무료", "유료" */
  fee?: string;
  playtime?: string;
  host?: string;
  tel?: string;
  overview?: string;
  imageUrl?: string;
  /** 공공누리 유형 (Type1: 출처표시, Type3: 출처표시+변경금지) */
  imageLicense?: string;
  lat?: number;
  lng?: number;
  source: string;
  sourceId?: string;
};
