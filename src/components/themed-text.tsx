import { Platform, StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import { AppFont } from '@/constants/fonts';
import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  const merged = StyleSheet.flatten([{ color: theme[themeColor ?? 'text'] }, styles[type], style]);

  return <Text style={withAppFont(merged ?? {}, type)} {...rest} />;
}

/**
 * 원주체는 Regular·Bold 두 파일뿐이라, 굵기(fontWeight) 대신 글꼴 파일을 골라 씀.
 * 600 이상이면 Bold, 아니면 Regular. 코드용 고정폭 글꼴(type="code")은 그대로 둠.
 */
function withAppFont(style: TextStyle, type: NonNullable<ThemedTextProps['type']>): TextStyle {
  if (type === 'code') return style;
  const { fontWeight, ...rest } = style;
  const bold = Number(fontWeight ?? 400) >= 600 || fontWeight === 'bold';
  return { ...rest, fontFamily: bold ? AppFont.bold : AppFont.regular };
}

const styles = StyleSheet.create({
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 500,
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 500,
  },
  title: {
    fontSize: 48,
    fontWeight: 600,
    lineHeight: 52,
  },
  subtitle: {
    fontSize: 32,
    lineHeight: 44,
    fontWeight: 600,
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: 14,
    color: '#3c87f7',
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
});
