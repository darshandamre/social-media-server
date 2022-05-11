import { Prisma } from "@prisma/client";
import argon2 from "argon2";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from "../context";
import { UserRegister, UserRegisterInput, UserResponse } from "./types";
import { validateRegister } from "./validate";

@Resolver()
export class UserResolver {
  @Mutation(returns => UserResponse)
  async register(
    @Arg("input") input: UserRegisterInput,
    @Ctx() { prisma }: MyContext
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
