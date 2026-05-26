export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogFields = Record<string, unknown>;

function useJsonLogs(): boolean {
  const format = process.env.LOG_FORMAT?.trim().toLowerCase();
  if (format === "json") return true;
  if (format === "pretty") return false;
  return process.env.NODE_ENV === "production";
}

export function logEvent(level: LogLevel, message: string, fields: LogFields = {}) {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    service: "clothing-store-api",
    ...fields,
  };

  if (useJsonLogs()) {
    const line = JSON.stringify(payload);
    if (level === "error") {
      console.error(line);
    } else if (level === "warn") {
      console.warn(line);
    } else {
      console.log(line);
    }
    return;
  }

  const suffix = Object.keys(fields).length
    ? ` ${JSON.stringify(fields)}`
    : "";
  const prefix = `[${level.toUpperCase()}] ${message}`;
  if (level === "error") {
    console.error(`${prefix}${suffix}`);
  } else if (level === "warn") {
    console.warn(`${prefix}${suffix}`);
  } else {
    console.log(`${prefix}${suffix}`);
  }
}
