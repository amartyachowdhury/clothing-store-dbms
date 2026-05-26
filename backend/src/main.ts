import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { logEvent } from "./observability/logger";
import { setupRequestId } from "./observability/request-id";

function parseCorsOrigins(): string | string[] {
  const raw = process.env.CORS_ORIGINS?.trim();
  if (!raw || raw === "*") {
    return "http://localhost:3000";
  }
  const origins = raw
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  return origins.length === 1 ? origins[0] : origins;
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { logger: ["log", "error", "warn"] },
  );

  setupRequestId(app);

  app.enableCors({
    origin: parseCorsOrigins(),
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    exposedHeaders: ["X-Request-Id"],
  });

  const port = Number(process.env.PORT ?? 4000);
  await app.listen({ port, host: "0.0.0.0" });

  logEvent("info", "server_started", { port, host: "0.0.0.0" });
}

bootstrap().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  logEvent("error", "server_start_failed", { error: message });
  process.exit(1);
});
