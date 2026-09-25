/**
 * Research-notes subscribe route: refuses cross-site requests, validates an address, rate-limits by client
 * address, and adds it to a Resend Audience. Without Resend it writes to a local sink in development and
 * fails closed (503) in production, so signups are never silently dropped.
 */
import { invalidRequest, jsonError, jsonOk, tooManyRequests } from "@/lib/api_responses";
import { appendDevSink } from "@/lib/dev_sink";
import { createRateLimiter } from "@/lib/rate_limit";
import { clientIp, isEmail, readJsonObject, rejectCrossSite, textField } from "@/lib/request_input";
import { resendClient, resendConfig } from "@/lib/resend";

const limiter = createRateLimiter({ limit: 5, windowMs: 60_000 });

export async function POST(req: Request) {
  const rejected = rejectCrossSite(req);
  if (rejected) return rejected;
  const limited = limiter.check(clientIp(req));
  if (!limited.ok) return tooManyRequests(limited.retryAfterSeconds);

  const data = await readJsonObject(req);
  if (!data) return invalidRequest();
  // Honeypot: real users never fill the hidden field. Accept quietly to avoid teaching bots.
  if (textField(data, "company")) return jsonOk();
  const email = textField(data, "email");
  if (!isEmail(email)) return jsonError("Please enter a valid email.", 400);

  const resend = resendClient();
  const { audienceId } = resendConfig();
  if (resend && audienceId) {
    try {
      const { error } = await resend.contacts.create({ audienceId, email, unsubscribed: false });
      if (!error) return jsonOk();
      console.error("[subscribe] resend error:", error);
    } catch (e) {
      console.error("[subscribe] resend threw:", e);
    }
    return jsonError("Could not complete signup. Please try again.", 502);
  }

  if (process.env.NODE_ENV !== "production") {
    await appendDevSink("subscribe", { email });
    return jsonOk();
  }

  console.error(
    "[subscribe] Resend is not configured (RESEND_API_KEY / RESEND_AUDIENCE_ID missing).",
  );
  return jsonError("Subscriptions are temporarily unavailable.", 503);
}
