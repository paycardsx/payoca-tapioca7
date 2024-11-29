import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBg2eMmlDSt3yJ2UIufbzS-JAr1RTFWzlI",
  authDomain: "payoca-tapiocas.firebaseapp.com",
  projectId: "payoca-tapiocas",
  storageBucket: "payoca-tapiocas.firebasestorage.app",
  messagingSenderId: "222109159058",
  appId: "1:222109159058:web:46a771cdea7a1a0e46604b",
  measurementId: "G-BBQWQ12ZGN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export default app;
