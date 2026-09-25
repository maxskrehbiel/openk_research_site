import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/resend", () => ({ resendClient: vi.fn(), resendConfig: vi.fn() }));
vi.mock("@/lib/dev_sink", () => ({ appendDevSink: vi.fn() }));

import { POST } from "@/app/api/subscribe/route";
import { appendDevSink } from "@/lib/dev_sink";
import { resendClient, resendConfig } from "@/lib/resend";

const createContact = vi.fn();

let nextIp = 0;
function post(body: unknown, ip = `198.51.100.${++nextIp}`, headers: Record<string, string> = {}) {
  return POST(
    new Request("http://localhost/api/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip, ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

function configureResend() {
  vi.mocked(resendClient).mockReturnValue({ contacts: { create: createContact } } as never);
  vi.mocked(resendConfig).mockReturnValue({
    audienceId: "audience-1",
    contactTo: "",
    contactFrom: "",
  });
}

beforeEach(() => {
  vi.mocked(resendClient).mockReturnValue(null);
  vi.mocked(resendConfig).mockReturnValue({ audienceId: "", contactTo: "", contactFrom: "" });
  createContact.mockReset().mockResolvedValue({ error: null });
  vi.mocked(appendDevSink).mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/subscribe", () => {
  it.each(["not json", "null", "[]", '"a@example.com"'])(
    "rejects the body %j with 400",
    async (body) => {
      const res = await post(body);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: "Invalid request." });
    },
  );

  it.each([{}, { email: "nope" }, { email: 7 }, { email: `${"a".repeat(260)}@b.co` }])(
    "rejects %j as an invalid email",
    async (body) => {
      const res = await post(body);
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: "Please enter a valid email." });
    },
  );

  it("accepts a filled honeypot quietly without subscribing", async () => {
    configureResend();
    expect((await post({ email: "a@example.com", company: "Bot Inc" })).status).toBe(200);
    expect(createContact).not.toHaveBeenCalled();
  });

  it("adds the trimmed address to the configured audience", async () => {
    configureResend();
    const res = await post({ email: "  reader@example.com " });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(createContact).toHaveBeenCalledWith({
      audienceId: "audience-1",
      email: "reader@example.com",
      unsubscribed: false,
    });
  });

  it.each([
    [{ "content-type": "text/plain" }, 415],
    [{ origin: "https://elsewhere.example" }, 403],
    [{ "sec-fetch-site": "cross-site" }, 403],
  ])("refuses a cross-site request with %j (%i)", async (headers, status) => {
    configureResend();
    const res = await post({ email: "a@example.com" }, undefined, headers);
    expect(res.status).toBe(status);
    expect(createContact).not.toHaveBeenCalled();
  });

  it("returns 502 when Resend reports an error or throws", async () => {
    configureResend();
    createContact.mockResolvedValueOnce({ error: { message: "rejected" } });
    expect((await post({ email: "a@example.com" })).status).toBe(502);
    createContact.mockRejectedValueOnce(new Error("network down"));
    expect((await post({ email: "a@example.com" })).status).toBe(502);
  });

  it("fails closed with 503 in production when Resend is not configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    expect((await post({ email: "a@example.com" })).status).toBe(503);
    expect(appendDevSink).not.toHaveBeenCalled();
  });

  it("writes to the local sink outside production when Resend is not configured", async () => {
    vi.stubEnv("NODE_ENV", "development");
    expect((await post({ email: "a@example.com" })).status).toBe(200);
    expect(appendDevSink).toHaveBeenCalledWith("subscribe", { email: "a@example.com" });
  });

  it("allows five requests a minute per address, then returns 429", async () => {
    const ip = "192.0.2.30";
    for (let i = 0; i < 5; i++) expect((await post({}, ip)).status).toBe(400);
    const res = await post({ email: "a@example.com" }, ip);
    expect(res.status).toBe(429);
    expect(Number(res.headers.get("Retry-After"))).toBeGreaterThan(0);
  });
});
