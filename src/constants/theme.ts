/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

/**
 * 원주ON 색 (B안 · 출렁다리 피치): 크림 바탕, 복숭아색 강조, 따뜻한 갈색 글자.
 * backgroundElement 는 카드(흰색), backgroundSelected 는 고른 것·연한 강조 바탕.
 */
export const Colors = {
  light: {
    text: '#4A2C22',
    background: '#FFF8F1',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#FFE1D6',
    textSecondary: '#937063',
    /** 복숭아색 강조 (고른 버튼, 점) */
    accent: '#FF8C6B',
    /** 강조색 위나 옆에 쓰는 진한 글자색 */
    accentText: '#D2542F',
    /** 카드 테두리 */
    border: '#F6E1D3',
    /** 하단 탭 바 */
    tabBar: '#4A2C22',
    tabInactive: '#D9BDB0',
  },
  dark: {
    text: '#FFEDE3',
    background: '#1E1512',
    backgroundElement: '#2A1E1A',
    backgroundSelected: '#4A2C22',
    textSecondary: '#C9A99B',
    accent: '#FF8C6B',
    accentText: '#FFB199',
    border: '#3B2B25',
    tabBar: '#2A1E1A',
    tabInactive: '#9C7E72',
  },
} as const;

/** 꼬리표·아이콘 바탕에 쓰는 파스텔 색 묶음 (bg 바탕, fg 글자) */
export const Pastels = {
  light: {
    peach: { bg: '#FFE1D6', fg: '#D2542F' },
    butter: { bg: '#FFF1C2', fg: '#A57900' },
    mint: { bg: '#DDF2EC', fg: '#2E8B73' },
    lilac: { bg: '#EDE3FF', fg: '#6B4FC4' },
  },
  dark: {
    peach: { bg: '#5A3326', fg: '#FFB199' },
    butter: { bg: '#4F4020', fg: '#F2D27A' },
    mint: { bg: '#1F433A', fg: '#8FDCC4' },
    lilac: { bg: '#3A3156', fg: '#C8B8FF' },
  },
} as const;

export type PastelTone = keyof typeof Pastels.light;

/** 둥근 정도 */
export const Radius = {
  card: 24,
  chip: 999,
  icon: 16,
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
