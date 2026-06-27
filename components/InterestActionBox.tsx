"use client";
import { useState } from "react";
import Link from "next/link";
import InterestModal from "./InterestModal";

interface Props {
  projectId: string;
  openRoles?: string[];
  isSeed: boolean;
  isOwner: boolean;
  currentUserId: string | null;
  initialInterestCount: number;
  projectName: string;
}

export default function InterestActionBox({
  projectId,
  isSeed,
  isOwner,
  currentUserId,
  initialInterestCount,
  projectName,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [expressed, setExpressed] = useState(false);
  const [interestCount, setInterestCount] = useState(initialInterestCount);

  // Seed projects: static inspiration notice
  if (isSeed) {
    return (
      <div className="border border-border rounded-xl p-5 bg-surface">
        <p className="text-xs font-medium text-ink mb-1">This is an inspiration project</p>
        <p className="text-xs text-ink-2 leading-relaxed">
          These are curated examples of what students have built. Sign up to post your own project and find real collaborators.
        </p>
        <Link href="/signup" className="btn-primary w-full mt-4 text-xs py-2.5 justify-center">
          Post your own project
        </Link>
      </div>
    );
  }

  // Owner view
  if (isOwner) {
    return (
      <div className="border border-border rounded-xl p-5 bg-surface">
        <p className="text-xs font-medium text-ink mb-1">You own this project</p>
        <p className="text-xs text-ink-2 mb-4">
          {interestCount === 0
            ? "No one has applied yet."
            : `${interestCount} student${interestCount !== 1 ? "s" : ""} expressed interest.`}
        </p>
        {interestCount > 0 && (
          <Link
            href={`/dashboard/interests?projectId=${projectId}`}
            className="btn-primary w-full text-xs py-2.5 justify-center"
          >
            View applicants
          </Link>
        )}
        <Link
          href={`/projects/${projectId}/edit`}
          className="btn-secondary w-full mt-2 text-xs py-2.5 justify-center"
        >
          Edit project
        </Link>
      </div>
    );
  }

  // Not signed in
  if (!currentUserId) {
    return (
      <div className="border border-border rounded-xl p-5 bg-surface">
        <p className="text-xs font-medium text-ink mb-1">Interested in this project?</p>
        <p className="text-xs text-ink-2 leading-relaxed mb-4">
          Sign in to express interest or apply for an open role.
        </p>
        <Link href="/login" className="btn-primary w-full text-xs py-2.5 justify-center">
          Sign in to apply
        </Link>
      </div>
    );
  }

  // Success state
  if (expressed) {
    return (
      <div className="border border-border rounded-xl p-5 bg-surface">
        <p
          className="text-xs font-medium mb-1"
          style={{ color: "#A8A8A8" }}
        >
          Interest Expressed
        </p>
        <p className="text-xs text-ink-3">Your interest has been sent.</p>
      </div>
    );
  }

  // Regular user: button that opens modal
  return (
    <>
      <div className="border border-border rounded-xl p-5 bg-surface">
        <p className="text-xs font-medium text-ink mb-1">Interested in this project?</p>
        <p className="text-xs text-ink-2 leading-relaxed mb-4">
          Let the team know what you bring.
        </p>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="btn-primary w-full text-xs py-2.5 justify-center"
        >
          Express Interest
        </button>
      </div>

      <InterestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        projectId={projectId}
        projectName={projectName}
        onSuccess={() => {
          setExpressed(true);
          setInterestCount((c) => c + 1);
        }}
      />
    </>
  );
}
