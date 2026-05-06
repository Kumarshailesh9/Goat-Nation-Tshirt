"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      // ❌ not logged in
      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        // 🔥 get role from Firestore
        const snap = await getDoc(doc(db, "users", user.uid));

        const role = snap.data()?.role;

        // ❌ not admin
        if (role !== "admin") {
          router.replace("/");
          return;
        }

        // ✅ admin
        setLoading(false);

      } catch (err) {
        console.error(err);
        router.replace("/");
      }
    });

    return () => unsubscribe();
  }, []);

  return { loading };
};