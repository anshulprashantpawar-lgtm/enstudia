export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="skeleton h-4 w-32 mb-10" />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile card */}
        <div className="space-y-4">
          <div className="border border-border rounded-xl p-6 bg-surface flex flex-col items-center gap-3">
            <div className="skeleton h-14 w-14 rounded-xl" />
            <div className="skeleton h-5 w-28" />
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-3 w-24" />
          </div>
          <div className="border border-border rounded-xl p-5 bg-surface space-y-3">
            <div className="skeleton h-3 w-16" />
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-6 w-16 rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          <div className="border border-border rounded-xl p-6 bg-surface space-y-3">
            <div className="skeleton h-3 w-16" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-3/4" />
          </div>
          <div className="border border-border rounded-xl p-6 bg-surface space-y-3">
            <div className="skeleton h-3 w-24" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="skeleton h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
