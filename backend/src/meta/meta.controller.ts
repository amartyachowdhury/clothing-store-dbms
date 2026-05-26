import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller()
export class MetaController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("categories")
  async categories() {
    return this.prisma.category.findMany({ orderBy: { name: "asc" } });
  }

  @Get("employees")
  async employees() {
    return this.prisma.employee.findMany({ orderBy: { name: "asc" } });
  }
}

