"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-white mt-12">

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* TOP */}
        <div className="flex flex-col items-center gap-4">

          {/* Logo */}
          <h2 className="text-lg font-bold tracking-wide">
            Goat Nation
          </h2>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-600">

            <Link
              href="/"
              className="hover:text-black transition"
            >
              Home
            </Link>

            <Link
              href="/about"
              className="hover:text-black transition"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="hover:text-black transition"
            >
              Contact
            </Link>

            <Link
              href="/return-refund-policy"
              className="hover:text-black transition"
            >
              Terms
            </Link>

            <Link
              href="/return-refund-policy"
              className="hover:text-black transition"
            >
              Refund Policy
            </Link>

            <Link
              href="/return-refund-policy"
              className="hover:text-black transition"
            >
              Privacy
            </Link>

          </div>

        </div>

        {/* Bottom */}
        <div className="border-t mt-5 pt-4 text-center">

          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Goat Nation. All rights reserved.
          </p>

        </div>

      </div>

    </footer>
  );
}