import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import Providers from "@/components/Providers";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "BuildTogether — Student Project Collaboration",
  description: "Connect with ambitious students and build real projects together.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-canvas text-ink">
        <Providers>
          <Navbar />
          <main className="flex-1 pt-16">
            <PageTransition>{children}</PageTransition>
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
