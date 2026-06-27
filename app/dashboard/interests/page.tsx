import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserProjectById } from "@/lib/project-store";
import { getInterestsByProject } from "@/lib/interest-store";

interface Props {
  searchParams: { projectId?: string };
}

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default async function InterestsPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  const { projectId } = searchParams;
  if (!projectId) redirect("/dashboard");

  const project = getUserProjectById(projectId);
  if (!project) notFound();
  if (project.ownerId !== session.user.id) redirect("/dashboard");

  const interests = getInterestsByProject(projectId);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-ink-3 mb-8">
        <Link href="/dashboard" className="hover:text-ink transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href={`/project/${projectId}`} className="hover:text-ink transition-colors">{project.name}</Link>
        <span>/</span>
        <span className="text-ink-2">Applicants</span>
      </div>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight mb-1">{project.name}</h1>
          <p className="text-sm text-ink-2">
            {interests.length === 0
              ? "No applications yet."
              : `${interests.length} student${interests.length !== 1 ? "s" : ""} expressed interest`}
          </p>
        </div>
        <Link href={`/project/${projectId}`} className="btn-secondary text-xs shrink-0">
          View project
        </Link>
      </div>

      {interests.length === 0 ? (
        <div className="border border-border rounded-xl p-12 bg-surface text-center">
          <p className="text-ink font-medium mb-1">No applications yet</p>
          <p className="text-xs text-ink-3 max-w-xs mx-auto leading-relaxed">
            Once students express interest or apply for roles in your project, they&apos;ll show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {interests.map((interest) => (
            <div key={interest.id} className="border border-border rounded-xl p-5 bg-surface">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center text-xs font-semibold text-ink-2 shrink-0">
                    {interest.userName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ink">{interest.userName}</div>
                    <div className="text-xs text-ink-3">{timeAgo(interest.createdAt)}</div>
                  </div>
                </div>
                {interest.role && (
                  <span className="px-2.5 py-1 rounded-lg text-xs border border-accent/30 bg-accent/5 text-accent shrink-0">
                    {interest.role}
                  </span>
                )}
                {!interest.role && (
                  <span className="px-2.5 py-1 rounded-lg text-xs border border-border bg-white text-ink-3 shrink-0">
                    General interest
                  </span>
                )}
              </div>

              {interest.userSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {interest.userSkills.slice(0, 5).map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded-md text-2xs border bg-white border-border text-ink-2">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {interest.message && (
                <p className="text-sm text-ink-2 leading-relaxed border-t border-border pt-3 mt-3">
                  {interest.message}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
