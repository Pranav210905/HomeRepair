import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD9J-BFJFLDIuuT4HzQl5FUH6BRu2ic_RA",
  authDomain: "homefixpro-cebe3.firebaseapp.com",
  projectId: "homefixpro-cebe3",
  storageBucket: "homefixpro-cebe3.firebasestorage.app",
  messagingSenderId: "333812773868",
  appId: "1:333812773868:web:56208bd12c01df3db346c9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
