import * as WebBrowser from 'expo-web-browser';
import { Pressable, StyleSheet, View } from 'react-native';

import { Badge } from '@/components/badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { Notice } from '@/types';
import { formatDay } from '@/utils/date';

/** 시청 소식 한 건. 누르면 원주시청 원문을 엽니다. */
export function NoticeCard({ item }: { item: Notice }) {
  return (
    <Pressable
      onPress={() => WebBrowser.openBrowserAsync(item.url)}
      accessibilityRole="link"
      accessibilityHint="원주시청 홈페이지의 원문을 엽니다">
      {({ pressed }) => (
        <ThemedView type="backgroundElement" style={[styles.card, pressed && styles.pressed]}>
          <View style={styles.row}>
            <Badge label={item.topic} />
            <ThemedText type="small" themeColor="textSecondary">
              {formatDay(item.date)} · {item.dept ?? item.board}
            </ThemedText>
          </View>
          <ThemedText type="smallBold" style={styles.title}>
            {item.title}
          </ThemedText>
          {item.summary ? (
            <ThemedText type="small" themeColor="textSecondary" numberOfLines={3}>
              {item.summary}
            </ThemedText>
          ) : null}
          <ThemedText type="small" themeColor="textSecondary">
            출처: {item.source} {item.board} · 원문 보기 ›
          </ThemedText>
        </ThemedView>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  pressed: {
    opacity: 0.7,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
  },
});
