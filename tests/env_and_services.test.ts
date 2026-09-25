import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { appendDevSink } from "@/lib/dev_sink";
import { resendClient, resendConfig } from "@/lib/resend";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.resetModules();
});

describe("env.siteUrl", () => {
  it("defaults to the local dev server", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
    const { env } = await import("@/lib/env");
    expect(env.siteUrl).toBe("http://localhost:3000");
  });

  it("drops a trailing slash", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com/");
    const { env } = await import("@/lib/env");
    expect(env.siteUrl).toBe("https://example.com");
  });

  it("fails fast on a malformed URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "not a url");
    await expect(import("@/lib/env")).rejects.toThrow("NEXT_PUBLIC_SITE_URL is not a valid URL");
  });
});

describe("resend configuration", () => {
  it("has no client without an API key", () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect(resendClient()).toBeNull();
  });

  it("creates a client when a key is set", () => {
    vi.stubEnv("RESEND_API_KEY", "placeholder");
    expect(resendClient()).not.toBeNull();
  });

  it("reads the audience and addresses from the environment", () => {
    vi.stubEnv("RESEND_AUDIENCE_ID", "audience-1");
    vi.stubEnv("CONTACT_TO_EMAIL", "inbox@example.com");
    vi.stubEnv("CONTACT_FROM_EMAIL", "site@example.com");
    expect(resendConfig()).toEqual({
      audienceId: "audience-1",
      contactTo: "inbox@example.com",
      contactFrom: "site@example.com",
    });
  });
});

describe("appendDevSink", () => {
  it("appends one timestamped JSON line per call to the named sink in the working directory", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "openk-sink-"));
    vi.spyOn(process, "cwd").mockReturnValue(dir);
    try {
      await appendDevSink("subscribe", { email: "a@example.com" });
      await appendDevSink("subscribe", { email: "c@example.org" });
      const lines = readFileSync(path.join(dir, ".subscribe-sink.log"), "utf8").trim().split("\n");
      expect(lines.map((line) => JSON.parse(line).email)).toEqual([
        "a@example.com",
        "c@example.org",
      ]);
      expect(Number.isNaN(Date.parse(JSON.parse(lines[0]).at))).toBe(false);
      await appendDevSink("contact", { name: "Ada" });
      const contact = readFileSync(path.join(dir, ".contact-sink.log"), "utf8");
      expect(JSON.parse(contact).name).toBe("Ada");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
