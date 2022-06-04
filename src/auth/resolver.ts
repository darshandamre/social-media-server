import { Prisma } from "@prisma/client";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { COOKIE_NAME, COOKIE_OPTIONS, JWT_SECRET } from "../constants";
import { MyContext } from "../context";
import { validateLogin, validateRegister } from "./validate";
import { LoginInput, RegisterInput } from "./types";
import { UserResponse } from "../common/types";

@Resolver()
export class AuthResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("input") input: RegisterInput,
    @Ctx() context: MyContext
  ): Promise<UserResponse> {
    const { prisma, res } = context;
    try {
      const { castValues, errors } = await validateRegister(input);
      if (errors) {
        return { errors };
      }

      const hashedPassword = await argon2.hash(castValues.password);

      const user = await prisma.user.create({
        data: {
          ...castValues,
          password: hashedPassword
        }
      });

      const token = jwt.sign({ id: user.id }, JWT_SECRET);
      res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

      context.userId = user.id;
      return { user };
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

  @Mutation(() => UserResponse)
  async login(
    @Arg("input") input: LoginInput,
    @Ctx() context: MyContext
  ): Promise<UserResponse> {
    const { prisma, res } = context;

    const { castValues, errors } = await validateLogin(input);
    if (errors) {
      return { errors };
    }
    const user = await prisma.user.findUnique({
      where: {
        email: castValues.email
      }
    });

    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "user does not exists"
          }
        ]
      };
    }

    const isValid = await argon2.verify(user.password, castValues.password);

    if (!isValid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password"
          }
        ]
      };
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    context.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { res }: MyContext): Boolean {
    res.clearCookie(COOKIE_NAME, {
      ...COOKIE_OPTIONS,
      maxAge: 0
    });
    return true;
  }
}
