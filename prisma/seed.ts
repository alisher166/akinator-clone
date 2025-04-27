import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.guess.deleteMany();
  await prisma.question.deleteMany();
  await prisma.game.deleteMany();

  console.log('Database has been cleaned.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 