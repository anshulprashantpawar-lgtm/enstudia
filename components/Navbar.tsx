"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const loading = status === "loading";

  const isActive = (href: string) => pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-canvas">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-xs">B</span>
          </div>
          <span className="font-semibold text-ink text-sm tracking-tight">BuildTogether</span>
        </Link>

        {/* Center nav (logged in) */}
        {session && (
          <nav className="hidden sm:flex items-center gap-0.5">
            {[
              { href: "/explore",   label: "Explore"   },
              { href: "/dashboard", label: "Dashboard" },
              { href: "/students",  label: "People"    },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3.5 py-1.5 rounded-lg text-sm transition-colors duration-100 ${
                  isActive(href)
                    ? "text-ink bg-surface"
                    : "text-ink-2 hover:text-ink hover:bg-surface"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="w-20 h-7 rounded-lg bg-surface animate-pulse" />
          ) : session ? (
            <>
              <NotificationBell />
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-surface transition-colors text-sm text-ink"
                >
                  <div className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center text-2xs font-semibold text-ink-2">
                    {(session.user?.name ?? session.user?.email ?? "?")[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-ink-2 text-sm">
                    {session.user?.name?.split(" ")[0] ?? "Account"}
                  </span>
                  <svg className="w-3.5 h-3.5 text-ink-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-1.5 w-44 bg-white border border-border rounded-xl shadow-subtle z-20 overflow-hidden">
                      <Link
                        href="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-ink hover:bg-surface transition-colors"
                      >
                        Dashboard
                      </Link>
                      <div className="border-t border-border" />
                      <button
                        onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-ink-2 hover:bg-surface transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-sm text-ink-2 hover:text-ink transition-colors"
              >
                Log in
              </Link>
              <Link href="/signup" className="btn-primary text-xs px-3.5 py-2">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
