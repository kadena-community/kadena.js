import { prismaClient } from './db/prismaClient';

async function main() {
  await prismaClient.block
    .findMany({
      take: 1,
      orderBy: {
        id: 'desc',
      },
    })
    .then((x) => console.log(x));
}
main()
  .catch(console.error)
  .finally(() => prismaClient.$disconnect());
