import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { formatPeriod } from '@/utils/date';
import type { EventItem } from '@/types';

export function EventCard({ item }: { item: EventItem }) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {item.category} · {formatPeriod(item.startDate, item.endDate)}
      </ThemedText>
      <ThemedText style={styles.title}>{item.title}</ThemedText>
      <ThemedText>{item.place}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {item.fee} · {item.host}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        출처: {item.source}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: 700,
  },
});
