import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware
} from "type-graphql";
import { isAuth } from "../auth/middlewares";
import { UserResponse } from "../common/types";
import { MyContext } from "../context";
import { EditUserInput, User } from "./types";
import { validateUserEdit } from "./validate";

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { userId }: MyContext) {
    return userId === user.id ? user.email : "";
  }

  @FieldResolver(() => Boolean)
  @UseMiddleware(isAuth)
  async amIFollowingThem(
    @Root() user: User,
    @Ctx() { prisma, userId: loggedInUserId }: MyContext
  ): Promise<boolean> {
    if (loggedInUserId === user.id) return false;

    return !!(await prisma.follow.findUnique({
      where: {
        userId_followerId: {
          userId: user.id,
          followerId: loggedInUserId!
        }
      }
    }));
  }

  @FieldResolver(() => Boolean)
  @UseMiddleware(isAuth)
  async isMyFollower(
    @Root() user: User,
    @Ctx() { prisma, userId: loggedInUserId }: MyContext
  ): Promise<boolean> {
    if (loggedInUserId === user.id) return false;

    return !!(await prisma.follow.findUnique({
      where: {
        userId_followerId: {
          userId: loggedInUserId!,
          followerId: user.id
        }
      }
    }));
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async me(@Ctx() { userId, prisma }: MyContext): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id: userId } });
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
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 20
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
      posts: user.posts.map(post => ({
        ...post,
        likes: post._count.likedBy,
        author: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email
        }
      }))
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
    @Arg("followId", () => Int) followId: number,
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
    @Arg("unfollowId", () => Int) unfollowId: number,
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
