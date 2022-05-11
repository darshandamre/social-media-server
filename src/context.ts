import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type MyContext = {
  prisma: PrismaClient;
};

export const context: MyContext = {
  prisma
};
