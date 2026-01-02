"use client";

import dynamic from "next/dynamic";
import type { Submission } from "@/lib/types";

// Import map component dynamically to avoid SSR issues with Leaflet
const SubmissionMap = dynamic(
  () => import("@/components/SubmissionMap").then((mod) => mod.SubmissionMap),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-3xl border border-[var(--foreground)]/10 bg-gradient-to-br from-[var(--beige)] to-[var(--background)] p-8 shadow-lg shadow-[var(--shadow)]">
        <div className="flex h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mb-3 text-3xl">🗺️</div>
            <p className="text-sm text-[var(--foreground)]/60">
              Loading map...
            </p>
          </div>
        </div>
      </div>
    ),
  },
);

export function SubmissionMapClient({
  submissions,
}: {
  submissions: Submission[];
}) {
  return <SubmissionMap submissions={submissions} />;
}
