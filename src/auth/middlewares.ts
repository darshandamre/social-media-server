import { MiddlewareFn } from "type-graphql";
import { COOKIE_NAME, JWT_SECRET } from "../constants";
import { MyContext } from "../context";
import jwt from "jsonwebtoken";

export const isAuth: MiddlewareFn<MyContext> = ({ context: { req } }, next) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) throw new Error("not authenticated");

  const { id } = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  req.userId = id;
  return next();
};
