import { MiddlewareFn } from "type-graphql";
import { COOKIE_NAME, JWT_SECRET } from "../constants";
import { MyContext } from "../context";
import jwt from "jsonwebtoken";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const token = context.req.cookies[COOKIE_NAME];
  if (!token) throw new Error("not authenticated");

  const { id } = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  context.userId = id;
  return next();
};
