import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export type MyContext = {
  req: Request;
  res: Response;
  prisma: PrismaClient;
};

export const context = ({ req, res }: { req: Request; res: Response }) => ({
  req,
  res,
  prisma
});
