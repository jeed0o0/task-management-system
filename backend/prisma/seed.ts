import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ✅ استخدم upsert بدل create (إذا موجود يحدث، إذا مو موجود ينشئ)
  const admin = await prisma.user.upsert({
    where: { id: "admin-1" },
    update: {},
    create: {
      id: "admin-1",
      email: "admin@taskmanager.com",
      username: "admin",
      name: "Admin User",
      role: "ADMIN",
    },
  });

  const manager = await prisma.user.upsert({
    where: { id: "manager-1" },
    update: {},
    create: {
      id: "manager-1",
      email: "manager@taskmanager.com",
      username: "manager",
      name: "Manager User",
      role: "MANAGER",
    },
  });

  const user = await prisma.user.upsert({
    where: { id: "user-1" },
    update: {},
    create: {
      id: "user-1",
      email: "user@taskmanager.com",
      username: "user",
      name: "Regular User",
      role: "USER",
    },
  });

  // Tasks
  await prisma.task.upsert({
    where: { id: "task-1" },
    update: {},
    create: {
      id: "task-1",
      title: "Setup Project",
      description: "Initial project setup and configuration",
      status: "DONE",
      priority: "HIGH",
      creatorId: admin.id,
      assigneeId: user.id,
    },
  });

  await prisma.task.upsert({
    where: { id: "task-2" },
    update: {},
    create: {
      id: "task-2",
      title: "Design Database",
      description: "Design PostgreSQL database schema",
      status: "IN_PROGRESS",
      priority: "HIGH",
      creatorId: admin.id,
      assigneeId: manager.id,
    },
  });

  await prisma.task.upsert({
    where: { id: "task-3" },
    update: {},
    create: {
      id: "task-3",
      title: "Implement Auth",
      description: "Implement Keycloak authentication",
      status: "PENDING",
      priority: "MEDIUM",
      creatorId: manager.id,
      assigneeId: user.id,
    },
  });

  console.log("✅ Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
