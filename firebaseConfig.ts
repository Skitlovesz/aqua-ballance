import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import * as firebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCo8SSSUa8bey0J8Nm3Tun-RQqIzTjHZSk',
  authDomain: 'aquaballance-1b2ae.firebaseapp.com',
  projectId: 'aquaballance-1b2ae',
  storageBucket: 'aquaballance-1b2ae.appspot.com',
  messagingSenderId: '1064402930503',
  appId: '1:1064402930503:web:829a0f49566dc3ec711a62',
  measurementId: 'G-46WWR71QHN',
};

const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: reactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db };