import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
export { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "talkflowchat.firebaseapp.com",
  projectId: "talkflowchat",
  storageBucket: "talkflowchat.appspot.com",
  messagingSenderId: "1097966739642",
  appId: "1:1097966739642:web:10c09dbc09e6618c5a6283"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();