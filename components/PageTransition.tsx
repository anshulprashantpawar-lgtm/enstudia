"use client";
import { usePathname } from "next/navigation";

/**
 * Gives every page a subtle fade-up entrance on navigation.
 * Keyed by pathname so the animation re-runs whenever the route changes.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-page-in">
      {children}
    </div>
  );
}
