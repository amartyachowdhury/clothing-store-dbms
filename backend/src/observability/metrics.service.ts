import { Injectable } from "@nestjs/common";

const MAX_LATENCY_SAMPLES = 500;

@Injectable()
export class MetricsService {
  private startedAt = Date.now();
  private requestsTotal = 0;
  private errorsTotal = 0;
  private statusCounts: Record<string, number> = {};
  private latencyMs: number[] = [];

  recordRequest(statusCode: number, durationMs: number) {
    this.requestsTotal += 1;
    if (statusCode >= 500) {
      this.errorsTotal += 1;
    }

    const bucket = `${Math.floor(statusCode / 100)}xx`;
    this.statusCounts[bucket] = (this.statusCounts[bucket] ?? 0) + 1;

    this.latencyMs.push(durationMs);
    if (this.latencyMs.length > MAX_LATENCY_SAMPLES) {
      this.latencyMs.shift();
    }
  }

  snapshot() {
    const sorted = [...this.latencyMs].sort((a, b) => a - b);
    const p95Index =
      sorted.length > 0 ? Math.floor(sorted.length * 0.95) : 0;

    return {
      uptimeSeconds: Math.floor((Date.now() - this.startedAt) / 1000),
      processUptimeSeconds: Math.floor(process.uptime()),
      requestsTotal: this.requestsTotal,
      errorsTotal: this.errorsTotal,
      statusCounts: { ...this.statusCounts },
      latencyMs: {
        samples: sorted.length,
        avg:
          sorted.length > 0
            ? Math.round(
                sorted.reduce((sum, value) => sum + value, 0) / sorted.length,
              )
            : 0,
        p95: sorted[p95Index] ?? 0,
        max: sorted[sorted.length - 1] ?? 0,
      },
    };
  }
}
