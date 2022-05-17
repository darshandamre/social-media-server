import jwt from "jsonwebtoken";
import { Ctx, Query, Resolver } from "type-graphql";
import { COOKIE_NAME, JWT_SECRET } from "../constants";
import { MyContext } from "../context";
import { User } from "./types";

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, prisma }: MyContext): Promise<User | null> {
    const token = req.cookies[COOKIE_NAME];
    if (!token) return null;

    const { id } = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    return await prisma.user.findUnique({ where: { id } });
  }
}
