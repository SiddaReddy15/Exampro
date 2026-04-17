import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.student.createMany({
    data: [
      {
        name: "Rahul Sharma",
        email: "rahul@example.com",
        password: "password123",
        role: "STUDENT",
      },
      {
        name: "Ananya Reddy",
        email: "ananya@example.com",
        password: "password123",
        role: "STUDENT",
      },
      {
        name: "Kiran Kumar",
        email: "kiran@example.com",
        password: "password123",
        role: "STUDENT",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Students seeded successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
