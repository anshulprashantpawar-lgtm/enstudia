"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface StudentSummary {
  id: string;
  name?: string;
  grade?: string;
  school?: string;
  skills?: string[];
  bio?: string;
}

function initials(name?: string): string {
  if (!name) return "?";
  return name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "?";
}

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/students")
      .then((r) => (r.ok ? r.json() : { students: [] }))
      .then((data) => { if (active) { setStudents(data.students ?? []); setLoading(false); } })
      .catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  // Deduplicated skill list for filter pills
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => s.skills?.forEach((sk) => set.add(sk)));
    return Array.from(set).sort();
  }, [students]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        !search ||
        (s.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (s.skills ?? []).some((sk) => sk.toLowerCase().includes(search.toLowerCase()));
      const matchSkill =
        !skillFilter ||
        (s.skills ?? []).includes(skillFilter);
      return matchSearch && matchSkill;
    });
  }, [students, search, skillFilter]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-ink tracking-tight mb-1.5">People</h1>
        <p className="text-sm text-ink-2">
          Browse students on BuildTogether and find your next collaborator.
        </p>
      </div>

      {/* Search + filter */}
      <div className="mb-8 space-y-3">
        <div className="relative max-w-md">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white text-sm text-ink placeholder-ink-3 focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {allSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSkillFilter("")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors duration-100 ${
                !skillFilter
                  ? "bg-accent text-white border-accent"
                  : "border-border text-ink-2 hover:text-ink hover:bg-surface bg-transparent"
              }`}
            >
              All skills
            </button>
            {allSkills.slice(0, 16).map((skill) => (
              <button
                key={skill}
                onClick={() => setSkillFilter(skillFilter === skill ? "" : skill)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors duration-100 ${
                  skillFilter === skill
                    ? "bg-accent text-white border-accent"
                    : "border-border text-ink-2 hover:text-ink hover:bg-surface bg-transparent"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton h-40 rounded-xl border border-border" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 border border-border rounded-xl bg-surface">
          {students.length === 0 ? (
            <>
              <p className="text-ink font-medium mb-1">No students yet</p>
              <p className="text-sm text-ink-3">Be the first to sign up and complete your profile.</p>
            </>
          ) : (
            <>
              <p className="text-ink font-medium mb-1">No students match your filters</p>
              <p className="text-sm text-ink-3 mb-4">Try a different name or skill</p>
              <button
                onClick={() => { setSearch(""); setSkillFilter(""); }}
                className="text-sm text-accent underline underline-offset-2 hover:text-accent-hover transition-colors"
              >
                Clear filters
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          <p className="text-xs text-ink-3 mb-5">
            {filtered.length} student{filtered.length !== 1 ? "s" : ""}
            {skillFilter ? ` with ${skillFilter}` : ""}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((student) => (
              <Link
                key={student.id}
                href={`/profile/${student.id}`}
                className="group border border-border rounded-xl p-5 bg-surface hover:border-ink-3 transition-colors"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-sm font-semibold text-ink-2 shrink-0">
                    {initials(student.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-ink group-hover:text-accent transition-colors truncate">
                      {student.name ?? "Student"}
                    </div>
                    {student.grade && (
                      <div className="text-xs text-ink-3 truncate">{student.grade}{student.school ? ` · ${student.school}` : ""}</div>
                    )}
                  </div>
                </div>

                {student.bio && (
                  <p className="text-xs text-ink-2 leading-relaxed line-clamp-2 mb-3">{student.bio}</p>
                )}

                {student.skills && student.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {student.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className={`px-2 py-0.5 rounded-md text-2xs border text-ink-2 ${
                          skillFilter === skill
                            ? "bg-accent/5 border-accent/30 text-accent"
                            : "bg-white border-border"
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                    {student.skills.length > 3 && (
                      <span className="px-2 py-0.5 rounded-md text-2xs border bg-white border-border text-ink-3">
                        +{student.skills.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
