// import { initializeApp } from "firebase/app"
// import { getFirestore } from "firebase/firestore"
// import AsyncStorage from "@react-native-async-storage/async-storage"
// import { initializeAuth, getReactNativePersistence } from "firebase/auth"

// // Configuração do Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyCo8SSSUa8bey0J8Nm3Tun-RQqIzTjHZSk",
//   authDomain: "aquaballance-1b2ae.firebaseapp.com",
//   projectId: "aquaballance-1b2ae",
//   storageBucket: "aquaballance-1b2ae.appspot.com",
//   messagingSenderId: "1064402930503",
//   appId: "1:1064402930503:web:829a0f49566dc3ec711a62",
//   measurementId: "G-46WWR71QHN",
// }

// // Inicializar o Firebase
// const app = initializeApp(firebaseConfig)

// // Inicializar Auth com persistência no AsyncStorage
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// })

// // Inicializar Firestore
// const db = getFirestore(app)

// export { auth, db }
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCo8SSSUa8bey0J8Nm3Tun-RQqIzTjHZSk",
  authDomain: "aquaballance-1b2ae.firebaseapp.com",
  projectId: "aquaballance-1b2ae",
  storageBucket: "aquaballance-1b2ae.appspot.com",
  messagingSenderId: "1064402930503",
  appId: "1:1064402930503:web:829a0f49566dc3ec711a62",
  measurementId: "G-46WWR71QHN",
}

// Inicializar o Firebase
const app = initializeApp(firebaseConfig)

// Inicializar Auth (abordagem padrão sem persistência personalizada)
const auth = getAuth(app)

// Inicializar Firestore
const db = getFirestore(app)

export { auth, db }
