import type { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  title: string;
  subtitle?: string;
  /** 제목 앞에 붙는 이모지 (예: 🍜) */
  emoji?: string;
  /** 제목 대신 화면 맨 위를 꽉 채워 그리는 머리 그림 (홈). 위쪽 안전 영역 여백을 받음. */
  hero?: (topInset: number) => ReactNode;
  children: ReactNode;
};

/** 탭 화면 공통 틀: 안전 영역, 하단 탭 여백, 제목. */
export function Screen({ title, subtitle, emoji, hero, children }: Props) {
  const safe = useSafeAreaInsets();
  const theme = useTheme();
  // 웹 미리보기는 탭 바가 화면 아래에 떠 있어서 그만큼 비워 둠
  const bottom =
    Platform.OS === 'web' ? Spacing.six + Spacing.five : safe.bottom + BottomTabInset + Spacing.three;
  const top = Platform.OS === 'web' ? Spacing.five : safe.top + Spacing.three;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentInsetAdjustmentBehavior={hero ? 'never' : 'automatic'}
      contentContainerStyle={{ paddingBottom: bottom }}>
      {hero ? hero(top) : null}
      <View style={[styles.content, { paddingTop: hero ? 0 : top }]}>
        <View style={styles.inner}>
          {hero ? null : (
            <>
              <ThemedText type="subtitle">{emoji ? `${emoji} ${title}` : title}</ThemedText>
              {subtitle ? <ThemedText themeColor="textSecondary">{subtitle}</ThemedText> : null}
            </>
          )}
          <View style={[styles.body, hero && styles.bodyUnderHero]}>{children}</View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  inner: {
    flex: 1,
    minWidth: 0,
    maxWidth: MaxContentWidth,
    gap: Spacing.one,
  },
  body: {
    marginTop: Spacing.three,
    gap: Spacing.three,
  },
  bodyUnderHero: {
    marginTop: 0,
  },
});
