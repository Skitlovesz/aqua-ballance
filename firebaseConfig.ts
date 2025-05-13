// import { initializeApp, getApps } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyCo8SSSUa8bey0J8Nm3Tun-RQqIzTjHZSk",
//   authDomain: "aquaballance-1b2ae.firebaseapp.com",
//   projectId: "aquaballance-1b2ae",
//   storageBucket: "aquaballance-1b2ae.appspot.com", // Corrigido o storageBucket
//   messagingSenderId: "1064402930503",
//   appId: "1:1064402930503:web:829a0f49566dc3ec711a62",
//   measurementId: "G-46WWR71QHN",
// };

// // Verifica se o Firebase já foi inicializado para evitar múltiplas inicializações
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// // Inicializa os serviços
// export const auth = getAuth(app);
// export const db = getFirestore(app);
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import * as firebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração do Firebase
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

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth (abordagem padrão sem persistência personalizada)
const auth = initializeAuth(app, {
  persistence: reactNativePersistence(AsyncStorage),
});

// Inicializar Firestore
const db = getFirestore(app);

export { auth, db };