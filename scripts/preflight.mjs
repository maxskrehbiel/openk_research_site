// Publication preflight: fails if files that should never be committed or deployed are present.
// Checks for environment files, raw data dumps, logs, key material, and unexpectedly large files.
import { readdirSync, statSync } from "fs";
import { join } from "path";

const SKIP = new Set(["node_modules", ".next", ".git", ".vercel"]);
const DENY = [
  /^\.env(\..*)?$/,
  /\.parquet$/i,
  /\.csv$/i,
  /\.log$/i,
  /\.pem$/i,
  /\.key$/i,
  /\.p12$/i,
];
const MAX_BYTES = 1_000_000; // anything over ~1 MB outside build output is suspicious for this site

const hits = [];
function walk(dir) {
  for (const e of readdirSync(dir)) {
    if (SKIP.has(e)) continue;
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (DENY.some((re) => re.test(e))) hits.push(`${p} (denylisted name)`);
    else if (s.size > MAX_BYTES) hits.push(`${p} (${s.size} bytes)`);
  }
}
walk(process.cwd());
if (hits.length) {
  console.error("PREFLIGHT FAIL:\n" + hits.join("\n"));
  process.exit(1);
}
console.log("PREFLIGHT OK: no denylisted or oversized files.");
