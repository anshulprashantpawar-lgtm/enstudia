import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PROJECTS, type Project } from "@/lib/data";
import { getUserProjectById, getAllUserProjects } from "@/lib/project-store";
import { countInterestsByProject, getInterestsByProject } from "@/lib/interest-store";
import { getCommentsByProject } from "@/lib/comment-store";
import InterestActionBox from "@/components/InterestActionBox";
import ProjectComments from "@/components/ProjectComments";

interface Props {
  params: { id: string };
}

const STAGE_DESCRIPTIONS: Record<string, string> = {
  Idea:      "Just getting started — the team is defining the problem and exploring solutions.",
  Prototype: "A working prototype exists. The team is validating core assumptions with real users.",
  MVP:       "Minimum viable product is live. Actively finding product-market fit.",
  Growing:   "Proven traction. Scaling users, partnerships, or features.",
};

function avatarInitials(name: string): string {
  return name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "?";
}

export default async function ProjectPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  const userProject = getUserProjectById(params.id);
  const project: Project | null = userProject ?? PROJECTS.find((p) => p.id === params.id) ?? null;
  if (!project) notFound();

  const isSeed = !userProject;
  const isOwner = !isSeed && session?.user?.id === userProject?.ownerId;
  const interestCount = isSeed ? project.likes : countInterestsByProject(project.id);

  // Fetch interests for the "Interested" section (real projects only)
  const interests = isSeed ? [] : getInterestsByProject(project.id);

  // Public comments — available on every project page
  const comments = getCommentsByProject(project.id);

  const realRelated = getAllUserProjects().filter(
    (p) => p.id !== project.id && p.category === project.category
  );
  const seedRelated = PROJECTS.filter(
    (p) => p.id !== project.id && p.category === project.category
  );
  const related = [...realRelated, ...seedRelated].slice(0, 2);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-2 text-xs text-ink-3">
          <Link href="/explore" className="hover:text-ink transition-colors">Explore</Link>
          <span>/</span>
          <span className="text-ink-2">{project.name}</span>
          {isSeed ? (
            <span className="ml-1.5 px-2 py-0.5 rounded-md text-2xs border border-border bg-surface text-ink-3 italic">
              Inspiration
            </span>
          ) : (
            <span className="ml-1.5 px-2 py-0.5 rounded-md text-2xs border border-accent/30 bg-accent/5 text-accent font-medium">
              Live project
            </span>
          )}
        </div>
        {isOwner && (
          <Link
            href={`/projects/${project.id}/edit`}
            className="btn-secondary text-xs px-3.5 py-1.5 shrink-0"
          >
            Edit project
          </Link>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-2 py-0.5 rounded-md text-2xs font-medium border bg-white border-border text-ink-2">
                {project.category}
              </span>
              <span className="px-2 py-0.5 rounded-md text-2xs font-medium border bg-white border-border text-ink-3">
                {project.stage}
              </span>
              <span className="ml-auto text-xs text-ink-3">{interestCount} interested</span>
            </div>
            <h1 className="text-3xl font-bold text-ink tracking-tight mb-3">{project.name}</h1>
            <p className="text-base text-ink-2 leading-relaxed">{project.shortDescription}</p>
          </div>

          {/* About */}
          <div className="border-t border-border pt-8">
            <h2 className="text-xs font-semibold text-ink-3 uppercase tracking-wider mb-4">About this project</h2>
            <p className="text-[15px] text-ink-2 leading-relaxed whitespace-pre-line">{project.fullDescription}</p>
          </div>

          {/* Stage */}
          <div className="border-t border-border pt-8">
            <h2 className="text-xs font-semibold text-ink-3 uppercase tracking-wider mb-4">Stage</h2>
            <div className="flex items-start gap-4">
              <span className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-white text-ink-2 shrink-0">
                {project.stage}
              </span>
              <p className="text-sm text-ink-2 leading-relaxed">{STAGE_DESCRIPTIONS[project.stage]}</p>
            </div>
          </div>

          {/* Skills needed */}
          {project.skillsNeeded.length > 0 && (
            <div className="border-t border-border pt-8">
              <h2 className="text-xs font-semibold text-ink-3 uppercase tracking-wider mb-4">Skills needed</h2>
              <div className="flex flex-wrap gap-2">
                {project.skillsNeeded.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 rounded-lg text-sm border border-border bg-white text-ink-2">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Interest action box */}
          <InterestActionBox
            projectId={project.id}
            openRoles={project.openRoles}
            isSeed={isSeed}
            isOwner={isOwner}
            currentUserId={session?.user?.id ?? null}
            initialInterestCount={interestCount}
            projectName={project.name}
          />

          {/* Team */}
          <div className="border border-border rounded-xl p-5 bg-surface">
            <h2 className="text-xs font-semibold text-ink-3 uppercase tracking-wider mb-4">
              Team ({project.members.length})
            </h2>
            <div className="space-y-3">
              {project.members.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-xs font-semibold text-ink-2 shrink-0">
                    {member.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ink">{member.name}</div>
                    {member.grade && <div className="text-xs text-ink-3">{member.grade}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interested — real projects only */}
          {!isSeed && interests.length > 0 && (
            <div className="border border-border rounded-xl p-5 bg-surface">
              <h2 className="text-xs font-semibold text-ink-3 uppercase tracking-wider mb-4">
                Interested ({interests.length})
              </h2>
              <div className="space-y-4">
                {interests.map((interest) => (
                  <div key={interest.id}>
                    <div className="flex items-center gap-2.5 mb-1">
                      <div className="w-7 h-7 rounded-full bg-white border border-border flex items-center justify-center text-[10px] font-semibold text-ink-2 shrink-0">
                        {avatarInitials(interest.userName)}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-ink">{interest.userName}</span>
                        {interest.role && (
                          <span className="ml-2 text-2xs text-ink-3">— {interest.role}</span>
                        )}
                      </div>
                    </div>
                    {interest.message && (
                      <p className="text-xs text-ink-2 leading-relaxed ml-9 line-clamp-2">
                        {interest.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Open roles */}
          {project.openRoles.length > 0 && (
            <div className="border border-border rounded-xl p-5 bg-surface">
              <h2 className="text-xs font-semibold text-ink-3 uppercase tracking-wider mb-4">
                Open roles ({project.openRoles.length})
              </h2>
              <div className="space-y-2.5">
                {project.openRoles.map((role) => (
                  <div key={role} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <span className="text-sm text-ink-2">{role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="border border-border rounded-xl p-5 bg-surface text-xs space-y-2.5">
            <div className="flex justify-between text-ink-3">
              <span>Posted</span>
              <span className="text-ink-2">
                {new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <div className="flex justify-between text-ink-3">
              <span>Team size</span>
              <span className="text-ink-2">{project.members.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Public comments */}
      <ProjectComments
        projectId={project.id}
        isLoggedIn={!!session?.user}
        initialComments={comments}
      />

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16 pt-10 border-t border-border">
          <h2 className="text-sm font-semibold text-ink-3 uppercase tracking-wider mb-5">More in {project.category}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/project/${p.id}`}
                className="group border border-border rounded-xl p-5 bg-surface hover:border-ink-3 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md text-2xs border bg-white border-border text-ink-2">
                    {p.category}
                  </span>
                </div>
                <h3 className="font-semibold text-ink group-hover:text-accent transition-colors mb-1.5">{p.name}</h3>
                <p className="text-sm text-ink-2 line-clamp-2">{p.shortDescription}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
