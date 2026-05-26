import { Controller, Get } from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { PrismaService } from "../prisma/prisma.service";
import { Public } from "../security/public.decorator";

@Public()
@SkipThrottle()
@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: "ok",
        database: "connected" as const,
        uptimeSeconds: Math.floor(process.uptime()),
      };
    } catch {
      return {
        status: "error",
        database: "disconnected" as const,
        uptimeSeconds: Math.floor(process.uptime()),
      };
    }
  }
}

