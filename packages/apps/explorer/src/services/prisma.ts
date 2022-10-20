/* eslint-disable vars-on-top */
/* eslint-disable no-var */

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient;
}

if (!global.prisma) {
  global.prisma = new PrismaClient();
}
const prisma = global.prisma;

export default prisma;
