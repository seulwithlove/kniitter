import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient();

const projects = [
  {
    id: 1,
    content: "겨울 스웨터 뜨기",
    isCompleted: false,
  },
  {
    id: 2,
    content: "목도리 만들기",
    isCompleted: true,
  },
  {
    id: 3,
    content: "니트 양말 한 켤레",
    isCompleted: true,
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  // 기존 데이터 삭제
  console.log("🧹 Cleaning existing projects...");
  await prisma.project.deleteMany();

  // 새 데이터 생성
  console.log("📦 Creating projects...");
  const result = await prisma.project.createMany({
    data: projects,
  });

  console.log(`✅ Created ${result.count} projects`);
  console.log("🎉 Seed completed!");
}

main()
  .catch(async (e) => {
    console.error("PrismaError>>", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.error("Prisma Closed!");
  });
