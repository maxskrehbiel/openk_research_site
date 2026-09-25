import { Resend } from "resend";

/**
 * Resend integration for the contact and subscribe routes. All configuration comes from server-side
 * environment variables that are set in the hosting dashboard, never committed. The client is null when
 * no key is present, which lets the routes fall back to a local sink in development and fail closed in
 * production rather than silently dropping submissions.
 */
export function resendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

export const resendConfig = () => ({
  audienceId: process.env.RESEND_AUDIENCE_ID || "",
  // The From address must be on a domain verified in Resend. The To is where contact messages are delivered.
  contactTo: process.env.CONTACT_TO_EMAIL || "",
  contactFrom: process.env.CONTACT_FROM_EMAIL || "",
});
