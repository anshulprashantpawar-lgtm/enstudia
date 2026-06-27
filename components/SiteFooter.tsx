"use client";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

/**
 * Renders the shared site footer on every page except the landing page ("/"),
 * which provides its own minimal footer.
 */
export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <Footer />;
}
