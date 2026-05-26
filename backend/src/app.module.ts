import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { PrismaModule } from "./prisma/prisma.module";
import { HealthController } from "./health/health.controller";
import { CustomersController } from "./customers/customers.controller";
import { ProductsController } from "./products/products.controller";
import { OrdersController } from "./orders/orders.controller";
import { OrdersService } from "./orders/orders.service";
import { PaymentsController } from "./payments/payments.controller";
import { DashboardController } from "./dashboard/dashboard.controller";
import { MetaController } from "./meta/meta.controller";
import { ObservabilityModule } from "./observability/observability.module";
import { ApiKeyGuard } from "./security/api-key.guard";
import { LoggingInterceptor } from "./security/logging.interceptor";

const throttleTtl = Number(process.env.THROTTLE_TTL_MS ?? 60_000);
const throttleLimit = Number(process.env.THROTTLE_LIMIT ?? 100);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: throttleTtl, limit: throttleLimit }],
    }),
    ObservabilityModule,
    PrismaModule,
  ],
  controllers: [
    HealthController,
    CustomersController,
    ProductsController,
    OrdersController,
    PaymentsController,
    DashboardController,
    MetaController,
  ],
  providers: [
    OrdersService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: ApiKeyGuard },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
