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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const validation_1 = require("../validation");
const orders_service_1 = require("../orders/orders.service");
let PaymentsController = class PaymentsController {
    prisma;
    orders;
    constructor(prisma, orders) {
        this.prisma = prisma;
        this.orders = orders;
    }
    async list() {
        return this.prisma.payment.findMany({
            include: { order: { include: { customer: true } } },
            orderBy: { id: "desc" },
        });
    }
    async get(id) {
        const paymentId = Number(id);
        return this.prisma.payment.findUnique({
            where: { id: paymentId },
            include: { order: { include: { customer: true } } },
        });
    }
    async create(body) {
        const parsed = validation_1.paymentSchema.safeParse(body);
        if (!parsed.success) {
            return { error: parsed.error.issues[0]?.message ?? "Invalid payment" };
        }
        return this.orders.withTransaction(async (tx) => {
            const created = await tx.payment.create({ data: parsed.data });
            await this.orders.syncOrderStatusFromPayments(parsed.data.orderId, tx);
            return created;
        });
    }
    async update(id, body) {
        const paymentId = Number(id);
        const parsed = validation_1.paymentSchema.safeParse(body);
        if (!parsed.success) {
            return { error: parsed.error.issues[0]?.message ?? "Invalid payment" };
        }
        return this.orders.withTransaction(async (tx) => {
            const updated = await tx.payment.update({
                where: { id: paymentId },
                data: parsed.data,
            });
            await this.orders.syncOrderStatusFromPayments(parsed.data.orderId, tx);
            return updated;
        });
    }
    async remove(id) {
        const paymentId = Number(id);
        await this.orders.withTransaction(async (tx) => {
            const deleted = await tx.payment.delete({ where: { id: paymentId } });
            await this.orders.syncOrderStatusFromPayments(deleted.orderId, tx);
        });
        return { ok: true };
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "remove", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)("payments"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        orders_service_1.OrdersService])
], PaymentsController);
