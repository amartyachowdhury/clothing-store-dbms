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

export async function apiJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      ...getDefaultHeaders(),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const data = (await res.json()) as T;
  return data;
}

