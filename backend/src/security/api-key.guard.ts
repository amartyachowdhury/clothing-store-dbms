import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "./public.decorator";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const required = this.config.get<string>("API_KEY")?.trim();
    if (!required) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
    }>();

    const provided = this.extractKey(request.headers);
    if (provided === required) {
      return true;
    }

    throw new UnauthorizedException("Invalid or missing API key");
  }

  private extractKey(
    headers: Record<string, string | string[] | undefined>,
  ): string | undefined {
    const apiKey = headers["x-api-key"];
    if (typeof apiKey === "string" && apiKey.length > 0) {
      return apiKey;
    }

    const auth = headers.authorization;
    const authValue = Array.isArray(auth) ? auth[0] : auth;
    if (typeof authValue === "string") {
      const match = /^Bearer\s+(.+)$/i.exec(authValue);
      if (match?.[1]) {
        return match[1];
      }
    }

    return undefined;
  }
}
