import { StyleSheet, View } from 'react-native';

import { Badge } from '@/components/badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { Restaurant } from '@/types';

export function RestaurantCard({ item }: { item: Restaurant }) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {item.category} · {item.dong}
      </ThemedText>
      <ThemedText style={styles.name}>{item.name}</ThemedText>
      <ThemedText>{item.mainMenu}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {item.hours}
      </ThemedText>
      {item.localTip ? <ThemedText type="small">“{item.localTip}”</ThemedText> : null}
      {item.badges.length > 0 ? (
        <View style={styles.badges}>
          {item.badges.map((b) => (
            <Badge key={b} label={b} />
          ))}
        </View>
      ) : null}
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
