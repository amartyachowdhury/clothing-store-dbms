import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { describe, expect, it, vi } from "vitest";
import { ApiKeyGuard } from "./api-key.guard";
import { IS_PUBLIC_KEY } from "./public.decorator";

function createContext(headers: Record<string, string>): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ headers }),
      getResponse: () => ({}),
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as ExecutionContext;
}

describe("ApiKeyGuard", () => {
  it("allows requests when API_KEY is unset", () => {
    const guard = new ApiKeyGuard(
      { get: () => undefined } as ConfigService,
      new Reflector(),
    );
    expect(guard.canActivate(createContext({}))).toBe(true);
  });

  it("allows public routes without a key", () => {
    const reflector = new Reflector();
    vi.spyOn(reflector, "getAllAndOverride").mockReturnValue(true);

    const guard = new ApiKeyGuard(
      { get: () => "secret" } as ConfigService,
      reflector,
    );
    expect(guard.canActivate(createContext({}))).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, expect.any(Array));
  });

  it("accepts X-API-Key header", () => {
    const guard = new ApiKeyGuard(
      { get: (key: string) => (key === "API_KEY" ? "secret" : undefined) } as ConfigService,
      new Reflector(),
    );
    expect(
      guard.canActivate(createContext({ "x-api-key": "secret" })),
    ).toBe(true);
  });

  it("rejects missing or wrong keys", () => {
    const guard = new ApiKeyGuard(
      { get: () => "secret" } as ConfigService,
      new Reflector(),
    );
    expect(() => guard.canActivate(createContext({}))).toThrow(
      UnauthorizedException,
    );
    expect(() =>
      guard.canActivate(createContext({ "x-api-key": "wrong" })),
    ).toThrow(UnauthorizedException);
  });
});
