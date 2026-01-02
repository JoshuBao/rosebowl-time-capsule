"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { submitMemory, type SubmitMemoryState } from "@/app/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
    >
      {pending ? "Saving…" : "Add to the capsule"}
    </button>
  );
}

const initialState: SubmitMemoryState = { ok: false, error: "" };

export function SubmitForm() {
  const [state, formAction] = useFormState(submitMemory, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const [geo, setGeo] = useState<
    | { status: "idle" }
    | { status: "loading" }
    | { status: "ready"; lat: number; lng: number }
    | { status: "error"; message: string }
  >({ status: "idle" });

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  const lat = geo.status === "ready" ? String(geo.lat) : "";
  const lng = geo.status === "ready" ? String(geo.lng) : "";

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Add your memory</h2>
          <p className="mt-1 text-sm text-black/60">
            Where were you watching from, and what did it feel like?
          </p>
        </div>
      </div>

      {/* Honeypot (bots fill this) */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
      />

      <div className="mt-4 grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Where were you watching?</span>
          <input
            name="location_text"
            required
            placeholder="Colorado Blvd near Orange Grove, couch in LA, etc."
            className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">A sentence or two</span>
          <textarea
            name="message"
            required
            rows={3}
            placeholder="What did you notice? Who were you with? What hit you emotionally?"
            className="w-full resize-y rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
          />
        </label>

        <div className="grid gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium">
              Optional: add a pin (approx)
            </span>
            <div className="flex items-center gap-2">
              {geo.status === "ready" ? (
                <button
                  type="button"
                  onClick={() => setGeo({ status: "idle" })}
                  className="rounded-xl border border-black/10 px-3 py-1.5 text-xs font-medium hover:bg-black/5"
                >
                  Clear pin
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  if (!navigator.geolocation) {
                    setGeo({
                      status: "error",
                      message: "Geolocation not supported in this browser.",
                    });
                    return;
                  }
                  setGeo({ status: "loading" });
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      setGeo({
                        status: "ready",
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                      });
                    },
                    () => {
                      setGeo({
                        status: "error",
                        message: "Couldn’t get location. (Permission denied?)",
                      });
                    },
                    { enableHighAccuracy: false, timeout: 8000 },
                  );
                }}
                className="rounded-xl border border-black/10 px-3 py-1.5 text-xs font-medium hover:bg-black/5"
              >
                Use my location
              </button>
            </div>
          </div>

          <input type="hidden" name="lat" value={lat} />
          <input type="hidden" name="lng" value={lng} />

          {geo.status === "loading" && (
            <p className="text-xs text-black/60">Getting your location…</p>
          )}
          {geo.status === "ready" && (
            <p className="text-xs text-black/60">
              Pin saved as approx coords. (You can submit without a pin.)
            </p>
          )}
          {geo.status === "error" && (
            <p className="text-xs text-red-600">{geo.message}</p>
          )}
        </div>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Optional photo / clip</span>
          <input
            name="media"
            type="file"
            accept="image/*,video/*"
            className="block w-full text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
          />
          <p className="text-xs text-black/60">Up to 8MB.</p>
        </label>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <SubmitButton />
        <div className="text-right text-sm">
          {!state.ok && state.error ? (
            <span className="text-red-600">{state.error}</span>
          ) : null}
          {state.ok ? <span className="text-green-700">{state.message}</span> : null}
        </div>
      </div>
    </form>
  );
}

