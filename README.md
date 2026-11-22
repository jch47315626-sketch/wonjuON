# 원주ON

원주 주민을 위한 생활정보 앱입니다. 첫 버전은 **맛집**과 **행사** 두 가지를 담아 안드로이드와 iOS에 함께 출시합니다.

- 앱: Expo (React Native), Expo Router
- 백엔드(예정): Firebase
- 빌드·출시: EAS Build / EAS Submit (맥 없이 iOS 빌드)

## 화면

하단 탭 4개: 홈 · 맛집 · 행사 · 저장. 지금은 `src/data/sample.ts`의 **예시 데이터**를 보여줍니다(실제 가게·행사 아님).

```
src/app/          화면 (파일 하나 = 화면 하나)
  index.tsx       홈: 다가오는 행사, 주민 추천 맛집
  restaurants.tsx 맛집 목록
  events.tsx      행사 목록 (날짜순)
  saved.tsx       저장
src/components/   카드, 탭, 공통 화면 틀
src/data/         예시 데이터
src/types.ts      맛집·행사 데이터 형태
```

## 실행해 보기

Node.js 20 이상이 필요합니다.

```bash
npm install
npx expo start
```

- 휴대폰: **Expo Go** 앱을 설치하고 터미널에 뜨는 QR 코드를 찍습니다 (안드로이드·iOS 모두).
- PC 브라우저: 터미널에서 `w`를 누릅니다.

## 확인 명령

```bash
npm run typecheck   # 타입 검사
npm run lint        # 린트
```
