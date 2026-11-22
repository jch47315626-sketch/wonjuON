import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type Props<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
};

/** 가로로 넘기는 필터 버튼 줄 */
export function ChipRow<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {options.map((o) => {
        const selected = o === value;
        return (
          <Pressable
            key={o}
            onPress={() => onChange(o)}
            accessibilityRole="button"
            accessibilityState={{ selected }}>
            <ThemedView
              type={selected ? 'backgroundSelected' : 'backgroundElement'}
              style={styles.chip}>
              <ThemedText type={selected ? 'smallBold' : 'small'}>{o}</ThemedText>
            </ThemedView>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.four,
  },
});
