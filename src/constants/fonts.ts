/**
 * 앱 글꼴: 원주체 (assets/fonts, SIL Open Font License 1.1).
 * 이름은 src/app/_layout.tsx 의 useFonts 에 등록한 이름과 같아야 합니다.
 */
export const AppFont = {
  regular: 'Wonju-Regular',
  bold: 'Wonju-Bold',
} as const;

export const appFontFiles = {
  [AppFont.regular]: require('@/assets/fonts/Wonju-Regular.ttf'),
  [AppFont.bold]: require('@/assets/fonts/Wonju-Bold.ttf'),
};
