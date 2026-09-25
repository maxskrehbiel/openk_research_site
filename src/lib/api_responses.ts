/** JSON responses shared by the API routes, so both return the same shapes and status codes. */

export function jsonOk(): Response {
  return Response.json({ ok: true });
}

export function jsonError(error: string, status: number): Response {
  return Response.json({ error }, { status });
}

export function invalidRequest(): Response {
  return jsonError("Invalid request.", 400);
}

export function tooManyRequests(retryAfterSeconds: number): Response {
  return Response.json(
    { error: "Too many requests." },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
  );
}
