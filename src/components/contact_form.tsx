"use client";
import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useFormPost } from "@/components/use_form_post";
import { DEFAULT_INTENT, INTENTS, ROLES } from "@/lib/contact_options";

/** `company` is the hidden honeypot field. */
const FIELDS = ["name", "email", "message", "intent", "role", "firm", "company"];

// A ?track= query preselects the intent. It is read on the client only (the server snapshot is null), so the
// prerendered HTML keeps the default and hydration matches.
const subscribeNoop = () => () => {};
const readTrack = () => new URLSearchParams(window.location.search).get("track");
const serverTrack = () => null;

function IntentAndRoleFields() {
  const track = useSyncExternalStore(subscribeNoop, readTrack, serverTrack);
  const [picked, setPicked] = useState<string | null>(null);
  const intent =
    picked ?? INTENTS.find((option) => track && option.track === track)?.label ?? DEFAULT_INTENT;
  return (
    <>
      <div className="field">
        <label htmlFor="intent">I&apos;m reaching out about</label>
        <select
          id="intent"
          name="intent"
          value={intent}
          onChange={(e) => setPicked(e.target.value)}
        >
          {INTENTS.map(({ label }) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="role">I am a</label>
        <select id="role" name="role" defaultValue="">
          <option value="">Prefer not to say</option>
          {ROLES.map((role) => (
            <option key={role}>{role}</option>
          ))}
        </select>
      </div>
    </>
  );
}

/** Name, firm, email and message inputs; name, email and message are required. */
function ContactDetailFields() {
  return (
    <>
      <div className="field">
        <label htmlFor="name">
          Name{" "}
          <span className="reqmark" aria-hidden="true">
            *
          </span>
        </label>
        <input id="name" name="name" required autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="firm">
          Firm <span className="note">(optional)</span>
        </label>
        <input id="firm" name="firm" autoComplete="organization" />
      </div>
      <div className="field">
        <label htmlFor="email">
          Email{" "}
          <span className="reqmark" aria-hidden="true">
            *
          </span>
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="message">
          Message{" "}
          <span className="reqmark" aria-hidden="true">
            *
          </span>
        </label>
        <textarea id="message" name="message" rows={5} required />
      </div>
    </>
  );
}

export function ContactForm() {
  const { status, message, onSubmit } = useFormPost({
    url: "/api/contact",
    fields: FIELDS,
    successMessage:
      "Thank you for reaching out. Your message has been received, and I will reply by email, usually within a few days.",
    fallbackError: "Something went wrong. Please try again.",
  });

  if (status === "ok")
    return (
      <p role="status" className="lede form-status">
        {message}
      </p>
    );

  return (
    <form onSubmit={onSubmit} noValidate className="contact-form">
      <p className="note form-required-note">
        Fields marked{" "}
        <span className="reqmark" aria-hidden="true">
          *
        </span>{" "}
        are required.
      </p>
      <IntentAndRoleFields />
      <ContactDetailFields />
      <div className="hp" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <button className="btn" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending" : "Send message"}
      </button>
      <p className="note form-footnote">
        Replies come from Max directly. We use your details only to respond to you; see our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
      {status === "error" && (
        <p role="alert" className="note form-error">
          {message}
        </p>
      )}
    </form>
  );
}
