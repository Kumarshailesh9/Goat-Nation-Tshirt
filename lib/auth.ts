import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "./firebase";

// ================= REGISTER =================
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  phone: string
) => {

  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email,
    phone,
    role: "user",
    createdAt: new Date(),
  });

  return user;
};

// ================= LOGIN =================
export const loginUser = async (
  email: string,
  password: string
) => {

  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  const user = userCredential.user;

  const userDoc = await getDoc(
    doc(db, "users", user.uid)
  );

  const role =
    userDoc.exists()
      ? userDoc.data().role
      : "user";

  return { user, role };
};

// ================= LOGOUT =================
export const logoutUser = async () => {
  await signOut(auth);
};

// ================= RECAPTCHA =================
export const setupRecaptcha = (
  phoneNumber: string
) => {

  if (!(window as any).recaptchaVerifier) {

    (window as any).recaptchaVerifier =
      new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "normal",
          callback: () => {},
        }
      );
  }

  const appVerifier =
    (window as any).recaptchaVerifier;

  return signInWithPhoneNumber(
    auth,
    phoneNumber,
    appVerifier
  );
};