import type { Submission } from "@/lib/types";

function formatWhen(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function SubmissionFeed({ submissions }: { submissions: Submission[] }) {
  if (submissions.length === 0) {
    return (
      <div className="rounded-3xl border border-[var(--foreground)]/10 bg-gradient-to-br from-[var(--beige)] to-[var(--background)] p-12 text-center shadow-lg shadow-[var(--shadow)]">
        <div className="text-4xl">🌹</div>
        <p className="mt-4 font-serif text-lg text-[var(--foreground)]/60">
          No memories yet.
          <br />
          Be the first to share yours.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
      {submissions.map((s, i) => {
        // Alternate card backgrounds for variety
        const bgGradients = [
          "from-[var(--background)] to-[var(--beige)]",
          "from-[var(--beige)] to-[var(--background)]",
          "from-[var(--background)] via-[var(--beige)] to-[var(--background)]",
        ];
        const gradient = bgGradients[i % bgGradients.length];

        return (
          <article
            key={s.id}
            className={`group relative overflow-hidden rounded-3xl border border-[var(--foreground)]/10 bg-gradient-to-br ${gradient} p-6 shadow-lg shadow-[var(--shadow)] transition-all hover:shadow-xl hover:shadow-[var(--shadow-strong)] sm:p-8`}
          >
            {/* Location pin badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--rose)]/20 bg-[var(--rose)]/10 px-3 py-1 text-sm font-medium text-[var(--rose-deep)]">
              <span className="text-xs">📍</span>
              <span>{s.location_text}</span>
            </div>

            {/* Media first if it exists */}
            {s.media_url && s.media_type?.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={s.media_url}
                alt={`Memory from ${s.location_text}`}
                className="mb-5 aspect-[4/3] w-full rounded-2xl border border-[var(--foreground)]/10 object-cover shadow-md"
                loading="lazy"
              />
            ) : null}

            {s.media_url && s.media_type?.startsWith("video/") ? (
              <video
                className="mb-5 w-full rounded-2xl border border-[var(--foreground)]/10 shadow-md"
                controls
                preload="metadata"
                src={s.media_url}
                aria-label={`Video memory from ${s.location_text}`}
              />
            ) : null}

            {/* Message - the heart of the memory */}
            <blockquote className="relative border-l-2 border-[var(--rose)]/30 pl-4">
              <p className="whitespace-pre-wrap font-serif text-base leading-relaxed text-[var(--foreground)] sm:text-lg">
                {s.message}
              </p>
            </blockquote>

            {/* Timestamp - subtle, like a postmark */}
            <time
              dateTime={s.created_at}
              className="mt-4 block text-xs tracking-wide text-[var(--foreground)]/40"
            >
              {formatWhen(s.created_at)}
            </time>

            {/* Decorative corner element */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--rose)]/5 blur-2xl transition-opacity group-hover:opacity-80"></div>
          </article>
        );
      })}
    </div>
  );
}

