/**
 * Fixed-window, in-memory request limiter for the API routes. Each limiter holds its own windows, so
 * every route gets separate buckets. State lives in one server instance and resets on cold start.
 */

export type RateLimitResult = { ok: boolean; retryAfterSeconds: number };

export type RateLimiter = {
  /** Records one request for `key` and reports whether it falls within the limit. */
  check(key: string, now?: number): RateLimitResult;
  /** Number of keys currently tracked. */
  size(): number;
};

type Window = { count: number; resetAt: number };

/**
 * Creates a limiter that allows `limit` requests per key in each `windowMs` window. Expired windows are
 * evicted at most once per window length, so memory stays bounded by the keys seen in one window.
 */
export function createRateLimiter({
  limit,
  windowMs,
}: {
  limit: number;
  windowMs: number;
}): RateLimiter {
  const windows = new Map<string, Window>();
  let nextSweepAt = 0;

  function evictExpired(now: number): void {
    if (now < nextSweepAt) return;
    for (const [key, window] of windows) {
      if (now >= window.resetAt) windows.delete(key);
    }
    nextSweepAt = now + windowMs;
  }

  return {
    check(key, now = Date.now()) {
      evictExpired(now);
      const window = windows.get(key);
      if (!window || now >= window.resetAt) {
        windows.set(key, { count: 1, resetAt: now + windowMs });
        return { ok: true, retryAfterSeconds: 0 };
      }
      if (window.count >= limit) {
        return { ok: false, retryAfterSeconds: Math.ceil((window.resetAt - now) / 1000) };
      }
      window.count += 1;
      return { ok: true, retryAfterSeconds: 0 };
    },
    size: () => windows.size,
  };
}
