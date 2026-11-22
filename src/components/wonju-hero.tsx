import { StyleSheet, View } from "react-native";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";

import { Kkwong } from "@/components/kkwong";
import { ThemedText } from "@/components/themed-text";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@/hooks/use-theme";

const SCENE_HEIGHT = 160;

/** 홈 맨 위 그림: 소금산 출렁다리와 꿩이, 앱 이름과 인사말. */
export function WonjuHero({ topInset }: { topInset: number }) {
  const theme = useTheme();
  const dark = useColorScheme() === "dark";
  const sky = dark ? "#3A241C" : "#FFE3CF";
  const hill = dark ? "#5A3528" : "#F7C3A6";
  const bridge = dark ? "#FF8C6B" : "#D2542F";

  // 다리 줄: 양쪽 언덕 사이에 늘어진 곡선, 세로 줄 11개
  const hangers = Array.from({ length: 11 }, (_, i) => {
    const x = 128 + i * 13;
    const y = 112 + 19 * (1 - ((x - 195) / 75) ** 2);
    return (
      <Line
        key={i}
        x1={x}
        y1={y - 8}
        x2={x}
        y2={y}
        stroke={bridge}
        strokeWidth={1.5}
      />
    );
  });

  return (
    <View style={{ height: SCENE_HEIGHT + topInset }}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none" aria-hidden>
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 390 190"
          preserveAspectRatio="none"
        >
          <Rect width={390} height={190} fill={sky} />
          <Circle cx={60} cy={40} r={16} fill={dark ? "#6B4A2E" : "#FFF6D6"} />
          <Path d="M0 120 Q60 70 120 112 L120 190 H0Z" fill={hill} />
          <Path d="M270 112 Q330 60 390 100 V190 H270Z" fill={hill} />
          <Path
            d="M120 112 Q195 150 270 112"
            stroke={bridge}
            strokeWidth={3.5}
            fill="none"
          />
          <Path
            d="M120 104 Q195 140 270 104"
            stroke={bridge}
            strokeWidth={2}
            fill="none"
            opacity={0.6}
          />
          {hangers}
          <Path d="M0 175 Q195 150 390 175 V190 H0Z" fill={theme.background} />
        </Svg>
      </View>
      <View style={[styles.row, { paddingTop: topInset }]}>
        <View style={styles.inner}>
          <View style={styles.text}>
            <ThemedText type="subtitle">원주ON</ThemedText>
            <ThemedText themeColor="textSecondary">
              오늘 원주에서 뭐 먹고, 어디 갈까?
            </ThemedText>
          </View>
          <Kkwong size={78} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: Spacing.three,
  },
  inner: {
    flex: 1,
    maxWidth: MaxContentWidth,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  text: {
    flexShrink: 1,
    paddingTop: Spacing.two,
  },
});
