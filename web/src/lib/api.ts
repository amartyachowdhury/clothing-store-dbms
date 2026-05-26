function getApiBaseUrl() {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000"
  );
}

function getDefaultHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  const apiKey = process.env.API_KEY?.trim();
  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }
  return headers;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function readErrorMessage(data: unknown, status: number): string {
  if (typeof data === "object" && data !== null) {
    if ("error" in data && typeof (data as { error: unknown }).error === "string") {
      return (data as { error: string }).error;
    }
    if ("message" in data && typeof (data as { message: unknown }).message === "string") {
      return (data as { message: string }).message;
    }
  }
  if (status === 401) {
    return "API authentication failed. Check API_KEY on the web and backend.";
  }
  if (status >= 500) {
    return "The API is unavailable. Ensure the backend and database are running.";
  }
  return `Request failed (${status})`;
}

export async function apiJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        ...getDefaultHeaders(),
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      "Could not reach the API. Start the backend (port 4000) or check API_URL.",
      0,
    );
  }

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    throw new ApiError(readErrorMessage(data, res.status), res.status);
  }

  return data as T;
}

export type HealthStatus = {
  status: "ok" | "error";
  database: "connected" | "disconnected";
};

export async function fetchHealth(): Promise<HealthStatus> {
  try {
    return await apiJson<HealthStatus>("/health");
  } catch {
    return { status: "error", database: "disconnected" };
  }
}
