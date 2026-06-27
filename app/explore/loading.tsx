export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10 space-y-2.5">
        <div className="skeleton h-8 w-56" />
        <div className="skeleton h-4 w-80" />
      </div>

      {/* Search + filters */}
      <div className="mb-8 space-y-3">
        <div className="skeleton h-11 max-w-md" />
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="skeleton h-8 w-20" />
          ))}
        </div>
      </div>

      {/* Card grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border border-border rounded-xl p-5 bg-surface space-y-4">
            <div className="flex gap-1.5">
              <div className="skeleton h-5 w-16" />
              <div className="skeleton h-5 w-14" />
            </div>
            <div className="space-y-2">
              <div className="skeleton h-5 w-32" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-3/4" />
            </div>
            <div className="flex gap-1.5">
              <div className="skeleton h-5 w-16" />
              <div className="skeleton h-5 w-16" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="skeleton h-6 w-16 rounded-full" />
              <div className="skeleton h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
