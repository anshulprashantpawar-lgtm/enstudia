"use client";
import Link from "next/link";
import { useState } from "react";
import { Project } from "@/lib/data";
import InterestModal from "./InterestModal";

interface Props {
  project: Project;
  /** seed cards are view-only — no interactive actions */
  seed?: boolean;
  /** Live interest count (replaces static likes when provided) */
  interestCount?: number;
  /** Pass the current user's ID so we can hide the button for owners */
  currentUserId?: string | null;
}

export default function ProjectCard({ project, seed = false, interestCount, currentUserId }: Props) {
  const displayCount = interestCount ?? project.likes;
  const [modalOpen, setModalOpen] = useState(false);
  const [expressed, setExpressed] = useState(false);

  // Determine if the Express Interest button should be shown.
  // Hide it for: seed projects, project owners, and logged-out users on the card.
  const ownerId = (project as unknown as Record<string, unknown>).ownerId as string | undefined;
  const isOwner = !!ownerId && currentUserId === ownerId;
  const showButton = !seed && !isOwner;

  const cardContent = (
    <div
      className={`group h-full bg-surface border border-border rounded-xl p-5 flex flex-col gap-4 transition-colors duration-150 ${
        !seed ? "hover:border-ink-3 cursor-pointer" : "cursor-default"
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <span className="px-2 py-0.5 rounded-md text-2xs font-medium border bg-white border-border text-ink-2">
            {project.category}
          </span>
          <span className="px-2 py-0.5 rounded-md text-2xs font-medium border bg-white border-border text-ink-3">
            {project.stage}
          </span>
        </div>
        <span className="text-2xs text-ink-3 whitespace-nowrap">{displayCount} interested</span>
      </div>

      {/* Title + description */}
      <div>
        <h3 className={`font-semibold text-ink leading-snug mb-1.5 ${!seed ? "group-hover:text-accent" : ""} transition-colors`}>
          {project.name}
        </h3>
        <p className="text-sm text-ink-2 leading-relaxed line-clamp-2">
          {project.shortDescription}
        </p>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {project.skillsNeeded.slice(0, 3).map((skill) => (
          <span key={skill} className="px-2 py-0.5 text-2xs rounded-md border border-border text-ink-2 bg-white">
            {skill}
          </span>
        ))}
        {project.skillsNeeded.length > 3 && (
          <span className="px-2 py-0.5 text-2xs rounded-md border border-border text-ink-3 bg-white">
            +{project.skillsNeeded.length - 3} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between gap-3">
        <div className="flex -space-x-2 shrink-0">
          {project.members.map((m) => (
            <div
              key={m.id}
              className="w-6 h-6 rounded-full bg-white border-2 border-surface flex items-center justify-center text-[9px] font-semibold text-ink-2"
              title={m.name}
            >
              {m.avatar}
            </div>
          ))}
        </div>

        {seed ? (
          <span className="text-2xs text-ink-3 italic">Inspiration</span>
        ) : expressed ? (
          /* Post-submit state */
          <span className="text-2xs" style={{ color: "#A8A8A8" }}>
            Interest Expressed
          </span>
        ) : showButton ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setModalOpen(true);
            }}
            className="text-2xs font-medium border border-border rounded-md px-2.5 py-1 text-ink-2 hover:text-accent hover:border-accent transition-colors whitespace-nowrap shrink-0"
          >
            Express Interest
          </button>
        ) : (
          <span className="text-2xs text-ink-3">
            {project.openRoles.length} open role{project.openRoles.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Inline confirmation */}
      {expressed && (
        <p className="text-2xs text-ink-3 -mt-2">Your interest has been sent.</p>
      )}
    </div>
  );

  return (
    <>
      {seed ? (
        cardContent
      ) : (
        <Link href={`/project/${project.id}`} className="block h-full">
          {cardContent}
        </Link>
      )}

      {/* Modal is portaled to document.body — lives outside the Link */}
      {!seed && (
        <InterestModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          projectId={project.id}
          projectName={project.name}
          onSuccess={() => setExpressed(true)}
        />
      )}
    </>
  );
}
