/**
 * Contact route: refuses cross-site requests, validates a submission, rate-limits by client address, and
 * emails it through Resend with the sender as reply-to. Without Resend it writes to a local sink in development and fails closed
 * (503) in production, so messages are never silently dropped.
 */
import { invalidRequest, jsonError, jsonOk, tooManyRequests } from "@/lib/api_responses";
import { isKnownIntent, isKnownRole } from "@/lib/contact_options";
import { appendDevSink } from "@/lib/dev_sink";
import { createRateLimiter } from "@/lib/rate_limit";
import {
  clientIp,
  isEmail,
  readJsonObject,
  rejectCrossSite,
  textField,
  type JsonObject,
} from "@/lib/request_input";
import { resendClient, resendConfig } from "@/lib/resend";

const MAX_NAME_LENGTH = 120;
const MIN_MESSAGE_LENGTH = 5;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_FIRM_LENGTH = 120;

const limiter = createRateLimiter({ limit: 5, windowMs: 60_000 });

type ContactMessage = {
  name: string;
  email: string;
  message: string;
  intent: string;
  role: string;
  firm: string;
};

/** The validated message, or the 400 response explaining the first problem found. */
function parseMessage(data: JsonObject): ContactMessage | Response {
  const fields: ContactMessage = {
    name: textField(data, "name"),
    email: textField(data, "email"),
    message: textField(data, "message"),
    intent: textField(data, "intent"),
    role: textField(data, "role"),
    firm: textField(data, "firm"),
  };
  const { name, email, message, intent, role, firm } = fields;
  if (name.length < 1 || name.length > MAX_NAME_LENGTH)
    return jsonError("Please enter your name.", 400);
  if (!isEmail(email)) return jsonError("Please enter a valid email.", 400);
  if (message.length < MIN_MESSAGE_LENGTH || message.length > MAX_MESSAGE_LENGTH)
    return jsonError("Please enter a message.", 400);
  if (!isKnownIntent(intent) || !isKnownRole(role))
    return jsonError("Please choose a topic and role from the list.", 400);
  if (firm.length > MAX_FIRM_LENGTH)
    return jsonError(`Please keep the firm name under ${MAX_FIRM_LENGTH} characters.`, 400);
  return fields;
}

function escapeHtml(text: string): string {
  return text.replace(/[<>&]/g, (c) => (c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&amp;"));
}

/** Collapses line breaks and runs of whitespace so user input cannot add lines to the subject. */
function singleLine(text: string): string {
  return text.replace(/\s+/g, " ");
}

/** The email Resend sends: a plain-text body with the details above the message, and the same in HTML. */
function composeEmail({ name, email, message, intent, role, firm }: ContactMessage) {
  const details = [
    `Name: ${name}`,
    `Email: ${email}`,
    intent && `Intent: ${intent}`,
    role && `Role: ${role}`,
    firm && `Firm: ${firm}`,
  ].filter(Boolean);
  const text = `${details.join("\n")}\n\n${message}`;
  return {
    subject: singleLine(`OpenK contact: ${intent || "General"} from ${name}`),
    replyTo: email,
    text,
    html: `<pre style="font-family:ui-monospace,monospace;white-space:pre-wrap">${escapeHtml(text)}</pre>`,
  };
}

export async function POST(req: Request) {
  const rejected = rejectCrossSite(req);
  if (rejected) return rejected;
  const limited = limiter.check(clientIp(req));
  if (!limited.ok) return tooManyRequests(limited.retryAfterSeconds);

  const data = await readJsonObject(req);
  if (!data) return invalidRequest();
  // Honeypot: real users never fill the hidden field. Accept quietly to avoid teaching bots.
  if (textField(data, "company")) return jsonOk();
  const parsed = parseMessage(data);
  if (parsed instanceof Response) return parsed;

  const resend = resendClient();
  const { contactTo, contactFrom } = resendConfig();
  if (resend && contactTo && contactFrom) {
    try {
      const { error } = await resend.emails.send({
        from: contactFrom,
        to: contactTo,
        ...composeEmail(parsed),
      });
      if (!error) return jsonOk();
      console.error("[contact] resend error:", error);
    } catch (e) {
      console.error("[contact] resend threw:", e);
    }
    return jsonError("Could not send your message. Please try again.", 502);
  }

  if (process.env.NODE_ENV !== "production") {
    const { name, email, intent, role, firm, message } = parsed;
    await appendDevSink("contact", { name, email, intent, role, firm, len: message.length });
    return jsonOk();
  }

  console.error(
    "[contact] Resend is not configured (RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL missing).",
  );
  return jsonError("The contact form is temporarily unavailable.", 503);
}
