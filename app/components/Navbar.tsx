"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { auth } from "@/lib/firebase";

import { useRouter } from "next/navigation";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  Heart,
  User,
} from "lucide-react";

const Navbar = () => {

  const [scrolled, setScrolled] =
    useState(false);

  const [user, setUser] =
    useState<any>(null);

  const [dropdown, setDropdown] =
    useState(false);

  const router = useRouter();

  const dropdownRef =
    useRef<HTMLDivElement | null>(
      null
    );

  // ================= SCROLL + AUTH =================
  useEffect(() => {

    const handleScroll = () => {
      setScrolled(
        window.scrollY > 10
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (u) => {
          setUser(u);
        }
      );

    return () => {

      window.removeEventListener(
        "scroll",
        handleScroll
      );

      unsubscribe();
    };

  }, []);

  // ================= OUTSIDE CLICK =================
  useEffect(() => {

    const handleClickOutside = (
      e: MouseEvent
    ) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          e.target as Node
        )
      ) {
        setDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);

  // ================= LOGOUT =================
  const handleLogout =
    async () => {

      await signOut(auth);

      setDropdown(false);

      router.replace("/");
    };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm"
          : "bg-white"
      }`}
    >

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* ================= LOGO ================= */}
        <Link
          href="/"
          className="flex items-center gap-2"
        >

          <img
            src="/logo.jpeg"
            alt="logo"
            className="h-10 w-10 rounded-full object-cover"
          />

          <span className="text-lg md:text-xl font-bold tracking-wide text-[#A48D47]">
            GOAT NATION
          </span>

        </Link>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-3">

          {/* ================= IF USER LOGIN ================= */}
          {user ? (
            <>

              {/* WISHLIST */}
              <Link
                href="/wishlist"
                className="relative w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 transition"
              >

                <Heart size={19} />

              </Link>

              {/* USER */}
              <div
                className="relative"
                ref={dropdownRef}
              >

                {/* USER BUTTON */}
                <button
                  onClick={() =>
                    setDropdown(
                      !dropdown
                    )
                  }
                  className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-medium"
                >

                  {user.email
                    ?.charAt(0)
                    .toUpperCase() || (
                    <User size={18} />
                  )}

                </button>

                {/* DROPDOWN */}
                {dropdown && (

                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                    {/* USER INFO */}
                    <div className="px-4 py-3 border-b bg-gray-50">

                      <p className="font-semibold text-sm truncate">
                        {user.email}
                      </p>

                    </div>

                    {/* ORDERS */}
                    <Link
                      href="/orders"
                      onClick={() =>
                        setDropdown(
                          false
                        )
                      }
                      className="block px-4 py-3 text-sm hover:bg-gray-100 transition"
                    >
                      My Orders
                    </Link>

                    {/* LOGOUT */}
                    <button
                      onClick={
                        handleLogout
                      }
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      Logout
                    </button>

                  </div>
                )}

              </div>

            </>
          ) : (

            /* LOGIN BUTTON */
            <Link
              href="/login"
              className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-900 transition"
            >
              Login
            </Link>

          )}

        </div>

      </div>

    </header>
  );
};

export default Navbar;