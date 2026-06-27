"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import type { Category, Project } from "@/lib/data";

const CATEGORIES: Category[] = [
  "Tech", "Business", "Social Impact", "Science", "Arts & Media", "Education",
];
const STAGES: { value: Project["stage"]; hint: string }[] = [
  { value: "Idea",      hint: "Just an idea, defining the problem" },
  { value: "Prototype", hint: "Building / testing a first version" },
  { value: "MVP",       hint: "Working product, finding fit"       },
  { value: "Growing",   hint: "Real traction, scaling up"          },
];

function TagInput({
  label,
  hint,
  placeholder,
  values,
  onChange,
}: {
  label: string;
  hint?: string;
  placeholder: string;
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  function add() {
    const t = draft.trim().replace(/,$/, "").trim();
    if (t && !values.includes(t)) onChange([...values, t]);
    setDraft("");
  }
  return (
    <div>
      <label className="block text-xs font-medium text-ink-2 mb-1.5">
        {label} {hint && <span className="text-ink-3">{hint}</span>}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className="input flex-1"
        />
        <button type="button" onClick={add} className="btn-secondary text-xs px-3.5">Add</button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2.5">
          {values.map((v) => (
            <span key={v} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface border border-border text-ink flex items-center gap-1.5">
              {v}
              <button
                type="button"
                onClick={() => onChange(values.filter((x) => x !== v))}
                className="text-ink-3 hover:text-accent transition-colors"
                aria-label={`Remove ${v}`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [stage, setStage] = useState<Project["stage"] | "">("");
  const [skillsNeeded, setSkillsNeeded] = useState<string[]>([]);
  const [openRoles, setOpenRoles] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Pre-fill form
  useEffect(() => {
    let active = true;
    fetch(`/api/projects/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!active) return;
        if (!data?.project) { setNotFound(true); setFetching(false); return; }
        const p = data.project;
        setName(p.name ?? "");
        setShortDescription(p.shortDescription ?? "");
        setFullDescription(p.fullDescription ?? "");
        setCategory(p.category ?? "");
        setStage(p.stage ?? "");
        setSkillsNeeded(p.skillsNeeded ?? []);
        setOpenRoles(p.openRoles ?? []);
        setFetching(false);
      })
      .catch(() => { if (active) { setNotFound(true); setFetching(false); } });
    return () => { active = false; };
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !shortDescription.trim() || !fullDescription.trim()) {
      setError("Name, short description, and full description are required.");
      return;
    }
    if (!category) { setError("Pick a project type."); return; }
    if (!stage)    { setError("Pick a stage."); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, shortDescription, fullDescription, category, stage, skillsNeeded, openRoles }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Could not save changes."); setLoading(false); return; }
      router.push(`/project/${id}`);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      router.push("/dashboard");
      router.refresh();
    } catch {
      setDeleting(false);
    }
  }

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-12" />
          ))}
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 text-center">
        <p className="text-ink font-medium mb-2">Project not found</p>
        <p className="text-sm text-ink-3 mb-4">This project may have been deleted or you may not have permission to edit it.</p>
        <Link href="/dashboard" className="text-sm text-accent underline underline-offset-2">Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link href={`/project/${id}`} className="text-xs text-ink-3 hover:text-ink transition-colors mb-8 inline-block">
        Back to project
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink tracking-tight mb-1.5">Edit project</h1>
        <p className="text-sm text-ink-2">Update your project details below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-medium text-ink-2 mb-1.5">Project name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-2 mb-1.5">
            Short description <span className="text-ink-3">— one line for the card</span>
          </label>
          <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className="input" />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-2 mb-1.5">Full description</label>
          <textarea rows={5} value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} className="input resize-none" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1.5">Project type</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="input">
              <option value="">Select type</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1.5">Stage</label>
            <select value={stage} onChange={(e) => setStage(e.target.value as Project["stage"])} className="input">
              <option value="">Select stage</option>
              {STAGES.map((s) => <option key={s.value} value={s.value}>{s.value} — {s.hint}</option>)}
            </select>
          </div>
        </div>
        <TagInput
          label="Skills needed"
          hint="— press Enter to add each"
          placeholder="e.g. React Native"
          values={skillsNeeded}
          onChange={setSkillsNeeded}
        />
        <TagInput
          label="Open roles"
          hint="— positions you're hiring for"
          placeholder="e.g. Backend Developer"
          values={openRoles}
          onChange={setOpenRoles}
        />

        {error && (
          <p className="text-sm text-accent bg-accent/5 border border-accent/20 rounded-lg px-3.5 py-2.5">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <Link href={`/project/${id}`} className="btn-secondary flex-1">Cancel</Link>
          <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-50">
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>

      {/* Danger zone */}
      <div className="mt-12 pt-8 border-t border-border">
        <h2 className="text-xs font-semibold text-ink-3 uppercase tracking-wider mb-3">Danger zone</h2>
        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="btn-secondary text-sm text-red-500 border-red-200 hover:bg-red-50"
          >
            Delete project
          </button>
        ) : (
          <div className="border border-red-200 rounded-xl p-4 bg-red-50">
            <p className="text-sm text-ink mb-3">Are you sure? This cannot be undone.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, delete project"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
