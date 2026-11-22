import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export function Badge({ label }: { label: string }) {
  return (
    <ThemedView type="backgroundSelected" style={styles.badge}>
      <ThemedText type="smallBold">{label}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.two,
  },
});
