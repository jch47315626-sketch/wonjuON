import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, View, StyleSheet, type PressableProps } from 'react-native';

import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { ThemedText } from './themed-text';

/** 웹 미리보기용 하단 탭: 갈색 동그란 바에 이모지 아이콘, 고른 탭은 복숭아색. */
export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton emoji="🏠">홈</TabButton>
          </TabTrigger>
          <TabTrigger name="restaurants" href="/restaurants" asChild>
            <TabButton emoji="🍜">맛집</TabButton>
          </TabTrigger>
          <TabTrigger name="events" href="/events" asChild>
            <TabButton emoji="🎪">행사</TabButton>
          </TabTrigger>
          <TabTrigger name="saved" href="/saved" asChild>
            <TabButton emoji="💛">저장</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({
  children,
  isFocused,
  emoji,
  ...props
}: TabTriggerSlotProps & { emoji: string }) {
  const theme = useTheme();
  return (
    <Pressable
      {...(props as PressableProps)}
      style={({ pressed }) => [styles.tab, pressed && styles.pressed]}>
      <View style={[styles.icon, isFocused && { backgroundColor: theme.accent }]}>
        <ThemedText style={styles.emoji}>{emoji}</ThemedText>
      </View>
      <ThemedText
        type={isFocused ? 'smallBold' : 'small'}
        style={[styles.label, { color: isFocused ? '#FFFFFF' : theme.tabInactive }]}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const theme = useTheme();
  return (
    <View {...props} style={styles.tabListContainer}>
      <View style={[styles.innerContainer, { backgroundColor: theme.tabBar }]}>
        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.card + 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexGrow: 1,
    maxWidth: MaxContentWidth,
    boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
  },
  tab: {
    alignItems: 'center',
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.half,
    borderRadius: Radius.icon,
  },
  emoji: {
    fontSize: 20,
    lineHeight: 26,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
  },
});
