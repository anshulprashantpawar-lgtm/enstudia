"use client";
import { useEffect, useMemo, useState } from "react";
import { PROJECTS, type Category, type Project } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";

const CATEGORIES: (Category | "All")[] = [
  "All", "Tech", "Business", "Social Impact", "Science", "Arts & Media", "Education",
];

function matches(p: Project, category: Category | "All", search: string) {
  const matchCat = category === "All" || p.category === category;
  const q = search.toLowerCase();
  const matchSearch =
    !search ||
    p.name.toLowerCase().includes(q) ||
    p.shortDescription.toLowerCase().includes(q) ||
    p.skillsNeeded.some((s) => s.toLowerCase().includes(q));
  return matchCat && matchSearch;
}

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [search, setSearch] = useState("");
  const [realProjects, setRealProjects] = useState<Project[]>([]);

  // Load real, user-created projects
  useEffect(() => {
    let active = true;
    fetch("/api/projects")
      .then((r) => (r.ok ? r.json() : { projects: [] }))
      .then((data) => { if (active) setRealProjects(data.projects ?? []); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const filteredReal = useMemo(
    () => realProjects.filter((p) => matches(p, activeCategory, search)),
    [realProjects, activeCategory, search]
  );
  const filteredSeed = useMemo(
    () => PROJECTS.filter((p) => matches(p, activeCategory, search)),
    [activeCategory, search]
  );

  const totalCount = filteredReal.length + filteredSeed.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-ink tracking-tight mb-1.5">Explore Projects</h1>
        <p className="text-sm text-ink-2">
          Discover what students are building — join a live project or get inspired.
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
            placeholder="Search by name, skill, keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white text-sm text-ink placeholder-ink-3 focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors duration-100 ${
                activeCategory === cat
                  ? "bg-accent text-white border-accent"
                  : "border-border text-ink-2 hover:text-ink hover:bg-surface bg-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="text-center py-24 border border-border rounded-xl bg-surface">
          <p className="text-ink font-medium mb-1">No projects match your filters</p>
          <p className="text-sm text-ink-3 mb-4">Try adjusting your search or category</p>
          <button
            onClick={() => { setActiveCategory("All"); setSearch(""); }}
            className="text-sm text-accent underline underline-offset-2 hover:text-accent-hover transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Live community projects */}
          {filteredReal.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <h2 className="text-sm font-semibold text-ink uppercase tracking-wider">Live projects</h2>
                <span className="text-2xs text-ink-3">({filteredReal.length})</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReal.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          )}

          {/* Featured inspiration */}
          {filteredSeed.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-sm font-semibold text-ink uppercase tracking-wider">Featured ideas</h2>
                <span className="text-2xs text-ink-3">({filteredSeed.length})</span>
              </div>
              <p className="text-xs text-ink-3 mb-5">
                Curated inspiration — view-only examples of what students have built.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSeed.map((project) => (
                  <ProjectCard key={project.id} project={project} seed />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
