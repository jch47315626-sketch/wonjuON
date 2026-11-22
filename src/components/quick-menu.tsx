import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing, type PastelTone } from '@/constants/theme';
import { usePastels } from '@/hooks/use-theme';

const ITEMS: { emoji: string; label: string; href: Href; tone: PastelTone }[] = [
  { emoji: '🍜', label: '맛집', href: '/restaurants', tone: 'peach' },
  { emoji: '☕', label: '카페', href: { pathname: '/restaurants', params: { filter: '카페·찻집' } }, tone: 'butter' },
  { emoji: '🎪', label: '행사', href: '/events', tone: 'mint' },
  { emoji: '💛', label: '저장', href: '/saved', tone: 'lilac' },
];

/** 홈의 동글동글한 바로가기 4개 */
export function QuickMenu() {
  const pastels = usePastels();
  return (
    <View style={styles.row}>
      {ITEMS.map((it) => (
        <Link key={it.label} href={it.href} asChild>
          <Pressable style={styles.cell} accessibilityRole="button">
            {({ pressed }) => (
              <Card style={[styles.card, pressed && styles.pressed]}>
                <View style={[styles.icon, { backgroundColor: pastels[it.tone].bg }]}>
                  <ThemedText style={styles.emoji}>{it.emoji}</ThemedText>
                </View>
                <ThemedText type="small">{it.label}</ThemedText>
              </Card>
            )}
          </Pressable>
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  cell: {
    flex: 1,
  },
  card: {
    alignItems: 'center',
    paddingVertical: Spacing.two + Spacing.half,
    gap: Spacing.one,
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: Radius.icon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
    lineHeight: 28,
  },
});
