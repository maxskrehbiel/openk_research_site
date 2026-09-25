/**
 * The contact form's dropdown choices. The form renders them and the contact route accepts only these
 * values, so the topic in the notification email's subject line is never free text.
 */

/** Intent options in display order. `track` is the ?track= value that preselects the option. */
export const INTENTS: readonly { label: string; track?: string }[] = [
  { label: "Methodology walkthrough (allocator or desk)", track: "walkthrough" },
  { label: "A falsification test I want to run", track: "falsification" },
  { label: "Following the work", track: "notes" },
  { label: "Something else" },
];
export const DEFAULT_INTENT = "Something else";

/** Role options after "Prefer not to say", which sends an empty role. */
export const ROLES: readonly string[] = [
  "Allocator or desk",
  "Researcher or quant",
  "Following the work",
  "Other",
];

/** Whether `value` is one of the intent labels, or empty when no intent was sent. */
export function isKnownIntent(value: string): boolean {
  return value === "" || INTENTS.some((option) => option.label === value);
}

/** Whether `value` is one of the roles, or empty for "Prefer not to say". */
export function isKnownRole(value: string): boolean {
  return value === "" || ROLES.includes(value);
}
