import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import type { Issue } from "@/data/issues";
import { useTheme } from "@/hooks/use-theme";

const CARD_WIDTH = 260;
const GAP = Spacing.two + Spacing.half;

/** 옆으로 넘기는 '지금 원주 이슈' 카드들. 누르면 원문(언론사·원주시청)을 엽니다. */
export function IssueCarousel({ issues }: { issues: Issue[] }) {
  const theme = useTheme();
  const [page, setPage] = useState(0);

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + GAP}
        decelerationRate="fast"
        contentContainerStyle={styles.row}
        scrollEventThrottle={32}
        onScroll={(e) =>
          setPage(
            Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + GAP)),
          )
        }
      >
        {issues.map((i) => (
          <Pressable
            key={i.id}
            onPress={() => WebBrowser.openBrowserAsync(i.url)}
            accessibilityRole="link"
            accessibilityHint="원문을 엽니다"
          >
            {({ pressed }) => (
              <Card style={[styles.card, pressed && styles.pressed]}>
                <Badge label={i.tag} tone={i.tone} />
                <ThemedText
                  type="smallBold"
                  style={styles.title}
                  numberOfLines={3}
                >
                  {i.title}
                </ThemedText>
                <ThemedText
                  type="small"
                  themeColor="textSecondary"
                  numberOfLines={1}
                >
                  {i.meta}
                </ThemedText>
              </Card>
            )}
          </Pressable>
        ))}
      </ScrollView>
      {issues.length > 1 ? (
        <View style={styles.dots} aria-hidden>
          {issues.map((i, n) => (
            <View
              key={i.id}
              style={[
                styles.dot,
                { backgroundColor: n === page ? theme.accent : theme.border },
                n === page && styles.dotOn,
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: GAP,
  },
  card: {
    width: CARD_WIDTH,
    minHeight: 128,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    flexGrow: 1,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    marginTop: Spacing.two,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotOn: {
    width: 16,
  },
});
