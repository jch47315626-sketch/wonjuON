import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Badge } from '@/components/badge';
import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Restaurant } from '@/types';

export function RestaurantCard({ item }: { item: Restaurant }) {
  const where = item.dong === '원주시' ? item.category : `${item.category} · ${item.dong}`;
  const hours = [item.hours, item.closedDays && `휴무: ${item.closedDays}`].filter(Boolean).join('\n');

  return (
    <Card>
      {item.imageUrl ? (
        <Image
          source={item.imageUrl}
          style={styles.image}
          contentFit="cover"
          accessibilityLabel={`${item.name} 사진`}
        />
      ) : null}
      <View style={styles.body}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          {where}
        </ThemedText>
        <ThemedText style={styles.name}>{item.name}</ThemedText>
        {item.mainMenu ? <ThemedText>대표 메뉴: {item.mainMenu}</ThemedText> : null}
        {hours ? (
          <ThemedText type="small" themeColor="textSecondary">
            {hours}
          </ThemedText>
        ) : null}
        <ThemedText type="small" themeColor="textSecondary">
          {item.address}
          {item.phone ? `\n${item.phone}` : ''}
        </ThemedText>
        {item.localTip ? <ThemedText type="small">“{item.localTip}”</ThemedText> : null}
        {item.badges.length > 0 ? (
          <View style={styles.badges}>
            {item.badges.map((b) => (
              <Badge key={b} label={b} tone="butter" />
            ))}
          </View>
        ) : null}
        <ThemedText type="small" themeColor="textSecondary">
          출처: {item.source}
          {item.imageUrl ? ' (사진 포함)' : ''}
        </ThemedText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  body: {
    padding: Spacing.three,
    gap: Spacing.one,
  },
  name: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: 700,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
});
