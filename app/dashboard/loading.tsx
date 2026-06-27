export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10 flex items-center gap-3">
        <div className="skeleton h-10 w-10 rounded-xl" />
        <div className="space-y-2">
          <div className="skeleton h-6 w-40" />
          <div className="skeleton h-3 w-28" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <div className="skeleton h-4 w-32 mb-4" />
            <div className="grid sm:grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="border border-border rounded-xl p-5 bg-surface space-y-4">
                  <div className="skeleton h-5 w-16" />
                  <div className="space-y-2">
                    <div className="skeleton h-5 w-32" />
                    <div className="skeleton h-4 w-full" />
                  </div>
                  <div className="skeleton h-6 w-20" />
                </div>
              ))}
            </div>
          </section>
          <section>
            <div className="skeleton h-4 w-32 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border border-border rounded-xl p-4 bg-surface space-y-2">
                  <div className="skeleton h-4 w-24" />
                  <div className="skeleton h-4 w-2/3" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-border rounded-xl p-5 bg-surface space-y-3">
              <div className="skeleton h-3 w-24" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
