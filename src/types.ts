/** 맛집 한 곳. 공공데이터(TourAPI 등)와 운영자가 직접 입력한 정보를 합친 형태. */
export type Restaurant = {
  id: string;
  name: string;
  category: '한식' | '국수·면' | '고기' | '카페·디저트' | '분식' | '기타';
  /** 읍·면·동 */
  dong: string;
  address: string;
  mainMenu: string;
  /** 예: "11:00~21:00, 월요일 휴무" */
  hours: string;
  phone?: string;
  /** 운영자가 쓴 한 줄 추천 이유 */
  localTip?: string;
  badges: ('착한가격' | '모범음식점' | '주민추천')[];
  /** 정보 출처 표시용 */
  source: string;
};

/** 축제·공연·체험 등 행사 하나. */
export type EventItem = {
  id: string;
  title: string;
  category: '축제' | '공연' | '전시' | '체험·교육';
  /** YYYY-MM-DD */
  startDate: string;
  /** YYYY-MM-DD */
  endDate: string;
  place: string;
  fee: string;
  host: string;
  source: string;
  url?: string;
};
