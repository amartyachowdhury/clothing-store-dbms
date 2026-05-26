# Observability

The NestJS API includes lightweight observability suitable for local demos and small deployments. For production at scale, forward logs to your platform and export metrics to Prometheus or similar.

## Request tracing

- Every request gets an **`X-Request-Id`** header (honours incoming `x-request-id` when present).
- The Next.js server sends a new `x-request-id` on each API call so logs can be correlated end-to-end.
- HTTP logs include `requestId`, `method`, `path`, `statusCode`, and `durationMs`.

## Structured logging

| Env | Behaviour |
|-----|-----------|
| `LOG_FORMAT=json` | One JSON object per line (recommended for production log aggregators). |
| `LOG_FORMAT=pretty` | Human-readable lines (local dev). |
| *(unset)* | JSON when `NODE_ENV=production`, otherwise pretty. |

Example JSON log line:

```json
{"level":"info","message":"http_request","timestamp":"2026-05-26T12:00:00.000Z","service":"clothing-store-api","requestId":"…","method":"GET","path":"/customers","statusCode":200,"durationMs":12}
```

## Metrics

**`GET /metrics`** (public, not rate-limited) returns in-process counters:

- `requestsTotal`, `errorsTotal` (5xx)
- `statusCounts` by class (`2xx`, `4xx`, …)
- `latencyMs`: rolling window avg / p95 / max (last 500 requests)
- `uptimeSeconds`

Use for dashboards or health checks in demos. Reset on process restart.

## Health

**`GET /health`** includes `uptimeSeconds` plus database connectivity.

## Next steps for production

- Ship logs to CloudWatch, Datadog, Loki, etc.
- Replace in-memory `/metrics` with Prometheus instrumentation.
- Add OpenTelemetry traces if you need distributed tracing across services.
