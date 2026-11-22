import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { Spacing, type PastelTone } from '@/constants/theme';
import { usePastels } from '@/hooks/use-theme';
import type { Restaurant } from '@/types';

const LOOK: Record<Restaurant['category'], { emoji: string; tone: PastelTone }> = {
  한식: { emoji: '🍲', tone: 'peach' },
  '카페·찻집': { emoji: '☕', tone: 'butter' },
  외국식: { emoji: '🍝', tone: 'lilac' },
  간이음식: { emoji: '🥟', tone: 'mint' },
  주점: { emoji: '🍶', tone: 'lilac' },
  기타: { emoji: '🍽️', tone: 'mint' },
};

/** 홈에 두 개씩 나란히 놓는 작은 맛집 카드. 사진이 없으면 파스텔 바탕에 음식 그림. */
export function MiniRestaurantCard({ item }: { item: Restaurant }) {
  const look = LOOK[item.category] ?? LOOK.기타;
  const bg = usePastels()[look.tone].bg;
  return (
    <Card style={styles.card}>
      <View style={[styles.photo, { backgroundColor: bg }]}>
        {item.imageUrl ? (
          <Image
            source={item.imageUrl}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            accessibilityLabel={`${item.name} 사진`}
          />
        ) : (
          <ThemedText style={styles.emoji}>{look.emoji}</ThemedText>
        )}
      </View>
      <View style={styles.body}>
        <ThemedText type="smallBold" numberOfLines={1}>
          {item.name}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
          {item.dong === '원주시' ? item.category : `${item.category} · ${item.dong}`}
        </ThemedText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  photo: {
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 36,
    lineHeight: 44,
  },
  body: {
    paddingHorizontal: Spacing.two + Spacing.half,
    paddingVertical: Spacing.two,
  },
});
