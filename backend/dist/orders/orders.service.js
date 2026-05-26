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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async recalculateOrderTotal(orderId, db) {
        const items = await db.orderItem.findMany({ where: { orderId } });
        const total = items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);
        await db.order.update({
            where: { id: orderId },
            data: { totalAmount: total > 0 ? total : 0 },
        });
        return total;
    }
    async syncOrderStatusFromPayments(orderId, db) {
        const [order, payments] = await Promise.all([
            db.order.findUnique({ where: { id: orderId } }),
            db.payment.findMany({ where: { orderId } }),
        ]);
        if (!order)
            return;
        if (payments.length === 0) {
            await db.order.update({
                where: { id: orderId },
                data: { status: client_1.OrderStatus.PENDING },
            });
            return;
        }
        const paidTotal = payments
            .filter((p) => p.status === client_1.PaymentStatus.PAID)
            .reduce((sum, p) => sum + Number(p.amount), 0);
        const orderTotal = Number(order.totalAmount);
        const nextStatus = orderTotal > 0 && paidTotal >= orderTotal
            ? client_1.OrderStatus.COMPLETED
            : client_1.OrderStatus.PENDING;
        await db.order.update({ where: { id: orderId }, data: { status: nextStatus } });
    }
    async withTransaction(fn) {
        return this.prisma.$transaction(fn);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
