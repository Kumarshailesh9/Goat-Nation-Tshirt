"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-16">

      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">

        {/* LEFT */}
        <h2 className="text-lg font-semibold">
          Goat Nation
        </h2>

        {/* CENTER LINKS */}
        <div className="flex gap-6 text-sm text-gray-600">
          <Link href="/">Home</Link>
          {/* <Link href="/track-order">Track Order</Link> */}
          <Link href="/">About</Link>
          <Link href="/">Contact</Link>
        </div>

        {/* RIGHT */}
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} All rights reserved
        </p>

      </div>

    </footer>
  );
}