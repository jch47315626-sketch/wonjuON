/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors, Pastels } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? 'dark' : 'light';

  return Colors[theme];
}

/** 지금 밝기 모드에 맞는 파스텔 색 묶음 */
export function usePastels() {
  const scheme = useColorScheme();
  return Pastels[scheme === 'dark' ? 'dark' : 'light'];
}
