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
      <div className="rounded-2xl border border-black/10 bg-white p-5 text-sm text-black/60">
        No submissions yet. Be the first.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {submissions.map((s) => (
        <article
          key={s.id}
          className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-medium">{s.location_text}</div>
            <div className="text-xs text-black/50">{formatWhen(s.created_at)}</div>
          </div>

          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-black/80">
            {s.message}
          </p>

          {s.media_url && s.media_type?.startsWith("image/") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s.media_url}
              alt="Submission media"
              className="mt-3 max-h-[520px] w-full rounded-xl border border-black/10 object-cover"
              loading="lazy"
            />
          ) : null}

          {s.media_url && s.media_type?.startsWith("video/") ? (
            <video
              className="mt-3 w-full rounded-xl border border-black/10"
              controls
              preload="metadata"
              src={s.media_url}
            />
          ) : null}
        </article>
      ))}
    </div>
  );
}

