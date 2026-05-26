import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP");

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{
      method?: string;
      url?: string;
    }>();
    const method = request.method ?? "UNKNOWN";
    const url = request.url ?? "/";
    const started = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<{
          statusCode?: number;
        }>();
        const status = response.statusCode ?? 0;
        const ms = Date.now() - started;
        this.logger.log(`${method} ${url} ${status} ${ms}ms`);
      }),
    );
  }
}
