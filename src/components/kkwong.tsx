import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

/**
 * 원주ON 캐릭터 '꿩이'. 꿩은 원주시를 상징하는 새(시조)예요.
 * 동글동글한 몸, 초록 머리, 빨간 눈 주변, 하얀 목띠.
 */
export function Kkwong({ size = 80 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" accessibilityLabel="원주 꿩 캐릭터">
      <Path d="M18 66 Q2 60 4 44 Q14 58 26 58Z" fill="#C98A4B" />
      <Path d="M14 70 Q-2 70 0 56 Q12 66 24 63Z" fill="#A9703A" />
      <Ellipse cx={50} cy={64} rx={30} ry={25} fill="#D9A066" />
      <Ellipse cx={46} cy={70} rx={16} ry={12} fill="#F2CFA1" />
      <Path
        d="M40 58 q6 4 12 0 M38 66 q6 4 12 0"
        stroke="#B57A3F"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
      <Rect x={56} y={38} width={20} height={8} rx={4} fill="#FFFFFF" />
      <Circle cx={68} cy={30} r={17} fill="#3E8E6A" />
      <Ellipse cx={72} cy={30} rx={8} ry={9} fill="#E5484D" />
      <Circle cx={73} cy={29} r={3.3} fill="#1D1D1D" />
      <Circle cx={74.2} cy={27.8} r={1.1} fill="#FFFFFF" />
      <Path d="M84 31 l8 3 l-8 3z" fill="#F2B33D" />
      <Ellipse cx={62} cy={38} rx={4} ry={2.4} fill="#FF9FB0" opacity={0.8} />
      <Path d="M60 14 q4 -8 10 -4" stroke="#3E8E6A" strokeWidth={4} fill="none" strokeLinecap="round" />
      <Path d="M44 88 v8 M56 88 v8" stroke="#C98A4B" strokeWidth={3} strokeLinecap="round" />
    </Svg>
  );
}
