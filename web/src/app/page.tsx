import { SubmitForm } from "@/components/SubmitForm";
import { SubmissionFeed } from "@/components/SubmissionFeed";
import { SubmissionMap } from "@/components/SubmissionMap";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";
import type { Submission } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const isSupabaseConfigured = Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  let submissions: Submission[] = [];
  if (isSupabaseConfigured) {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("submissions")
      .select(
        "id, created_at, location_text, message, lat, lng, media_url, media_type",
      )
      .order("created_at", { ascending: false })
      .limit(50);
    if (!error) submissions = (data ?? []) as Submission[];
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-black">
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-black/70">
            <span className="text-rose-600">🌹</span>
            <span>Rose Bowl Time Capsule</span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Where were you — and what did it feel like?
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-black/60">
            A living, crowd-sourced archive of the Rose Parade / Rose Bowl moment.
            No logins. Just quick memories, pinned around Pasadena/LA.
          </p>
        </header>

        {!isSupabaseConfigured ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            Supabase isn’t configured yet. Add{" "}
            <code className="font-mono">SUPABASE_URL</code> and{" "}
            <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> in{" "}
            <code className="font-mono">web/.env.local</code> (see{" "}
            <code className="font-mono">web/README.md</code>).
          </div>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start">
          <SubmitForm />
          <div className="grid gap-3">
            <h2 className="text-sm font-semibold text-black/70">
              Pinned memories
            </h2>
            <SubmissionMap submissions={submissions} />
          </div>
        </div>

        <section className="mt-10">
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2 className="text-sm font-semibold text-black/70">
              Latest submissions
            </h2>
            <p className="text-xs text-black/50">Newest first</p>
          </div>
          <SubmissionFeed submissions={submissions} />
        </section>
      </main>
    </div>
  );
}
