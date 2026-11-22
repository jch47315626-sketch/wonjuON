import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';

export default function SavedScreen() {
  // TODO: 저장한 맛집·행사 목록, 큰 글씨 모드, 알림 설정
  return (
    <Screen title="저장" emoji="💛" subtitle="마음에 드는 맛집과 행사를 모아 보세요">
      <ThemedText themeColor="textSecondary">아직 저장한 곳이 없어요.</ThemedText>
    </Screen>
  );
}
