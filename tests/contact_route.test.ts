import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/resend", () => ({ resendClient: vi.fn(), resendConfig: vi.fn() }));
vi.mock("@/lib/dev_sink", () => ({ appendDevSink: vi.fn() }));

import { POST as contactPost } from "@/app/api/contact/route";
import { POST as subscribePost } from "@/app/api/subscribe/route";
import { INTENTS, ROLES } from "@/lib/contact_options";
import { appendDevSink } from "@/lib/dev_sink";
import { resendClient, resendConfig } from "@/lib/resend";

const send = vi.fn();
const VALID = { name: "Ada Lovelace", email: "ada@example.com", message: "Hello there." };

// Each test uses its own client address so the module-level rate limiter never interferes.
let nextIp = 0;
function post(body: unknown, ip = `198.51.100.${++nextIp}`, headers: Record<string, string> = {}) {
  return contactPost(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip, ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

function configureResend() {
  vi.mocked(resendClient).mockReturnValue({ emails: { send } } as never);
  vi.mocked(resendConfig).mockReturnValue({
    audienceId: "",
    contactTo: "inbox@example.com",
    contactFrom: "site@example.com",
  });
}

beforeEach(() => {
  vi.mocked(resendClient).mockReturnValue(null);
  vi.mocked(resendConfig).mockReturnValue({ audienceId: "", contactTo: "", contactFrom: "" });
  send.mockReset().mockResolvedValue({ error: null });
  vi.mocked(appendDevSink).mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/contact validation", () => {
  it.each(["not json", "null", "[]", "42"])("rejects the body %j with 400", async (body) => {
    const res = await post(body);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid request." });
  });

  it.each([
    [{ ...VALID, name: "" }, "Please enter your name."],
    [{ ...VALID, name: "x".repeat(121) }, "Please enter your name."],
    [{ ...VALID, email: "not-an-email" }, "Please enter a valid email."],
    [{ ...VALID, message: "hey" }, "Please enter a message."],
    [{ ...VALID, message: "x".repeat(5001) }, "Please enter a message."],
    [{ ...VALID, name: 42 }, "Please enter your name."],
  ])("rejects %j", async (body, error) => {
    const res = await post(body);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error });
  });

  it("caps the length of firm", async () => {
    expect((await post({ ...VALID, firm: "x".repeat(120) })).status).toBe(200);
    const res = await post({ ...VALID, firm: "x".repeat(121) });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/under 120 characters/);
  });

  it.each(INTENTS.map(({ label }) => label))("accepts the listed intent %j", async (intent) => {
    expect((await post({ ...VALID, intent })).status).toBe(200);
  });

  it.each(["", ...ROLES])("accepts the listed role %j", async (role) => {
    expect((await post({ ...VALID, role })).status).toBe(200);
  });

  it.each([
    { intent: "URGENT: verify your account" },
    { intent: "something else" },
    { role: "Account security team" },
  ])("rejects %j, which is not a listed option", async (field) => {
    const res = await post({ ...VALID, ...field });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Please choose a topic and role from the list." });
  });

  it.each([
    [{ "content-type": "text/plain" }, 415],
    [{ "content-type": "application/x-www-form-urlencoded" }, 415],
    [{ origin: "https://elsewhere.example" }, 403],
    [{ "sec-fetch-site": "cross-site" }, 403],
  ])("refuses a cross-site request with %j (%i)", async (headers, status) => {
    configureResend();
    const res = await post(VALID, undefined, headers);
    expect(res.status).toBe(status);
    expect(send).not.toHaveBeenCalled();
  });

  it("accepts a same-origin browser request", async () => {
    const headers = { origin: "http://localhost", "sec-fetch-site": "same-origin" };
    expect((await post(VALID, undefined, headers)).status).toBe(200);
  });

  it("accepts a filled honeypot quietly without sending anything", async () => {
    configureResend();
    const res = await post({ ...VALID, company: "Bot Inc" });
    expect(res.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });
});

describe("POST /api/contact delivery", () => {
  it("emails the message with the sender as reply-to and escaped HTML", async () => {
    configureResend();
    const res = await post({
      ...VALID,
      name: "Ada\nLovelace",
      intent: "A falsification test I want to run",
      firm: "<Analytical Engines>",
    });
    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledTimes(1);
    const email = send.mock.calls[0][0];
    expect(email).toMatchObject({
      from: "site@example.com",
      to: "inbox@example.com",
      replyTo: "ada@example.com",
      subject: "OpenK contact: A falsification test I want to run from Ada Lovelace",
    });
    expect(email.text).toBe(
      [
        "Name: Ada\nLovelace",
        "Email: ada@example.com",
        "Intent: A falsification test I want to run",
        "Firm: <Analytical Engines>",
        "",
        "Hello there.",
      ].join("\n"),
    );
    expect(email.html).toContain("Firm: &lt;Analytical Engines&gt;");
    expect(email.html).not.toContain("<Analytical");
  });

  it("uses 'General' as the subject topic when no intent is given", async () => {
    configureResend();
    await post(VALID);
    expect(send.mock.calls[0][0].subject).toBe("OpenK contact: General from Ada Lovelace");
  });

  it("returns 502 when Resend reports an error", async () => {
    configureResend();
    send.mockResolvedValue({ error: { message: "rejected" } });
    expect((await post(VALID)).status).toBe(502);
  });

  it("returns 502 when the Resend call throws", async () => {
    configureResend();
    send.mockRejectedValue(new Error("network down"));
    expect((await post(VALID)).status).toBe(502);
  });

  it("fails closed with 503 in production when Resend is not configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const res = await post(VALID);
    expect(res.status).toBe(503);
    expect(appendDevSink).not.toHaveBeenCalled();
  });

  it("writes to the local sink outside production when Resend is not configured", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const res = await post({ ...VALID, role: "Researcher or quant" });
    expect(res.status).toBe(200);
    expect(appendDevSink).toHaveBeenCalledWith("contact", {
      name: "Ada Lovelace",
      email: "ada@example.com",
      intent: "",
      role: "Researcher or quant",
      firm: "",
      len: VALID.message.length,
    });
  });
});

describe("POST /api/contact rate limiting", () => {
  it("allows five requests a minute per address, then returns 429 with Retry-After", async () => {
    const ip = "192.0.2.10";
    for (let i = 0; i < 5; i++) expect((await post("{}", ip)).status).toBe(400);
    const res = await post(VALID, ip);
    expect(res.status).toBe(429);
    expect(Number(res.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect((await post(VALID, "192.0.2.11")).status).not.toBe(429);
  });

  it("does not share its budget with the subscribe route", async () => {
    const ip = "192.0.2.20";
    for (let i = 0; i < 6; i++) await post("{}", ip);
    expect((await post("{}", ip)).status).toBe(429);
    const res = await subscribePost(
      new Request("http://localhost/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": ip },
        body: JSON.stringify({ email: "nope" }),
      }),
    );
    expect(res.status).toBe(400);
  });
});
