import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

type UserRole = "admin" | "customer";

interface LoginResponse {
  user: User;
  role: UserRole;
  token: string; // 🔥 JWT TOKEN
}

// 🔥 GET TOKEN HELPER
export const getAuthToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  return await user.getIdToken(); // JWT
};

// ✅ REGISTER
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email,
    role: "customer",
  });

  return user;
};

// ✅ LOGIN (TOKEN INCLUDED)
export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  // 🔥 GET ROLE
  const userDoc = await getDoc(doc(db, "users", user.uid));

  const role = (userDoc.data()?.role as UserRole) || "customer";

  // 🔥 GET JWT TOKEN
  const token = await user.getIdToken();

  // ⚠️ OPTIONAL (store non-sensitive)
  localStorage.setItem(
    "user",
    JSON.stringify({
      uid: user.uid,
      email: user.email,
      role,
    })
  );

  return {
    user,
    role,
    token,
  };
};

// ✅ LOGOUT
export const logoutUser = async (): Promise<void> => {
  localStorage.removeItem("user"); // cleanup
  await signOut(auth);
};