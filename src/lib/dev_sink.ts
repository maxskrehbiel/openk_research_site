/** Development fallback for the form routes when Resend is not configured. */
import { promises as fs } from "fs";
import path from "path";

// Literal file names keep the paths statically analyzable, so the build traces only these two files
// into the server output instead of the whole project.
const SINK_PATHS = {
  contact: () => path.join(process.cwd(), ".contact-sink.log"),
  subscribe: () => path.join(process.cwd(), ".subscribe-sink.log"),
};

export type SinkName = keyof typeof SINK_PATHS;

/**
 * Appends one JSON line to the git-ignored `.<name>-sink.log` file in the working directory. Write
 * errors are ignored because the sink only exists to make local form testing visible.
 */
export async function appendDevSink(name: SinkName, record: Record<string, unknown>) {
  const line = JSON.stringify({ at: new Date().toISOString(), ...record }) + "\n";
  await fs.appendFile(SINK_PATHS[name](), line, "utf8").catch(() => {});
}
