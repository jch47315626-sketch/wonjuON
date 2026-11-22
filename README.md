# 원주ON

원주 주민을 위한 생활정보 앱입니다. 첫 버전은 **맛집**과 **행사** 두 가지를 담아 안드로이드와 iOS에 함께 출시합니다.

- 앱: Expo (React Native), Expo Router
- 백엔드(예정): Firebase
- 빌드·출시: EAS Build / EAS Submit (맥 없이 iOS 빌드)

## 화면

하단 탭 4개: 홈 · 맛집 · 행사 · 저장.

- **행사**: 한국관광공사 TourAPI에서 받은 실제 원주 행사 (`src/data/events.json`)
- **맛집**: 아직 `src/data/sample.ts`의 예시 데이터 (실제 가게 아님)

```
src/app/          화면 (파일 하나 = 화면 하나)
  index.tsx       홈: 다가오는 행사, 주민 추천 맛집
  restaurants.tsx 맛집 목록
  events.tsx      행사 목록 (진행 중·예정 / 지난 행사)
  saved.tsx       저장
src/components/   카드, 탭, 공통 화면 틀
src/data/         행사 데이터(TourAPI), 예시 맛집
scripts/          데이터 수집 스크립트
src/types.ts      맛집·행사 데이터 형태
```

## 실행해 보기

Node.js 22.9 이상이 필요합니다.

```bash
npm install
npx expo start
```

- 휴대폰: **Expo Go** 앱을 설치하고 터미널에 뜨는 QR 코드를 찍습니다 (안드로이드·iOS 모두).
- PC 브라우저: 터미널에서 `w`를 누릅니다.

## 행사 데이터 새로 받기

1. [공공데이터포털](https://www.data.go.kr)에서 **한국관광공사_국문 관광정보 서비스_GW** 활용 신청 후 인증키를 받습니다.
2. `.env.example`을 `.env.local`로 복사하고 `TOURAPI_KEY=` 뒤에 키를 넣습니다. `.env.local`은 git에 올라가지 않습니다.
3. 실행:

```bash
npm run fetch:events
```

원주시는 법정동 코드(강원 51, 원주 130)로 조회합니다. 옛 지역코드(areaCode 32, sigunguCode 9)로는 결과가 0건입니다.
사진은 공공누리 제3유형(출처표시, 변경금지)이라 자르기·보정 없이 출처와 함께 씁니다.

## 확인 명령

```bash
npm run typecheck   # 타입 검사
npm run lint        # 린트
```
