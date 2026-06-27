import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-xs">B</span>
              </div>
              <span className="font-semibold text-ink text-sm tracking-tight">BuildTogether</span>
            </div>
            <p className="text-sm text-ink-2 leading-relaxed">
              The platform where ambitious students build real things together.
            </p>
          </div>
          <div>
            <h4 className="text-2xs font-semibold text-ink-3 uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2">
              {[{ label: "Explore Projects", href: "/explore" }, { label: "Dashboard", href: "/dashboard" }].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-ink-2 hover:text-ink transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-2xs font-semibold text-ink-3 uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2">
              {["How It Works", "Success Stories", "Blog"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-ink-3">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-2xs font-semibold text-ink-3 uppercase tracking-wider mb-3">Company</h4>
            <ul className="space-y-2">
              {["About", "Privacy", "Terms"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-ink-3">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-ink-3">2025 BuildTogether. Built by students, for students.</p>
          <p className="text-xs text-ink-3">500+ students · 120+ projects · 40+ schools</p>
        </div>
      </div>
    </footer>
  );
}
