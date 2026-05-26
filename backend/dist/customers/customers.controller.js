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
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const validation_1 = require("../validation");
let CustomersController = class CustomersController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(q) {
        const query = q?.trim();
        return this.prisma.customer.findMany({
            where: query
                ? {
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { email: { contains: query, mode: "insensitive" } },
                        { phone: { contains: query, mode: "insensitive" } },
                    ],
                }
                : undefined,
            orderBy: { name: "asc" },
        });
    }
    async get(id) {
        const customerId = Number(id);
        return this.prisma.customer.findUnique({
            where: { id: customerId },
            include: { orders: { orderBy: { orderDate: "desc" } } },
        });
    }
    async create(body) {
        const parsed = validation_1.customerInputSchema.safeParse(body);
        if (!parsed.success) {
            return { error: parsed.error.issues[0]?.message ?? "Invalid customer" };
        }
        const created = await this.prisma.customer.create({
            data: {
                name: parsed.data.name,
                email: parsed.data.email || null,
                phone: parsed.data.phone,
            },
        });
        return created;
    }
    async update(id, body) {
        const customerId = Number(id);
        const parsed = validation_1.customerInputSchema.safeParse(body);
        if (!parsed.success) {
            return { error: parsed.error.issues[0]?.message ?? "Invalid customer" };
        }
        return this.prisma.customer.update({
            where: { id: customerId },
            data: {
                name: parsed.data.name,
                email: parsed.data.email || null,
                phone: parsed.data.phone,
            },
        });
    }
    async remove(id) {
        const customerId = Number(id);
        await this.prisma.customer.delete({ where: { id: customerId } });
        return { ok: true };
    }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "remove", null);
exports.CustomersController = CustomersController = __decorate([
    (0, common_1.Controller)("customers"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomersController);
