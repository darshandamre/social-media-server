import { customAlphabet } from "nanoid";

export const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyz",
  12
);
