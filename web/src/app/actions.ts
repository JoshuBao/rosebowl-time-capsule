"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseAdmin, getStorageBucketName } from "@/lib/supabaseAdmin";
import {
  ALLOWED_MIME_TYPES,
  MAX_UPLOAD_BYTES,
  guessExtensionFromMime,
  submissionInputSchema,
} from "@/lib/validation";

export type SubmitMemoryState =
  | { ok: false; error: string }
  | { ok: true; message: string };

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getOptionalNumber(formData: FormData, key: string): number | undefined {
  const raw = getString(formData, key).trim();
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

export async function submitMemory(
  _prevState: SubmitMemoryState,
  formData: FormData,
): Promise<SubmitMemoryState> {
  try {
    const website = getString(formData, "website").trim();
    if (website) {
      // Honeypot hit: pretend success, do nothing.
      return { ok: true, message: "Thanks — saved." };
    }

    const parsed = submissionInputSchema.safeParse({
      location_text: getString(formData, "location_text").trim(),
      message: getString(formData, "message").trim(),
      lat: getOptionalNumber(formData, "lat"),
      lng: getOptionalNumber(formData, "lng"),
      website: website,
    });

    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid." };
    }

    const supabase = createSupabaseAdmin();
    const bucket = getStorageBucketName();

    const id = crypto.randomUUID();

    const maybeFile = formData.get("media");
    let media_url: string | null = null;
    let media_type: string | null = null;
    let uploadedPath: string | null = null;

    if (maybeFile instanceof File && maybeFile.size > 0) {
      if (maybeFile.size > MAX_UPLOAD_BYTES) {
        return { ok: false, error: "File too large (max 8MB)." };
      }
      if (!ALLOWED_MIME_TYPES.has(maybeFile.type)) {
        return { ok: false, error: "Unsupported file type." };
      }

      const ext = guessExtensionFromMime(maybeFile.type);
      const day = new Date().toISOString().slice(0, 10);
      const path = `submissions/${day}/${id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, maybeFile, { contentType: maybeFile.type, upsert: false });

      if (uploadError) {
        return { ok: false, error: "Upload failed. Try again." };
      }

      uploadedPath = path;
      media_type = maybeFile.type;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      media_url = data.publicUrl ?? null;
    }

    const { error: insertError } = await supabase.from("submissions").insert({
      id,
      location_text: parsed.data.location_text,
      message: parsed.data.message,
      lat: parsed.data.lat ?? null,
      lng: parsed.data.lng ?? null,
      media_url,
      media_type,
    });

    if (insertError) {
      if (uploadedPath) {
        await supabase.storage.from(bucket).remove([uploadedPath]);
      }
      return { ok: false, error: "Couldn’t save that. Try again." };
    }

    revalidatePath("/");
    return { ok: true, message: "Saved. Happy New Year, Pasadena." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error.";
    return { ok: false, error: message };
  }
}

