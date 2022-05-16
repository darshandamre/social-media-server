import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"]
});

export type MyContext = {
  req: Request & {
    userId?: number;
  };
  res: Response;
  prisma: PrismaClient;
};

export const context = ({ req, res }: { req: Request; res: Response }) => ({
  req,
  res,
  prisma
});
