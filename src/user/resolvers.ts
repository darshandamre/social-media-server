import { Prisma } from "@prisma/client";
import argon2 from "argon2";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from "../context";
import { UserRegisterInput, UserResponse } from "./types";
import { validateRegister } from "./validate";
import jwt from "jsonwebtoken";
import { COOKIE_NAME, JWT_SECRET } from "../constants";

@Resolver()
export class UserResolver {
  @Mutation(returns => UserResponse)
  async register(
    @Arg("input") input: UserRegisterInput,
    @Ctx() { prisma, res }: MyContext
  ): Promise<UserResponse> {
    try {
      const errors = await validateRegister(input);
      if (errors) {
        return { errors };
      }

      const hashedPassword = await argon2.hash(input.password);

      const user = await prisma.user.create({
        data: {
          ...input,
          password: hashedPassword
        }
      });

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username
        },
        JWT_SECRET
      );

      res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "none", // change this after hosting
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        secure: true
      });

      return {
        user: {
          ...user,
          posts: []
        }
      };
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002" &&
        err.meta?.target instanceof Array &&
        typeof err.meta.target[0] === "string"
      ) {
        const field = err.meta.target[0];

        return {
          errors: [
            {
              field,
              message: `${field} already exists`
            }
          ]
        };
      }

      throw err;
    }
  }
}
