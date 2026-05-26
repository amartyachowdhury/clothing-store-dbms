import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { HealthController } from "./health/health.controller";
import { CustomersController } from "./customers/customers.controller";
import { ProductsController } from "./products/products.controller";
import { OrdersController } from "./orders/orders.controller";
import { OrdersService } from "./orders/orders.service";
import { PaymentsController } from "./payments/payments.controller";
import { DashboardController } from "./dashboard/dashboard.controller";
import { MetaController } from "./meta/meta.controller";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule],
  controllers: [
    HealthController,
    CustomersController,
    ProductsController,
    OrdersController,
    PaymentsController,
    DashboardController,
    MetaController,
  ],
  providers: [OrdersService],
})
export class AppModule {}

