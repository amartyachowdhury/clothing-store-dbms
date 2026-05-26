import { describe, expect, it } from "vitest";
import { MetricsService } from "./metrics.service";

describe("MetricsService", () => {
  it("tracks requests and latency snapshot", () => {
    const metrics = new MetricsService();
    metrics.recordRequest(200, 10);
    metrics.recordRequest(201, 20);
    metrics.recordRequest(500, 100);

    const snapshot = metrics.snapshot();
    expect(snapshot.requestsTotal).toBe(3);
    expect(snapshot.errorsTotal).toBe(1);
    expect(snapshot.statusCounts["2xx"]).toBe(2);
    expect(snapshot.statusCounts["5xx"]).toBe(1);
    expect(snapshot.latencyMs.samples).toBe(3);
    expect(snapshot.latencyMs.max).toBe(100);
  });
});
