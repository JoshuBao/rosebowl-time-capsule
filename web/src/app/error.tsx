"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error caught by error boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-4xl px-4 py-20 sm:px-6">
        <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
          <div className="mb-8 rounded-full bg-gradient-to-br from-[var(--rose)]/10 to-[var(--gold)]/10 p-8">
            <div className="text-6xl">🌹</div>
          </div>

          <h1 className="mb-4 font-serif text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
            Something went wrong
          </h1>

          <p className="mb-8 max-w-md text-base leading-relaxed text-[var(--foreground)]/60">
            We couldn&apos;t load the Time Capsule right now. This might be a
            temporary hiccup with the database. Give it another try?
          </p>

          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--rose-deep)] px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-[var(--rose)]/20 transition-all hover:scale-105 hover:bg-[var(--rose)] hover:shadow-xl hover:shadow-[var(--rose)]/30"
          >
            Try again
            <span>↻</span>
          </button>

          {error.digest && (
            <div className="mt-8 rounded-full bg-[var(--beige)] px-4 py-2">
              <p className="text-xs text-[var(--foreground)]/40">
                Error ID: {error.digest}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
