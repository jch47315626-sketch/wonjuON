import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing, type PastelTone } from '@/constants/theme';
import { usePastels } from '@/hooks/use-theme';

/** 동글동글한 파스텔 꼬리표 */
export function Badge({ label, tone = 'peach' }: { label: string; tone?: PastelTone }) {
  const c = usePastels()[tone];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <ThemedText type="smallBold" style={[styles.label, { color: c.fg }]}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two + Spacing.half,
    paddingVertical: Spacing.half,
    borderRadius: Radius.chip,
  },
  label: {
    fontSize: 12,
    lineHeight: 18,
  },
});
