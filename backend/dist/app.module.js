"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const health_controller_1 = require("./health/health.controller");
const customers_controller_1 = require("./customers/customers.controller");
const products_controller_1 = require("./products/products.controller");
const orders_controller_1 = require("./orders/orders.controller");
const orders_service_1 = require("./orders/orders.service");
const payments_controller_1 = require("./payments/payments.controller");
const dashboard_controller_1 = require("./dashboard/dashboard.controller");
const meta_controller_1 = require("./meta/meta.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot({ isGlobal: true }), prisma_module_1.PrismaModule],
        controllers: [
            health_controller_1.HealthController,
            customers_controller_1.CustomersController,
            products_controller_1.ProductsController,
            orders_controller_1.OrdersController,
            payments_controller_1.PaymentsController,
            dashboard_controller_1.DashboardController,
            meta_controller_1.MetaController,
        ],
        providers: [orders_service_1.OrdersService],
    })
], AppModule);
