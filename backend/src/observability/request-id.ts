import { randomUUID } from "node:crypto";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";

export const REQUEST_ID_HEADER = "x-request-id";

export type RequestWithId = {
  requestId?: string;
  method?: string;
  url?: string;
  routerPath?: string;
};

export function setupRequestId(app: NestFastifyApplication) {
  const fastify = app.getHttpAdapter().getInstance();

  fastify.addHook("onRequest", async (request, reply) => {
    const incoming = request.headers[REQUEST_ID_HEADER];
    const requestId =
      typeof incoming === "string" && incoming.trim()
        ? incoming.trim()
        : randomUUID();

    (request as RequestWithId).requestId = requestId;
    void reply.header("X-Request-Id", requestId);
  });
}

export function getRequestId(request: RequestWithId): string {
  return request.requestId ?? "unknown";
}
