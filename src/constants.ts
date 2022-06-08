import { CookieOptions } from "express";

export const COOKIE_NAME = "xid";
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  secure: true
};
