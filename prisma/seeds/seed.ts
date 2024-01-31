import { PrismaClient } from '@prisma/client';

import * as dotenv from 'dotenv';

const prisma = new PrismaClient();

async function execute() {
  const roles = [
    {
      name: 'User',
      type: 1,
    },
    {
      name: 'Admin',
      type: 2,
    },
  ];
  dotenv.config();
  console.log('Seeding...');

  for (let i = 0; i < roles.length; i++) {
    await prisma.role.create({ data: roles[i] });
  }
}

execute()
  .then(() => console.log('Seeds executed with success!'))
  .catch((e) => console.log('Error while seeding: ', e))
  .finally(async () => {
    await prisma.$disconnect();
  });
