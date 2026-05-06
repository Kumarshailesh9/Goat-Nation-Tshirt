"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dropdown, setDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    // 🔥 AUTH STATE
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setDropdown(false);
    router.replace("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md"
          : "bg-white"
      } border-b`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.jpeg" className="h-10" />
          <span className="text-xl font-extrabold text-[#A48D47]">
            GOAT NATION
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-700">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 relative">

          {/* 🔥 IF USER LOGGED IN */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdown(!dropdown)}
                className="bg-black text-white px-4 py-2 rounded-full text-sm"
              >
                {user.email?.split("@")[0][0].toUpperCase()}
              </button>

              {/* DROPDOWN */}
              {dropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md overflow-hidden text-sm">

                  <Link
                    href="/orders"
                    onClick={() => setDropdown(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>

                  {/* <Link
                    href="/track-order"
                    onClick={() => setDropdown(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Track Order
                  </Link> */}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>

                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:inline-block bg-black text-white px-4 py-2 rounded-full text-sm"
            >
              Login
            </Link>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-60 py-3 border-t" : "max-h-0"
        } bg-white px-4`}
      >
        <div className="flex flex-col gap-3 text-sm font-medium text-gray-700">

          {/* <Link onClick={() => setOpen(false)} href="/">Home</Link>
          <Link onClick={() => setOpen(false)} href="/products">Shop</Link>
          <Link onClick={() => setOpen(false)} href="/new">New Arrivals</Link>
          <Link onClick={() => setOpen(false)} href="/about">About</Link> */}

          {/* 🔥 MOBILE USER */}
          {user ? (
            <>
              <Link href="/orders" onClick={() => setOpen(false)}>
                My Orders
              </Link>
              <button
                onClick={handleLogout}
                className="text-left text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="mt-2 bg-black text-white text-center py-2 rounded-full"
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