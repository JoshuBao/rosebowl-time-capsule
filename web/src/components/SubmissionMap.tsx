import type { Submission } from "@/lib/types";

function toFixedCoord(n: number): string {
  // keep URLs short + stable
  return n.toFixed(5);
}

function buildStaticMapUrl(
  token: string,
  points: Array<{ lat: number; lng: number }>,
): string {
  // Mapbox Static Images API
  // https://docs.mapbox.com/api/maps/static-images/
  const style = "mapbox/streets-v12";
  const maxPins = 25; // URL-length sanity
  const overlays = points.slice(0, maxPins).map((p) => {
    const lng = toFixedCoord(p.lng);
    const lat = toFixedCoord(p.lat);
    return `pin-s+e11d48(${lng},${lat})`;
  });

  const overlaysPart = overlays.length ? `${overlays.join(",")}/` : "";
  const size = "1200x380";

  const url =
    `https://api.mapbox.com/styles/v1/${style}/static/` +
    `${overlaysPart}auto/${size}` +
    `?padding=40&logo=false&attribution=false&access_token=${encodeURIComponent(
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
      <div className="rounded-2xl border border-black/10 bg-white p-5 text-sm text-black/60">
        Map is disabled (set <code className="font-mono">NEXT_PUBLIC_MAPBOX_TOKEN</code>{" "}
        to enable).
      </div>
    );
  }

  if (withPins.length === 0) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-5 text-sm text-black/60">
        No pinned submissions yet. Add one with “Use my location”.
      </div>
    );
  }

  const url = buildStaticMapUrl(
    token,
    withPins.map((s) => ({ lat: s.lat as number, lng: s.lng as number })),
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="Map of pinned submissions"
        className="h-[380px] w-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

