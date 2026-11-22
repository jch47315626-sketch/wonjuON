import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Badge } from '@/components/badge';
import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { EventItem } from '@/types';
import { formatPeriod } from '@/utils/date';

type Props = {
  item: EventItem;
  /** 지난 행사는 흐리게 */
  dimmed?: boolean;
};

export function EventCard({ item, dimmed }: Props) {
  return (
    <Card style={dimmed && styles.dimmed}>
      {item.imageUrl ? (
        <Image
          source={item.imageUrl}
          style={styles.image}
          contentFit="cover"
          accessibilityLabel={`${item.title} 사진`}
        />
      ) : null}
      <View style={styles.body}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          {item.category} · {formatPeriod(item.startDate, item.endDate)}
        </ThemedText>
        <ThemedText style={styles.title}>{item.title}</ThemedText>
        <ThemedText>{item.place}</ThemedText>
        {item.playtime ? (
          <ThemedText type="small" themeColor="textSecondary">
            {item.playtime}
          </ThemedText>
        ) : null}
        <View style={styles.row}>
          {item.fee ? <Badge label={item.fee} tone="mint" /> : null}
          {item.host ? (
            <ThemedText type="small" themeColor="textSecondary" style={styles.host}>
              {item.host}
            </ThemedText>
          ) : null}
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          출처: {item.source}
          {item.imageUrl ? ' (사진 포함)' : ''}
        </ThemedText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  dimmed: {
    opacity: 0.6,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  body: {
    padding: Spacing.three,
    gap: Spacing.one,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: 700,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  host: {
    flexShrink: 1,
  },
});
