"use client";
import Link from "next/link";
import { useFormPost } from "@/components/use_form_post";

/** `company` is the hidden honeypot field. */
const FIELDS = ["email", "company"];

// Research-notes signup. Posts to /api/subscribe, which adds the address to a Resend Audience.
export function NewsletterSignup({ compact = false }: { compact?: boolean }) {
  const { status, message, onSubmit } = useFormPost({
    url: "/api/subscribe",
    fields: FIELDS,
    successMessage: "You're on the list. New findings and essays as they publish.",
    fallbackError: "Something went wrong.",
  });
  const variant = compact ? " compact" : "";

  if (status === "ok")
    return (
      <p role="status" className={`note signup-status${variant}`}>
        {message}
      </p>
    );

  return (
    <form onSubmit={onSubmit} noValidate className={`signup-form${variant}`}>
      <label htmlFor={compact ? "nl-c" : "nl"} className="sr-only">
        Email address
      </label>
      <input
        id={compact ? "nl-c" : "nl"}
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        className="signup-input"
      />
      <div className="hp" aria-hidden="true">
        <label htmlFor={compact ? "nlco-c" : "nlco"}>Company</label>
        <input id={compact ? "nlco-c" : "nlco"} name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <button className="btn" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Adding" : "Get the notes"}
      </button>
      <p className="note signup-consent">
        By subscribing you agree to receive research notes by email and to our{" "}
        <Link href="/privacy">Privacy Policy</Link>. Unsubscribe anytime.
      </p>
      {status === "error" && (
        <p role="alert" className="note signup-error">
          {message}
        </p>
      )}
    </form>
  );
}
