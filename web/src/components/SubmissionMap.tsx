import type { Submission } from "@/lib/types";

function toFixedCoord(n: number): string {
  // keep URLs short + stable
  return n.toFixed(5);
}

function buildStaticMapUrl(
  token: string,
  points: Array<{ lat: number; lng: number }>,
): string {
  // Mapbox Static Images API with rose-colored pins
  // https://docs.mapbox.com/api/maps/static-images/
  const style = "mapbox/light-v11"; // Lighter, softer style
  const maxPins = 25; // URL-length sanity
  const overlays = points.slice(0, maxPins).map((p) => {
    const lng = toFixedCoord(p.lng);
    const lat = toFixedCoord(p.lat);
    // D4727E is our rose color
    return `pin-s+D4727E(${lng},${lat})`;
  });

  const overlaysPart = overlays.length ? `${overlays.join(",")}/` : "";
  const size = "1200x400";

  const url =
    `https://api.mapbox.com/styles/v1/${style}/static/` +
    `${overlaysPart}auto/${size}@2x` +
    `?padding=50&logo=false&attribution=false&access_token=${encodeURIComponent(
      token,
    )}`;

  return url;
}

export function SubmissionMap({
  submissions,
}: {
  submissions: Submission[];
}) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const withPins = submissions.filter(
    (s) => typeof s.lat === "number" && typeof s.lng === "number",
  );

  if (!token) {
    return (
      <div className="rounded-3xl border border-[var(--foreground)]/10 bg-gradient-to-br from-[var(--beige)] to-[var(--background)] p-8 shadow-lg shadow-[var(--shadow)]">
        <div className="text-center">
          <div className="mb-3 text-3xl">🗺️</div>
          <p className="text-sm leading-relaxed text-[var(--foreground)]/60">
            Map is disabled. Set{" "}
            <code className="rounded bg-[var(--beige-dark)] px-1.5 py-0.5 font-mono text-xs">
              NEXT_PUBLIC_MAPBOX_TOKEN
            </code>{" "}
            to enable location pins.
          </p>
        </div>
      </div>
    );
  }

  if (withPins.length === 0) {
    return (
      <div className="rounded-3xl border border-[var(--foreground)]/10 bg-gradient-to-br from-[var(--beige)] to-[var(--background)] p-8 shadow-lg shadow-[var(--shadow)]">
        <div className="text-center">
          <div className="mb-3 text-3xl">📍</div>
          <p className="text-sm leading-relaxed text-[var(--foreground)]/60">
            No pinned memories yet.
            <br />
            Use &quot;Pin your location&quot; when submitting.
          </p>
        </div>
      </div>
    );
  }

  const url = buildStaticMapUrl(
    token,
    withPins.map((s) => ({ lat: s.lat as number, lng: s.lng as number })),
  );

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[var(--foreground)]/10 shadow-xl shadow-[var(--shadow)] transition-all hover:shadow-2xl hover:shadow-[var(--shadow-strong)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={`Map showing ${withPins.length} pinned ${withPins.length === 1 ? "memory" : "memories"}`}
        className="aspect-[3/2] w-full object-cover transition-transform group-hover:scale-105"
        loading="lazy"
      />
      {/* Pin count badge */}
      <div className="absolute bottom-4 right-4 rounded-full border border-[var(--rose)]/30 bg-[var(--background)]/90 px-3 py-1.5 text-xs font-medium text-[var(--rose-deep)] shadow-lg backdrop-blur-sm">
        {withPins.length} {withPins.length === 1 ? "pin" : "pins"}
      </div>
    </div>
  );
}

