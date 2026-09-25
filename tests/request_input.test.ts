import { describe, expect, it } from "vitest";
import {
  MAX_EMAIL_LENGTH,
  clientIp,
  isEmail,
  readJsonObject,
  rejectCrossSite,
  textField,
} from "@/lib/request_input";

function jsonRequest(body: string, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/test", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body,
  });
}

describe("readJsonObject", () => {
  it("returns a plain object body", async () => {
    expect(await readJsonObject(jsonRequest('{"email":"a@example.com"}'))).toEqual({
      email: "a@example.com",
    });
  });

  it.each(["null", "[]", '["a"]', "42", '"text"', "true", "not json", ""])(
    "rejects %j",
    async (body) => {
      expect(await readJsonObject(jsonRequest(body))).toBeNull();
    },
  );
});

describe("rejectCrossSite", () => {
  it.each<Record<string, string>>([
    {},
    { "content-type": "application/json; charset=utf-8" },
    { origin: "http://localhost", "sec-fetch-site": "same-origin" },
    { origin: "https://openkresearch.com", host: "openkresearch.com" },
    { origin: "https://openkresearch.com", "x-forwarded-host": "openkresearch.com, internal" },
  ])("lets %j through", (headers) => {
    expect(rejectCrossSite(jsonRequest("{}", headers))).toBeNull();
  });

  it.each([
    [{ "content-type": "text/plain" }, 415],
    [{ "content-type": "application/jsonp" }, 415],
    [{ "content-type": "" }, 415],
    [{ origin: "https://elsewhere.example" }, 403],
    [{ origin: "https://openkresearch.com.elsewhere.example", host: "openkresearch.com" }, 403],
    [{ origin: "null" }, 403],
    [{ "sec-fetch-site": "cross-site" }, 403],
    [{ "sec-fetch-site": "same-site" }, 403],
  ])("refuses %j with %i", async (headers, status) => {
    const res = rejectCrossSite(jsonRequest("{}", headers));
    expect(res?.status).toBe(status);
    expect(await res?.json()).toEqual({ error: "Invalid request." });
  });
});

describe("textField", () => {
  it("trims string values", () => {
    expect(textField({ name: "  Ada  " }, "name")).toBe("Ada");
  });

  it("treats missing and non-string values as empty", () => {
    const data = { count: 3, flag: true, nested: { a: 1 }, list: ["x"], nothing: null };
    for (const key of ["missing", "count", "flag", "nested", "list", "nothing"]) {
      expect(textField(data, key)).toBe("");
    }
  });
});

describe("isEmail", () => {
  it.each(["a@example.com", "first.last+tag@sub.example.org"])("accepts %s", (value) => {
    expect(isEmail(value)).toBe(true);
  });

  it.each(["", "plain", "a@b", "@b.co", "a@.", "a b@example.com", "a@b@example.com"])(
    "rejects %j",
    (value) => {
      expect(isEmail(value)).toBe(false);
    },
  );

  it("enforces the length limit", () => {
    const local = "a".repeat(MAX_EMAIL_LENGTH - "@b.co".length);
    expect(isEmail(`${local}@b.co`)).toBe(true);
    expect(isEmail(`a${local}@b.co`)).toBe(false);
  });

  it("rejects a long pathological input without scanning it", () => {
    // Without the length check this input backtracks quadratically in the pattern.
    const input = "a@" + ".".repeat(200_000) + " ";
    const started = performance.now();
    expect(isEmail(input)).toBe(false);
    expect(performance.now() - started).toBeLessThan(50);
  });
});

describe("clientIp", () => {
  it("takes the first forwarded address", () => {
    const req = jsonRequest("{}", { "x-forwarded-for": " 203.0.113.7 , 10.0.0.1" });
    expect(clientIp(req)).toBe("203.0.113.7");
  });

  it("falls back to 'local' without a forwarded address", () => {
    expect(clientIp(jsonRequest("{}"))).toBe("local");
    expect(clientIp(jsonRequest("{}", { "x-forwarded-for": "  " }))).toBe("local");
  });
});
