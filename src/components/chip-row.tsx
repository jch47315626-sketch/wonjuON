import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
};

/** 가로로 넘기는 필터 버튼 줄. 고른 버튼은 복숭아색으로 채움. */
export function ChipRow<T extends string>({ options, value, onChange }: Props<T>) {
  const theme = useTheme();
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
            <View
              style={[
                styles.chip,
                selected
                  ? { backgroundColor: theme.accent, borderColor: theme.accent }
                  : { backgroundColor: theme.backgroundElement, borderColor: theme.border },
              ]}>
              <ThemedText
                type={selected ? 'smallBold' : 'small'}
                style={selected ? styles.selectedText : undefined}>
                {o}
              </ThemedText>
            </View>
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
    borderRadius: Radius.chip,
    borderWidth: 2,
  },
  selectedText: {
    color: '#FFFFFF',
  },
});
