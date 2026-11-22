import type { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

/** 탭 화면 공통 틀: 안전 영역, 하단 탭 여백, 제목. */
export function Screen({ title, subtitle, children }: Props) {
  const safe = useSafeAreaInsets();
  const theme = useTheme();
  const bottom = safe.bottom + BottomTabInset + Spacing.three;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Platform.OS === 'web' ? Spacing.six + Spacing.four : safe.top + Spacing.three,
          paddingBottom: bottom,
        },
      ]}>
      <ThemedView style={styles.inner}>
        <ThemedText type="subtitle">{title}</ThemedText>
        {subtitle ? <ThemedText themeColor="textSecondary">{subtitle}</ThemedText> : null}
        <ThemedView style={styles.body}>{children}</ThemedView>
      </ThemedView>
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
    flexGrow: 1,
    maxWidth: MaxContentWidth,
    gap: Spacing.one,
  },
  body: {
    marginTop: Spacing.three,
    gap: Spacing.three,
  },
});
