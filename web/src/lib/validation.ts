import { z } from "zod";

export const submissionInputSchema = z.object({
  location_text: z
    .string()
    .min(2, "Add a little more detail for location.")
    .max(120, "Keep location under 120 characters."),
  message: z
    .string()
    .min(2, "Add a sentence or two.")
    .max(400, "Keep it under 400 characters."),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  website: z.string().max(0).optional(), // honeypot
});

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB

export const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export function guessExtensionFromMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "video/mp4":
      return "mp4";
    case "video/webm":
      return "webm";
    case "video/quicktime":
      return "mov";
    default:
      return "bin";
  }
}

