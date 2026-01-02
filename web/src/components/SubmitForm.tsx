"use client";

import { useEffect, useRef, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";

import { submitMemory, type SubmitMemoryState } from "@/app/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--rose-deep)] px-8 py-3 text-base font-medium text-white shadow-lg shadow-[var(--rose)]/20 transition-all hover:scale-105 hover:bg-[var(--rose)] hover:shadow-xl hover:shadow-[var(--rose)]/30 disabled:opacity-50 disabled:hover:scale-100"
    >
      {pending ? (
        <>
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
          Saving your memory...
        </>
      ) : (
        <>
          Add to the capsule
          <span>→</span>
        </>
      )}
    </button>
  );
}

const initialState: SubmitMemoryState = { ok: false, error: "" };

export function SubmitForm() {
  const [state, formAction] = useActionState(submitMemory, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const [geo, setGeo] = useState<
    | { status: "idle" }
    | { status: "loading" }
    | { status: "ready"; lat: number; lng: number }
    | { status: "error"; message: string }
  >({ status: "idle" });
  
  const [addressInput, setAddressInput] = useState("");

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setGeo({ status: "idle" });
      setAddressInput("");
    }
  }, [state.ok]);

  const handleGeocode = async () => {
    if (!addressInput.trim()) return;
    
    setGeo({ status: "loading" });
    
    try {
      // Use OpenStreetMap Nominatim API (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressInput.trim())}&limit=1`,
        {
          headers: {
            "User-Agent": "RoseBowlTimeCapsule/1.0", // Required by Nominatim
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Geocoding service unavailable");
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        setGeo({
          status: "ready",
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
        });
      } else {
        setGeo({
          status: "error",
          message: "Address not found. Try a more specific location.",
        });
      }
    } catch (error) {
      setGeo({
        status: "error",
        message: "Couldn't find that address. Try a different search term.",
      });
    }
  };

  const lat = geo.status === "ready" ? String(geo.lat) : "";
  const lng = geo.status === "ready" ? String(geo.lng) : "";

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-3xl border border-[var(--foreground)]/10 bg-gradient-to-br from-[var(--background)] to-[var(--beige)] p-8 shadow-xl shadow-[var(--shadow)]"
    >
      <p className="mb-6 text-base leading-relaxed text-[var(--foreground)]/70">
        No account needed. Just share a moment that mattered to you.
      </p>

      {/* Honeypot (bots fill this) */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
      />

      <div className="grid gap-6">
        <label className="grid gap-2">
          <span className="text-sm font-medium tracking-wide text-[var(--foreground)]/80">
            Where were you?
          </span>
          <input
            name="location_text"
            required
            placeholder="Along Colorado Blvd, on my couch in Echo Park..."
            className="w-full rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)] px-4 py-3 text-base text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:border-[var(--rose)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--rose)]/20"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium tracking-wide text-[var(--foreground)]/80">
            What was it like?
          </span>
          <textarea
            name="message"
            required
            rows={4}
            placeholder="The sun was warm, families lined the street. I felt..."
            className="w-full resize-y rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)] px-4 py-3 text-base leading-relaxed text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:border-[var(--rose)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--rose)]/20"
          />
        </label>

        <div className="grid gap-3 rounded-2xl border border-[var(--foreground)]/5 bg-[var(--beige)]/50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-medium tracking-wide text-[var(--foreground)]/80">
              📍 Pin your location (optional)
            </span>
            <div className="flex items-center gap-2">
              {geo.status === "ready" ? (
                <button
                  type="button"
                  onClick={() => {
                    setGeo({ status: "idle" });
                    setAddressInput("");
                  }}
                  className="rounded-full border border-[var(--foreground)]/10 bg-[var(--background)] px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--foreground)]/5"
                >
                  Clear
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
                        message: "Couldn't get location. (Permission denied?)",
                      });
                    },
                    { enableHighAccuracy: false, timeout: 8000 },
                  );
                }}
                className="rounded-full border border-[var(--sky)]/30 bg-[var(--sky)]/10 px-3 py-1.5 text-xs font-medium text-[var(--sky)] transition-colors hover:bg-[var(--sky)]/20"
              >
                Use my location
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="Type an address (e.g., 'Colorado Blvd, Pasadena' or 'Rose Bowl Stadium')"
                className="flex-1 rounded-xl border border-[var(--foreground)]/10 bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:border-[var(--sky)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--sky)]/20"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && addressInput.trim()) {
                    e.preventDefault();
                    handleGeocode();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleGeocode}
                disabled={!addressInput.trim() || geo.status === "loading"}
                className="rounded-xl border border-[var(--sky)]/30 bg-[var(--sky)]/10 px-4 py-2 text-xs font-medium text-[var(--sky)] transition-colors hover:bg-[var(--sky)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Find
              </button>
            </div>
          </div>

          <input type="hidden" name="lat" value={lat} />
          <input type="hidden" name="lng" value={lng} />

          {geo.status === "loading" && (
            <p className="text-xs text-[var(--foreground)]/60">
              {addressInput ? "Looking up address..." : "Getting your location..."}
            </p>
          )}
          {geo.status === "ready" && (
            <p className="text-xs text-[var(--sky)]">
              ✓ Location saved (approximate). You&apos;ll appear on the map.
            </p>
          )}
          {geo.status === "error" && (
            <p className="text-xs text-[var(--rose-deep)]">{geo.message}</p>
          )}
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-medium tracking-wide text-[var(--foreground)]/80">
            Add a photo or video (optional)
          </span>
          <input
            name="media"
            type="file"
            accept="image/*,video/*"
            className="block w-full rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] file:mr-4 file:rounded-full file:border-0 file:bg-[var(--rose-deep)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white file:transition-colors hover:file:bg-[var(--rose)]"
          />
          <p className="text-xs text-[var(--foreground)]/50">Up to 8MB</p>
        </label>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton />
        <div className="text-sm">
          {!state.ok && state.error ? (
            <div className="rounded-full bg-[var(--rose-deep)]/10 px-4 py-2 text-[var(--rose-deep)]">
              {state.error}
            </div>
          ) : null}
          {state.ok ? (
            <div className="rounded-full bg-[var(--sky)]/20 px-4 py-2 text-[var(--sky)]">
              ✓ {state.message}
            </div>
          ) : null}
        </div>
      </div>
    </form>
  );
}

