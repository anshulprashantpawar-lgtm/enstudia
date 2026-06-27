import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { PROJECTS, MEMBERS, type Project } from "@/lib/data";
import Reveal from "@/components/Reveal";

/* Warm avatar palette — no gradients, harmonizes with #FF4D00 */
const WARM = ["#FF6B35", "#E8A04C", "#D9776B", "#C98A5E", "#E07A5F", "#B5836B", "#CC6B49", "#D98C5F"];

function initials(name: string): string {
  return name.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

/* ─── Floating hero card ──────────────────────────────────── */
function FloatingCard({
  project,
  label,
  color,
  transform,
  floatClass = "animate-float",
}: {
  project: Project;
  label: string;
  color: string;
  transform: string;
  floatClass?: string;
}) {
  return (
    <div className={`w-52 ${floatClass}`}>
      <div className="relative" style={{ transform }}>
        {/* Floating label pill */}
        <span
          className="absolute -top-3 left-5 z-10 px-2.5 py-1 rounded-full text-2xs font-medium text-white whitespace-nowrap"
          style={{ backgroundColor: "#1A1A1A" }}
        >
          {label}
        </span>

        <div
          className="bg-white border border-border rounded-2xl p-4"
          style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
              style={{ backgroundColor: color }}
            >
              {initials(project.name)}
            </div>
            <span className="text-sm font-semibold text-ink leading-tight">{project.name}</span>
          </div>
          <p className="text-xs text-ink-2 leading-relaxed line-clamp-2 mb-3">
            {project.shortDescription}
          </p>
          <span className="inline-block px-2 py-0.5 rounded-full text-2xs font-medium border border-border bg-canvas text-ink-2">
            {project.category}
          </span>
        </div>
      </div>
    </div>
  );
}

const VALUE_PROPS = [
  {
    title: "Find your team",
    body: "Post what you're building and meet students who bring the skills you're missing.",
  },
  {
    title: "Build in public",
    body: "Share progress, swap feedback, and grow a small crowd that's rooting for you.",
  },
  {
    title: "Ship something real",
    body: "Turn late-night ideas into projects you're proud to put your name on.",
  },
];

const FLOAT_VARIANTS = ["animate-float", "animate-float-slow", "animate-float-fast"];

export default async function HomePage() {
  // Landing page is for signed-out visitors only
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/dashboard");

  const byId = (id: string) => PROJECTS.find((p) => p.id === id)!;

  const leftCards = [
    { project: byId("p4"), label: "Looking for a designer", transform: "rotate(-3deg)" },
    { project: byId("p3"), label: "Open roles", transform: "rotate(-3deg) translateX(12px)" },
    { project: byId("p1"), label: "3 members", transform: "rotate(-3deg)" },
  ];
  const rightCards = [
    { project: byId("p5"), label: "Just launched", transform: "rotate(2deg)" },
    { project: byId("p2"), label: "Just posted", transform: "rotate(2deg) translateX(-12px)" },
    { project: byId("p6"), label: "Looking for a developer", transform: "rotate(2deg)" },
  ];

  return (
    <div>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-20"
        style={{ backgroundColor: "#FAF7F2" }}
      >
        {/* Left floating cards (desktop only) */}
        <div className="hidden lg:flex flex-col gap-7 absolute left-2 xl:left-10 top-1/2 -translate-y-1/2 animate-fade-in">
          {leftCards.map((c, i) => (
            <FloatingCard
              key={c.project.id}
              project={c.project}
              label={c.label}
              color={WARM[i % WARM.length]}
              transform={c.transform}
              floatClass={FLOAT_VARIANTS[i % FLOAT_VARIANTS.length]}
            />
          ))}
        </div>

        {/* Right floating cards (desktop only) */}
        <div
          className="hidden lg:flex flex-col gap-7 absolute right-2 xl:right-10 top-1/2 -translate-y-1/2 animate-fade-in"
          style={{ animationDelay: "120ms" }}
        >
          {rightCards.map((c, i) => (
            <FloatingCard
              key={c.project.id}
              project={c.project}
              label={c.label}
              color={WARM[(i + 3) % WARM.length]}
              transform={c.transform}
              floatClass={FLOAT_VARIANTS[(i + 1) % FLOAT_VARIANTS.length]}
            />
          ))}
        </div>

        {/* Center content */}
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink leading-[1.1] tracking-tight animate-fade-up"
          >
            Where ambitious students
            <br />
            find <span className="text-accent">their people</span>.
          </h1>
          <p
            className="mt-6 text-lg text-ink-2 leading-relaxed max-w-xl mx-auto animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            A community of high schoolers building real projects together — and finding the
            teammates who actually get it.
          </p>
          <div className="mt-9 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-accent hover:bg-accent-hover text-white text-base font-semibold px-8 py-4 transition-colors"
            >
              Get Early Access
            </Link>
          </div>

          {/* Mobile / tablet stacked preview */}
          <div className="lg:hidden mt-14 flex justify-center animate-fade-up" style={{ animationDelay: "300ms" }}>
            <FloatingCard
              project={byId("p4")}
              label="Looking for a designer"
              color={WARM[0]}
              transform="rotate(0deg)"
            />
          </div>
        </div>
      </section>

      {/* ─── Social proof strip ───────────────────────────── */}
      <section className="w-full" style={{ backgroundColor: "#F0EDE8" }}>
        <Reveal className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col items-center gap-5">
          <p className="text-sm text-ink-2 text-center">
            Join students from 12+ countries building real projects.
          </p>
          <div className="flex justify-center -space-x-3">
            {MEMBERS.map((m, i) => (
              <div
                key={m.id}
                className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                style={{
                  backgroundColor: WARM[i % WARM.length],
                  border: "2px solid #F0EDE8",
                }}
                title={m.name}
              >
                {m.avatar}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ─── Three value props ────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="grid sm:grid-cols-3 gap-12 sm:gap-10">
          {VALUE_PROPS.map((v, i) => (
            <Reveal key={v.title} delay={i * 120}>
              <h3 className="text-xl font-bold text-ink tracking-tight mb-3">{v.title}</h3>
              <p className="text-sm text-ink-2 leading-relaxed">{v.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Project previews ─────────────────────────────── */}
      <section className="py-16" style={{ backgroundColor: "#FAF7F2" }}>
        <Reveal className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              What students are building
            </h2>
            <Link
              href="/explore"
              className="text-sm text-ink-2 hover:text-accent transition-colors whitespace-nowrap"
            >
              See all projects
            </Link>
          </div>
        </Reveal>

        {/* Horizontal scroll row */}
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 pb-2">
            {PROJECTS.map((project, i) => (
              <Reveal key={project.id} delay={i * 80} className="shrink-0">
                <Link
                  href={`/project/${project.id}`}
                  className="group block w-[280px] bg-white border border-border rounded-2xl p-5 hover:border-ink-3 hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="flex items-center gap-2.5 mb-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
                      style={{ backgroundColor: WARM[i % WARM.length] }}
                    >
                      {initials(project.name)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-ink leading-tight group-hover:text-accent transition-colors truncate">
                        {project.name}
                      </h3>
                      <span className="text-2xs text-ink-3">{project.category}</span>
                    </div>
                  </div>
                  <p className="text-sm text-ink-2 leading-relaxed line-clamp-3 mb-4">
                    {project.shortDescription}
                  </p>
                  <div className="flex -space-x-2">
                    {project.members.map((m) => (
                      <div
                        key={m.id}
                        className="w-6 h-6 rounded-full bg-canvas border-2 border-white flex items-center justify-center text-[9px] font-semibold text-ink-2"
                      >
                        {m.avatar}
                      </div>
                    ))}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Minimal footer ───────────────────────────────── */}
      <footer className="border-t border-border bg-canvas">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-xs">B</span>
            </div>
            <span className="font-semibold text-ink text-sm tracking-tight">BuildTogether</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-ink-2">
            <Link href="/explore" className="hover:text-accent transition-colors">Explore</Link>
            <Link href="/signup" className="hover:text-accent transition-colors">Get Early Access</Link>
            <Link href="/login" className="hover:text-accent transition-colors">Log in</Link>
          </div>
          <p className="text-xs text-ink-3">Built by students, for students.</p>
        </div>
      </footer>
    </div>
  );
}
