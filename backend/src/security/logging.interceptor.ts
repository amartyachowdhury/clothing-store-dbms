import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, catchError, tap, throwError } from "rxjs";
import { logEvent } from "../observability/logger";
import { MetricsService } from "../observability/metrics.service";
import {
  getRequestId,
  type RequestWithId,
} from "../observability/request-id";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithId>();
    const method = request.method ?? "UNKNOWN";
    const path = request.routerPath ?? request.url ?? "/";
    const requestId = getRequestId(request);
    const started = Date.now();

    const logRequest = (statusCode: number, error?: string) => {
      const durationMs = Date.now() - started;
      this.metrics.recordRequest(statusCode, durationMs);

      logEvent(error ? "error" : "info", "http_request", {
        requestId,
        method,
        path,
        statusCode,
        durationMs,
        ...(error ? { error } : {}),
      });
    };

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<{
          statusCode?: number;
        }>();
        logRequest(response.statusCode ?? 200);
      }),
      catchError((error: unknown) => {
        const statusCode =
          typeof error === "object" &&
          error !== null &&
          "getStatus" in error &&
          typeof (error as { getStatus: () => number }).getStatus === "function"
            ? (error as { getStatus: () => number }).getStatus()
            : 500;

        const message =
          error instanceof Error ? error.message : "Unknown error";
        logRequest(statusCode, message);
        return throwError(() => error);
      }),
    );
  }
}
