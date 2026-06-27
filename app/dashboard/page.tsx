import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById, getAllOnboardedUsers } from "@/lib/user-store";
import { getUserProjectsByOwner } from "@/lib/project-store";
import { countInterestsByProject } from "@/lib/interest-store";
import { redirect } from "next/navigation";
import { PROJECTS, MEMBERS } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";

const RECOMMENDED = PROJECTS.slice(0, 3);

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  const userId = session.user.id;
  const user = getUserById(userId);

  if (!user?.onboardingComplete) redirect("/onboarding");

  const myProjects = getUserProjectsByOwner(userId);

  // Real students (excluding self), fall back to seed if none yet
  const realPeople = getAllOnboardedUsers()
    .filter((u) => u.id !== userId)
    .slice(0, 4);
  const showRealPeople = realPeople.length > 0;
  const suggestedPeople = showRealPeople ? realPeople : MEMBERS.slice(0, 4);

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const userInitials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : (session.user?.email?.[0] ?? "?").toUpperCase();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-sm font-semibold text-ink-2">
            {userInitials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink tracking-tight">Hey, {firstName}</h1>
            {user && (
              <p className="text-xs text-ink-3">{user.grade} · {user.school}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: main */}
        <div className="lg:col-span-2 space-y-10">
          {/* Your Projects */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-ink uppercase tracking-wider">Your Projects</h2>
              <Link
                href="/projects/new"
                className="text-xs text-ink-2 hover:text-ink transition-colors border border-border rounded-lg px-3 py-1.5 hover:bg-surface"
              >
                + New project
              </Link>
            </div>

            {myProjects.length > 0 ? (
              <div className="space-y-4">
                {myProjects.map((project) => {
                  const count = countInterestsByProject(project.id);
                  return (
                    <div key={project.id}>
                      <ProjectCard project={project} interestCount={count} currentUserId={userId} />
                      {count > 0 && (
                        <div className="mt-1.5 ml-1">
                          <Link
                            href={`/dashboard/interests?projectId=${project.id}`}
                            className="text-xs text-accent hover:text-accent-hover transition-colors"
                          >
                            {count} applicant{count !== 1 ? "s" : ""} — view all
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="border border-border rounded-xl p-8 text-center bg-surface">
                <p className="text-ink text-sm font-medium mb-1">No projects yet</p>
                <p className="text-xs text-ink-3 mb-5">
                  Create a project to find collaborators, or browse inspiration ideas below.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link href="/projects/new" className="btn-primary text-xs px-4 py-2">
                    Create a project
                  </Link>
                  <Link href="/explore" className="btn-secondary text-xs px-4 py-2">
                    Browse ideas
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* Inspiration / Featured */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-ink uppercase tracking-wider mb-0.5">Featured Ideas</h2>
                <p className="text-xs text-ink-3">Inspiration from students who&apos;ve built real things</p>
              </div>
              <Link href="/explore" className="text-xs text-ink-2 hover:text-ink transition-colors">
                See all
              </Link>
            </div>
            <div className="space-y-3">
              {RECOMMENDED.map((project) => (
                <Link
                  key={project.id}
                  href={`/project/${project.id}`}
                  className="group flex items-start justify-between gap-4 p-4 border border-border rounded-xl bg-surface hover:border-ink-3 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded-md text-2xs border bg-white border-border text-ink-2">
                        {project.category}
                      </span>
                      <span className="text-2xs text-ink-3 italic">Inspiration</span>
                    </div>
                    <div className="text-sm font-medium text-ink group-hover:text-accent transition-colors truncate">
                      {project.name}
                    </div>
                    <div className="text-xs text-ink-3 mt-0.5 line-clamp-1">{project.shortDescription}</div>
                  </div>
                  <svg className="w-4 h-4 text-ink-3 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Right: sidebar */}
        <div className="space-y-5">
          {/* Profile summary */}
          {user && (
            <div className="border border-border rounded-xl p-5 bg-surface">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xs font-semibold text-ink-3 uppercase tracking-wider">Your profile</h2>
                <div className="flex items-center gap-3">
                  <Link href={`/profile/${userId}`} className="text-2xs text-ink-2 hover:text-ink transition-colors">
                    View
                  </Link>
                  <Link href="/onboarding" className="text-2xs text-accent hover:text-accent-hover transition-colors">
                    Edit
                  </Link>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-ink">{user.name}</div>
                  <div className="text-xs text-ink-3">{user.grade} · {user.school}</div>
                </div>
                {user.skills && user.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {user.skills.slice(0, 4).map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded-md text-2xs border border-border bg-white text-ink-2">
                        {skill}
                      </span>
                    ))}
                    {user.skills.length > 4 && (
                      <span className="px-2 py-0.5 rounded-md text-2xs border border-border bg-white text-ink-3">
                        +{user.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}
                {user.bio && (
                  <p className="text-xs text-ink-2 leading-relaxed line-clamp-3">{user.bio}</p>
                )}
              </div>
            </div>
          )}

          {/* People sidebar */}
          <div className="border border-border rounded-xl p-5 bg-surface">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-2xs font-semibold text-ink-3 uppercase tracking-wider">
                {showRealPeople ? "People on BuildTogether" : "Featured students"}
              </h2>
              {showRealPeople && (
                <Link href="/students" className="text-2xs text-accent hover:text-accent-hover transition-colors">
                  See all
                </Link>
              )}
            </div>
            {!showRealPeople && (
              <p className="text-2xs text-ink-3 mb-4 italic">Inspiration profiles</p>
            )}
            <div className="space-y-3.5 mt-3">
              {suggestedPeople.map((person) => {
                const isReal = showRealPeople;
                const name = (person as { name?: string }).name ?? "";
                const personInitials = name.split(" ").map((p: string) => p[0]).join("").slice(0, 2).toUpperCase() || "?";
                const skill = isReal
                  ? ((person as { skills?: string[] }).skills?.[0] ?? "")
                  : (person as { skills: string[] }).skills[0];
                const grade = isReal
                  ? ((person as { grade?: string }).grade ?? "")
                  : (person as { grade: string }).grade;

                return (
                  <div key={person.id} className="flex items-center gap-3">
                    {isReal ? (
                      <Link href={`/profile/${person.id}`} className="flex items-center gap-3 group flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-xs font-semibold text-ink-2 shrink-0">
                          {personInitials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm text-ink group-hover:text-accent transition-colors truncate">{name}</div>
                          <div className="text-2xs text-ink-3 truncate">{skill}{grade ? ` · ${grade}` : ""}</div>
                        </div>
                      </Link>
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-xs font-semibold text-ink-2 shrink-0">
                          {(person as { avatar: string }).avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm text-ink truncate">{name}</div>
                          <div className="text-2xs text-ink-3 truncate">{skill} · {grade}</div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            {!showRealPeople && (
              <Link href="/students" className="mt-4 text-2xs text-ink-3 hover:text-ink transition-colors block">
                Browse real students
              </Link>
            )}
          </div>

          {/* Platform stats */}
          <div className="border border-border rounded-xl p-5 bg-surface">
            <h2 className="text-2xs font-semibold text-ink-3 uppercase tracking-wider mb-4">Platform stats</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Students", value: "500+" },
                { label: "Projects", value: "120+" },
                { label: "Schools",  value: "40+"  },
                { label: "States",   value: "18"   },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white rounded-lg p-3 border border-border text-center">
                  <div className="text-base font-bold text-ink">{value}</div>
                  <div className="text-2xs text-ink-3 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
