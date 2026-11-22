import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

/**
 * Firebase 웹 앱 설정 (Firebase 콘솔 > 프로젝트 설정 > 내 앱).
 * 이 값들은 앱 안에 그대로 들어가는 공개용 값이라 저장소에 올려도 됩니다.
 * 데이터 보호는 firestore.rules 로 합니다.
 * projectId 가 비어 있으면 Firebase 를 쓰지 않고 앱에 들어 있는 데이터만 보여줍니다.
 */
const firebaseConfig: FirebaseOptions = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

let db: Firestore | null = null;

/** 설정이 있으면 Firestore, 없으면 null */
export function getDb(): Firestore | null {
  if (!firebaseConfig.projectId) return null;
  if (!db) {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
  return db;
}
