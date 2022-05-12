import { CookieOptions } from "express";

export const COOKIE_NAME = "xid";
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: "none", // change this after hosting
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  secure: true
};
