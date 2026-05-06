// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//     apiKey: "AIzaSyAZNgHSpK5DsuNivGbEB-OzQH1wOxjTV2Q",
//     authDomain: "goat-nation.firebaseapp.com",
//     projectId: "goat-nation",
//     storageBucket: "goat-nation.firebasestorage.app",
//     messagingSenderId: "477821396327",
//     appId: "1:477821396327:web:de2e25db796bd07c6abbc2"
//   };

// const app = initializeApp(firebaseConfig);

// export const db = getFirestore(app);
// export const storage = getStorage(app);
// export const auth = getAuth(app);



import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// ✅ Use env variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// ✅ Prevent multiple app initialization (VERY IMPORTANT)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Services
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// ✅ Export
export { app, db, storage, auth };