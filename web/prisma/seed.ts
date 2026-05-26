import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  PrismaClient,
} from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.category.deleteMany();

  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Men's Wear" } }),
    prisma.category.create({ data: { name: "Women's Wear" } }),
    prisma.category.create({ data: { name: "Accessories" } }),
  ]);

  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "555-1111",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "555-2222",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Mark Chan",
        email: "mark.chan@example.com",
        phone: "555-3333",
      },
    }),
  ]);

  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        name: "Alice Johnson",
        email: "alice.j@example.com",
        phone: "555-4444",
        role: "Cashier",
      },
    }),
    prisma.employee.create({
      data: {
        name: "Bob Lee",
        email: "bob.lee@example.com",
        phone: "555-5555",
        role: "Sales",
      },
    }),
  ]);

  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Blue Jeans",
        size: "M",
        colour: "Blue",
        brand: "Levis",
        price: 59.99,
        stockQty: 100,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Red Dress",
        size: "S",
        colour: "Red",
        brand: "Zara",
        price: 89.5,
        stockQty: 50,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Leather Belt",
        size: "L",
        colour: "Brown",
        brand: "Fossil",
        price: 19.99,
        stockQty: 200,
        categoryId: categories[2].id,
      },
    }),
  ]);

  const completedOrder = await prisma.order.create({
    data: {
      orderDate: new Date(Date.now() - 86_400_000),
      totalAmount: 79.98,
      status: OrderStatus.COMPLETED,
      customerId: customers[0].id,
      employeeId: employees[0].id,
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            unitPrice: 59.99,
          },
          {
            productId: products[2].id,
            quantity: 1,
            unitPrice: 19.99,
          },
        ],
      },
      payments: {
        create: {
          method: PaymentMethod.CREDIT,
          amount: 79.98,
          status: PaymentStatus.PAID,
        },
      },
    },
  });

  const pendingOrder = await prisma.order.create({
    data: {
      orderDate: new Date(),
      totalAmount: 89.5,
      status: OrderStatus.PENDING,
      customerId: customers[1].id,
      employeeId: employees[1].id,
      items: {
        create: [
          {
            productId: products[1].id,
            quantity: 1,
            unitPrice: 89.5,
          },
        ],
      },
      payments: {
        create: {
          method: PaymentMethod.CASH,
          amount: 89.5,
          status: PaymentStatus.PENDING,
        },
      },
    },
  });

  console.log("Seed complete:", {
    categories: categories.length,
    customers: customers.length,
    employees: employees.length,
    products: products.length,
    orders: [completedOrder.id, pendingOrder.id],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
