import { describe, expect, it } from "vitest";
import { createRateLimiter } from "@/lib/rate_limit";

const WINDOW_MS = 60_000;
const T0 = 1_000_000;

describe("createRateLimiter", () => {
  it("allows up to the limit in one window, then blocks with the seconds left", () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: WINDOW_MS });
    expect([0, 1, 2].map(() => limiter.check("ip", T0).ok)).toEqual([true, true, true]);
    expect(limiter.check("ip", T0 + 10_000)).toEqual({ ok: false, retryAfterSeconds: 50 });
  });

  it("rounds the retry delay up to whole seconds", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: WINDOW_MS });
    limiter.check("ip", T0);
    expect(limiter.check("ip", T0 + 59_001).retryAfterSeconds).toBe(1);
  });

  it("starts a fresh window once the old one has ended", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: WINDOW_MS });
    expect(limiter.check("ip", T0).ok).toBe(true);
    expect(limiter.check("ip", T0 + WINDOW_MS - 1).ok).toBe(false);
    expect(limiter.check("ip", T0 + WINDOW_MS).ok).toBe(true);
  });

  it("counts each key separately", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: WINDOW_MS });
    expect(limiter.check("a", T0).ok).toBe(true);
    expect(limiter.check("b", T0).ok).toBe(true);
    expect(limiter.check("a", T0).ok).toBe(false);
  });

  it("keeps separate limiters independent, so one route cannot exhaust another", () => {
    const contact = createRateLimiter({ limit: 1, windowMs: WINDOW_MS });
    const subscribe = createRateLimiter({ limit: 1, windowMs: WINDOW_MS });
    contact.check("ip", T0);
    expect(contact.check("ip", T0).ok).toBe(false);
    expect(subscribe.check("ip", T0).ok).toBe(true);
  });

  it("evicts expired windows so memory is bounded by recent clients", () => {
    const limiter = createRateLimiter({ limit: 5, windowMs: WINDOW_MS });
    for (let i = 0; i < 100; i++) limiter.check(`client-${i}`, T0);
    expect(limiter.size()).toBe(100);
    limiter.check("late", T0 + WINDOW_MS);
    expect(limiter.size()).toBe(1);
  });

  it("sweeps at most once per window length", () => {
    const limiter = createRateLimiter({ limit: 5, windowMs: WINDOW_MS });
    limiter.check("a", T0); // sweep; the next one is due at T0 + WINDOW_MS
    limiter.check("b", T0 + 10);
    limiter.check("c", T0 + WINDOW_MS); // sweep evicts "a" only
    expect(limiter.size()).toBe(2);
    limiter.check("d", T0 + WINDOW_MS + 20); // "b" has expired, but no sweep is due yet
    expect(limiter.size()).toBe(3);
    limiter.check("e", T0 + 2 * WINDOW_MS); // sweep evicts "b" and "c"
    expect(limiter.size()).toBe(2);
  });
});
