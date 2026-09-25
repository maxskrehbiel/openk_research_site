/** Request parsing and field validation shared by the contact and subscribe API routes. */

import { jsonError } from "@/lib/api_responses";

/** Longest address accepted, per the RFC 5321 path limit. Also bounds the regex below. */
export const MAX_EMAIL_LENGTH = 254;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type JsonObject = Record<string, unknown>;

/**
 * The response refusing a request a browser could have sent from another site, or null when it may
 * proceed. A page elsewhere can make a visitor's browser post a form or a text/plain fetch with no CORS
 * preflight, so the routes accept only a JSON content type (which needs a preflight this site never
 * grants) and, whenever the browser reports where the request came from, only this site's own origin.
 */
export function rejectCrossSite(req: Request): Response | null {
  const contentType = req.headers.get("content-type") ?? "";
  if (!/^application\/json\s*(;|$)/i.test(contentType)) return jsonError("Invalid request.", 415);
  const fetchSite = req.headers.get("sec-fetch-site");
  const origin = req.headers.get("origin");
  if ((fetchSite && fetchSite !== "same-origin") || (origin && !isOwnOrigin(origin, req)))
    return jsonError("Invalid request.", 403);
  return null;
}

/** Whether `origin` names the host the request was sent to: the proxy's forwarded host, else Host. */
function isOwnOrigin(origin: string, req: Request): boolean {
  const forwarded = req.headers.get("x-forwarded-host")?.split(",")[0].trim();
  const host = forwarded || req.headers.get("host") || new URL(req.url).host;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Parses a JSON request body, returning it only when it is a plain object (not null, an array or a scalar). */
export async function readJsonObject(req: Request): Promise<JsonObject | null> {
  let data: unknown;
  try {
    data = await req.json();
  } catch {
    return null;
  }
  return typeof data === "object" && data !== null && !Array.isArray(data)
    ? (data as JsonObject)
    : null;
}

/** Returns the trimmed string at `key`, or "" when the field is missing or not a string. */
export function textField(data: JsonObject, key: string): string {
  const value = data[key];
  return typeof value === "string" ? value.trim() : "";
}

/** A permissive syntax check: one "@", no whitespace, and a dot in the domain. */
export function isEmail(value: string): boolean {
  return value.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(value);
}

/** The client address the hosting proxy put first in x-forwarded-for, or "local" when there is none. */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for") ?? "";
  return forwarded.split(",")[0].trim() || "local";
}
