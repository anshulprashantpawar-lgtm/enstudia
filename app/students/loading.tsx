export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10 space-y-2.5">
        <div className="skeleton h-8 w-32" />
        <div className="skeleton h-4 w-80" />
      </div>

      {/* Search + filters */}
      <div className="mb-8 space-y-3">
        <div className="skeleton h-11 max-w-md" />
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-8 w-20" />
          ))}
        </div>
      </div>

      {/* Student card grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border border-border rounded-xl p-5 bg-surface">
            <div className="flex items-start gap-3 mb-4">
              <div className="skeleton h-10 w-10 rounded-xl" />
              <div className="space-y-2 flex-1">
                <div className="skeleton h-4 w-28" />
                <div className="skeleton h-3 w-36" />
              </div>
            </div>
            <div className="space-y-2 mb-3">
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-2/3" />
            </div>
            <div className="flex gap-1.5">
              <div className="skeleton h-5 w-14" />
              <div className="skeleton h-5 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
