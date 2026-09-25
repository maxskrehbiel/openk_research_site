"use client";
import { useState, type FormEvent } from "react";

export type FormStatus = "idle" | "sending" | "ok" | "error";

type FormPostOptions = {
  url: string;
  /** Form field names sent as the JSON body, in order. */
  fields: readonly string[];
  successMessage: string;
  /** Shown when the route fails without an error message of its own. */
  fallbackError: string;
};

/**
 * Handles a form that posts its fields as JSON to one of the site's API routes, tracking the request
 * status and the message to show: the success text, the route's error, or a network error.
 */
export function useFormPost({ url, fields, successMessage, fallbackError }: FormPostOptions) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(fields.map((name) => [name, String(form.get(name) || "")]));
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setStatus("ok");
        setMessage(successMessage);
        return;
      }
      const data = await res.json().catch(() => ({}));
      setStatus("error");
      setMessage(data.error || fallbackError);
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return { status, message, onSubmit };
}
