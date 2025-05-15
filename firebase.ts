import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDV8rJR3q28K7ZkHcbcfjXLZafFqc8vu-I",
  authDomain: "home-service-b16c5.firebaseapp.com",
  projectId: "home-service-b16c5",
  storageBucket: "home-service-b16c5.firebasestorage.app",
  messagingSenderId: "684934498368",
  appId: "1:684934498368:web:09a364961718d80282f7a5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
