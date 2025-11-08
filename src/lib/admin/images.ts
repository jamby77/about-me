import { Buffer } from "node:buffer";
import sharp from "sharp";

export type DataUrlResult = { ok: true; dataUrl: string } | { ok: false; error: string };

// Extract, validate and process an image from FormData and return a base64 WebP data URL
export async function imageDataUrlFromForm(
  form: FormData,
  fieldName: string,
  maxBytes = 5 * 1024 * 1024,
): Promise<DataUrlResult> {
  const file = form.get(fieldName);
  if (!file || !(file instanceof File)) {
    return { ok: false, error: "No file uploaded" };
  }
  const size = (file as File).size || 0;
  if (size > maxBytes) {
    return { ok: false, error: "Image too large (max 5MB)" };
  }
  const arr = new Uint8Array(await (file as File).arrayBuffer());
  const input = Buffer.from(arr);
  let meta;
  try {
    meta = await sharp(input).metadata();
  } catch {
    return { ok: false, error: "Invalid image file" };
  }
  // Allow common photo formats; exclude SVG/GIF
  const allowed = new Set(["jpeg", "jpg", "png", "webp", "avif"]);
  const fmt = (meta.format || "").toLowerCase();
  if (!allowed.has(fmt)) {
    return { ok: false, error: "Unsupported image format" };
  }
  // Re-encode to WebP, max 800px longest side, 300 DPI metadata
  let out: Buffer;
  try {
    out = await sharp(input)
      .rotate()
      .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .withMetadata({ density: 300 })
      .toBuffer();
  } catch {
    return { ok: false, error: "Failed to process image" };
  }
  const base64 = out.toString("base64");
  const mime = "image/webp";
  const dataUrl = `data:${mime};base64,${base64}`;
  return { ok: true, dataUrl };
}
