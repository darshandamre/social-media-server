import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export type MyContext = {
  req: Request;
  res: Response;
  prisma: PrismaClient;
  userId?: string;
};
