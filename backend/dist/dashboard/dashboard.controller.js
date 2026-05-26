"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardController = class DashboardController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async stats() {
        const [customerCount, productCount, orderCount, paymentCount] = await Promise.all([
            this.prisma.customer.count(),
            this.prisma.product.count(),
            this.prisma.order.count(),
            this.prisma.payment.count(),
        ]);
        return { customerCount, productCount, orderCount, paymentCount };
    }
    async revenue() {
        const revenue = await this.prisma.payment.aggregate({
            where: { status: "PAID" },
            _sum: { amount: true },
        });
        return { total: Number(revenue._sum.amount ?? 0) };
    }
    async recentOrders() {
        return this.prisma.order.findMany({
            take: 5,
            orderBy: { orderDate: "desc" },
            include: { customer: true },
        });
    }
    async lowStock() {
        return this.prisma.product.findMany({
            where: { stockQty: { lte: 10 } },
            orderBy: { stockQty: "asc" },
            take: 5,
        });
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "stats", null);
__decorate([
    (0, common_1.Get)("revenue"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "revenue", null);
__decorate([
    (0, common_1.Get)("recent-orders"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "recentOrders", null);
__decorate([
    (0, common_1.Get)("low-stock"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "lowStock", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)("dashboard"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardController);
