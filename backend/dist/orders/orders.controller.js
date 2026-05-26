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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const validation_1 = require("../validation");
const orders_service_1 = require("./orders.service");
let OrdersController = class OrdersController {
    prisma;
    orders;
    constructor(prisma, orders) {
        this.prisma = prisma;
        this.orders = orders;
    }
    async list(q) {
        const query = q?.trim();
        return this.prisma.order.findMany({
            where: query
                ? {
                    OR: [
                        // status query
                        { status: { equals: query.toUpperCase() } },
                        { customer: { name: { contains: query, mode: "insensitive" } } },
                        { employee: { name: { contains: query, mode: "insensitive" } } },
                    ],
                }
                : undefined,
            include: { customer: true, employee: true },
            orderBy: { orderDate: "desc" },
        });
    }
    async get(id) {
        const orderId = Number(id);
        return this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                customer: true,
                employee: true,
                items: { include: { product: true } },
                payments: true,
            },
        });
    }
    async create(body) {
        const parsed = validation_1.orderCreateSchema.safeParse(body);
        if (!parsed.success) {
            return { error: parsed.error.issues[0]?.message ?? "Invalid order" };
        }
        const order = await this.prisma.order.create({
            data: {
                customerId: parsed.data.customerId,
                employeeId: parsed.data.employeeId,
                orderDate: parsed.data.orderDate ? new Date(parsed.data.orderDate) : new Date(),
                totalAmount: 0,
                status: "PENDING",
            },
        });
        return order;
    }
    async remove(id) {
        const orderId = Number(id);
        await this.prisma.order.delete({ where: { id: orderId } });
        return { ok: true };
    }
    async upsertItem(id, body) {
        const orderId = Number(id);
        const parsed = validation_1.orderItemSchema.safeParse(body);
        if (!parsed.success) {
            return { error: parsed.error.issues[0]?.message ?? "Invalid line item" };
        }
        await this.orders.withTransaction(async (tx) => {
            await tx.orderItem.upsert({
                where: {
                    orderId_productId: {
                        orderId,
                        productId: parsed.data.productId,
                    },
                },
                update: {
                    quantity: parsed.data.quantity,
                    unitPrice: parsed.data.unitPrice,
                },
                create: {
                    orderId,
                    productId: parsed.data.productId,
                    quantity: parsed.data.quantity,
                    unitPrice: parsed.data.unitPrice,
                },
            });
            await this.orders.recalculateOrderTotal(orderId, tx);
            await this.orders.syncOrderStatusFromPayments(orderId, tx);
        });
        return { ok: true };
    }
    async removeItem(id, productId) {
        const orderId = Number(id);
        const pid = Number(productId);
        await this.orders.withTransaction(async (tx) => {
            await tx.orderItem.delete({
                where: { orderId_productId: { orderId, productId: pid } },
            });
            await this.orders.recalculateOrderTotal(orderId, tx);
            await this.orders.syncOrderStatusFromPayments(orderId, tx);
        });
        return { ok: true };
    }
    async createPayment(id, body) {
        const orderId = Number(id);
        const parsed = validation_1.paymentSchema.safeParse({ ...body, orderId });
        if (!parsed.success) {
            return { error: parsed.error.issues[0]?.message ?? "Invalid payment" };
        }
        const payment = await this.orders.withTransaction(async (tx) => {
            const created = await tx.payment.create({ data: parsed.data });
            await this.orders.syncOrderStatusFromPayments(orderId, tx);
            return created;
        });
        return payment;
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(":id/items"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "upsertItem", null);
__decorate([
    (0, common_1.Delete)(":id/items/:productId"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("productId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Post)(":id/payments"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "createPayment", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)("orders"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        orders_service_1.OrdersService])
], OrdersController);
