import jwt from "jsonwebtoken";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware
} from "type-graphql";
import { isAuth } from "../auth/middlewares";
import { UserResponse } from "../common/types";
import { COOKIE_NAME, JWT_SECRET } from "../constants";
import { MyContext } from "../context";
import { EditUserInput, User } from "./types";
import { validateUserEdit } from "./validate";

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { userId }: MyContext) {
    return userId === user.id ? user.email : "";
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, prisma }: MyContext): Promise<User | null> {
    const token = req.cookies[COOKIE_NAME];
    if (!token) return null;

    const { id } = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    return await prisma.user.findUnique({ where: { id } });
  }

  @Query(() => User, { nullable: true })
  async user(
    @Arg("username") username: string,
    @Ctx() { prisma }: MyContext
  ): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        posts: {
          include: {
            _count: {
              select: {
                likedBy: true
              }
            }
          }
        },
        _count: {
          select: {
            followers: true,
            following: true
          }
        }
      }
    });

    if (!user) return null;

    return {
      ...user,
      numFollowers: user?._count.followers,
      numFollowing: user?._count.following,
      posts: user.posts.map(post => ({ ...post, likes: post._count.likedBy }))
    };
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(isAuth)
  async editUser(
    @Arg("input") input: EditUserInput,
    @Ctx() { prisma, userId }: MyContext
  ): Promise<UserResponse> {
    const { castValues, errors } = await validateUserEdit(input);

    if (errors) {
      return { errors };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: castValues
    });

    return { user: updatedUser };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async follow(
    @Arg("followId") followId: string,
    @Ctx() { userId, prisma }: MyContext
  ): Promise<boolean> {
    await prisma.follow.create({
      data: { followerId: userId!, userId: followId }
    });

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async unfollow(
    @Arg("unfollowId") unfollowId: string,
    @Ctx() { prisma, userId }: MyContext
  ): Promise<boolean> {
    await prisma.follow.delete({
      where: {
        userId_followerId: {
          followerId: userId!,
          userId: unfollowId
        }
      }
    });

    return true;
  }
}
