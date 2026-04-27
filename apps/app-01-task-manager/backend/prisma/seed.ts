import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({where:{email:'admin@app-01.local'},update:{},create:{email:'admin@app-01.local',password:'$2b$10$Egdt7x4N8jzV3uO4hLQX9e6Uenf9x5Hj4JfBILowKIiMzFxLpy0l6',role:'admin'}});
}
main().finally(()=>prisma.$disconnect());
