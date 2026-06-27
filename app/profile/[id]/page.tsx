import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MEMBERS, PROJECTS, type Member } from "@/lib/data";
import { getUserById } from "@/lib/user-store";
import { getUserProjectsByOwner } from "@/lib/project-store";

interface Props {
  params: { id: string };
}

function initials(name: string): string {
  return name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "?";
}

export default async function ProfilePage({ params }: Props) {
  const session = await getServerSession(authOptions);

  const realUser = getUserById(params.id);
  const seedMember = MEMBERS.find((m) => m.id === params.id);
  if (!realUser && !seedMember) notFound();

  const isSeed = !realUser;
  const isOwnProfile = !isSeed && session?.user?.id === params.id;
  const isOtherRealUser = !isSeed && !isOwnProfile;

  const member: Pick<Member, "name" | "grade" | "school" | "avatar" | "skills" | "bio"> = realUser
    ? {
        name: realUser.name ?? "Student",
        grade: realUser.grade ?? "",
        school: realUser.school ?? "",
        avatar: initials(realUser.name ?? "Student"),
        skills: realUser.skills ?? [],
        bio: realUser.bio ?? "",
      }
    : {
        name: seedMember!.name,
        grade: seedMember!.grade,
        school: seedMember!.school,
        avatar: seedMember!.avatar,
        skills: seedMember!.skills,
        bio: seedMember!.bio,
      };

  const projects = isSeed
    ? PROJECTS.filter((p) => seedMember!.activeProjects.includes(p.id))
    : getUserProjectsByOwner(params.id);

  // Back navigation context
  const backHref  = isOwnProfile ? "/dashboard" : isOtherRealUser ? "/students" : "/explore";
  const backLabel = isOwnProfile ? "Back to dashboard" : isOtherRealUser ? "Back to People" : "Back to Explore";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Back */}
      <Link href={backHref} className="text-xs text-ink-3 hover:text-ink transition-colors flex items-center gap-1.5 mb-10">
        {backLabel}
      </Link>

      {/* Seed notice */}
      {isSeed && (
        <div className="mb-8 px-4 py-3 border border-border rounded-lg bg-surface text-xs text-ink-2">
          This is a featured inspiration profile — not a real user account.
          <Link href="/signup" className="ml-2 text-accent underline underline-offset-2 hover:text-accent-hover transition-colors">
            Create your own profile
          </Link>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile card */}
        <div className="space-y-4">
          <div className="border border-border rounded-xl p-6 bg-surface">
            <div className="w-14 h-14 rounded-xl bg-white border border-border flex items-center justify-center text-lg font-semibold text-ink-2 mx-auto mb-5">
              {member.avatar}
            </div>
            <div className="text-center">
              <h1 className="text-lg font-bold text-ink tracking-tight mb-0.5">{member.name}</h1>
              {member.grade && <p className="text-sm text-ink-2">{member.grade}</p>}
              {member.school && <p className="text-xs text-ink-3 mt-0.5">{member.school}</p>}
            </div>

            {/* CTA: own profile — edit; other real user — collaborate note; seed — nothing */}
            {(isOwnProfile || isOtherRealUser) && (
              <div className="mt-5 pt-4 border-t border-border">
                {isOwnProfile && (
                  <Link href="/onboarding" className="btn-secondary text-xs w-full justify-center">
                    Edit profile
                  </Link>
                )}
                {isOtherRealUser && (
                  <p className="text-xs text-ink-3 text-center leading-relaxed">
                    Connect by collaborating on a project.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Skills */}
          {member.skills.length > 0 && (
            <div className="border border-border rounded-xl p-5 bg-surface">
              <h2 className="text-2xs font-semibold text-ink-3 uppercase tracking-wider mb-3">Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {member.skills.map((skill) => (
                  <span key={skill} className="px-2.5 py-1 rounded-lg text-xs border border-border bg-white text-ink-2">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Bio */}
          {member.bio && (
            <div className="border border-border rounded-xl p-6 bg-surface">
              <h2 className="text-2xs font-semibold text-ink-3 uppercase tracking-wider mb-3">About</h2>
              <p className="text-sm text-ink-2 leading-relaxed">{member.bio}</p>
            </div>
          )}

          {/* Projects */}
          <div className="border border-border rounded-xl p-6 bg-surface">
            <h2 className="text-2xs font-semibold text-ink-3 uppercase tracking-wider mb-4">
              Projects ({projects.length})
            </h2>
            {projects.length > 0 ? (
              <div className="space-y-3">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/project/${project.id}`}
                    className="group flex items-start justify-between gap-4 p-4 rounded-lg border border-border hover:border-ink-3 bg-white transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded-md text-2xs border bg-surface border-border text-ink-2">
                          {project.category}
                        </span>
                        <span className="text-2xs text-ink-3">{project.stage}</span>
                      </div>
                      <div className="text-sm font-medium text-ink group-hover:text-accent transition-colors">
                        {project.name}
                      </div>
                      <div className="text-xs text-ink-3 mt-0.5 line-clamp-1">
                        {project.shortDescription}
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-ink-3 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-3">No projects yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
