export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <header className="border-b border-[var(--foreground)]/5 bg-gradient-to-b from-[var(--beige)] to-[var(--background)] px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl animate-pulse text-center">
          <div className="mx-auto mb-6 h-8 w-56 rounded-full bg-[var(--foreground)]/10"></div>
          <div className="mx-auto mb-4 h-12 w-full max-w-2xl rounded-xl bg-[var(--foreground)]/10 sm:h-14"></div>
          <div className="mx-auto h-12 w-full max-w-lg rounded-xl bg-[var(--foreground)]/10 sm:h-14"></div>
          <div className="mx-auto mt-6 h-6 w-full max-w-2xl rounded-lg bg-[var(--foreground)]/10"></div>
          <div className="mx-auto mt-2 h-6 w-full max-w-xl rounded-lg bg-[var(--foreground)]/10"></div>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <div className="h-12 w-48 rounded-full bg-[var(--foreground)]/10"></div>
            <div className="h-12 w-48 rounded-full bg-[var(--foreground)]/10"></div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="mb-16 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4 animate-pulse">
            <div className="h-8 w-48 rounded-lg bg-[var(--foreground)]/10"></div>
            <div className="h-96 rounded-3xl bg-[var(--beige)]"></div>
          </div>
          <div className="space-y-4 animate-pulse">
            <div className="h-8 w-48 rounded-lg bg-[var(--foreground)]/10"></div>
            <div className="h-96 rounded-3xl bg-[var(--beige)]"></div>
          </div>
        </div>

        <section className="animate-pulse">
          <div className="mb-8 h-8 w-64 rounded-lg bg-[var(--foreground)]/10"></div>
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 rounded-3xl bg-gradient-to-br from-[var(--background)] to-[var(--beige)]"
              ></div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
