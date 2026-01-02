import { SubmitForm } from "@/components/SubmitForm";
import { SubmissionFeed } from "@/components/SubmissionFeed";
import { SubmissionMapClient } from "@/components/SubmissionMapClient";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";
import type { Submission } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  let isSupabaseConfigured = false;
  let submissions: Submission[] = [];

  // Try to create Supabase client - if it works, we're configured
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("submissions")
      .select(
        "id, created_at, location_text, message, lat, lng, media_url, media_type",
      )
      .order("created_at", { ascending: false })
      .limit(50);
    
    // If we can query (even if empty), Supabase is configured
    isSupabaseConfigured = true;
    if (!error) submissions = (data ?? []) as Submission[];
  } catch {
    // If createSupabaseAdmin throws (missing env vars), not configured
    isSupabaseConfigured = false;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="relative overflow-hidden border-b border-[var(--foreground)]/5 bg-gradient-to-b from-[var(--beige)] to-[var(--background)] px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--rose)]/20 bg-[var(--background)]/80 px-4 py-1.5 text-sm font-medium text-[var(--rose-deep)] shadow-sm backdrop-blur-sm">
            <span>🌹</span>
            <span className="tracking-wide">Rose Bowl Time Capsule</span>
          </div>

          <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            Where were you on
            <br />
            <span className="text-[var(--rose-deep)]">New Year&apos;s Day?</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--foreground)]/70 sm:text-xl">
            A digital scrapbook of moments from the Rose Parade and Rose Bowl.
            Share where you were, how it felt, and become part of the archive.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="#submit"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--rose-deep)] px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-[var(--rose)]/20 transition-all hover:scale-105 hover:bg-[var(--rose)] hover:shadow-xl hover:shadow-[var(--rose)]/30"
            >
              Add your memory
              <span className="text-lg">→</span>
            </a>
            <a
              href="#memories"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--foreground)]/10 bg-[var(--background)]/80 px-8 py-3.5 text-base font-medium text-[var(--foreground)] backdrop-blur-sm transition-all hover:border-[var(--foreground)]/20 hover:bg-[var(--background)]"
            >
              Explore memories
            </a>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[var(--rose)] blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[var(--gold)] blur-3xl"></div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        {!isSupabaseConfigured ? (
          <div className="mb-12 rounded-2xl border border-[var(--gold)]/30 bg-gradient-to-br from-[var(--beige)] to-[var(--background)] p-6 shadow-lg shadow-[var(--shadow)]">
            <div className="flex gap-4">
              <div className="flex-shrink-0 text-2xl">📋</div>
              <div>
                <h3 className="mb-1 font-serif text-lg font-semibold text-[var(--foreground)]">
                  Setup Required
                </h3>
                <p className="text-sm leading-relaxed text-[var(--foreground)]/70">
                  To get started, copy{" "}
                  <code className="rounded bg-[var(--beige-dark)] px-1.5 py-0.5 font-mono text-xs">
                    web/.env.example
                  </code>{" "}
                  to{" "}
                  <code className="rounded bg-[var(--beige-dark)] px-1.5 py-0.5 font-mono text-xs">
                    web/.env.local
                  </code>{" "}
                  and add your Supabase credentials. See{" "}
                  <code className="rounded bg-[var(--beige-dark)] px-1.5 py-0.5 font-mono text-xs">
                    web/README.md
                  </code>{" "}
                  for details.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Submission Form + Map */}
        <section id="submit" className="mb-16 scroll-mt-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 font-serif text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
                Share your moment
              </h2>
              <SubmitForm />
            </div>

            <div>
              <h2 className="mb-6 font-serif text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
                Around Pasadena
              </h2>
              <SubmissionMapClient submissions={submissions} />
            </div>
          </div>
        </section>

        {/* Memory Gallery */}
        <section id="memories" className="scroll-mt-8">
          <div className="mb-8 flex items-end justify-between border-b border-[var(--foreground)]/5 pb-4">
            <h2 className="font-serif text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
              Collected Memories
            </h2>
            <p className="text-sm text-[var(--foreground)]/50">
              {submissions.length} {submissions.length === 1 ? "memory" : "memories"}
            </p>
          </div>
          <SubmissionFeed submissions={submissions} />
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-[var(--foreground)]/5 pt-12 text-center">
          <p className="text-sm text-[var(--foreground)]/40">
            Captured January 2026 • A community archive
          </p>
        </footer>
      </main>
    </div>
  );
}
