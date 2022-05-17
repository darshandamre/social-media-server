import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from "type-graphql";
import { isAuth } from "../auth/middlewares";
import { MyContext } from "../context";
import { Post } from "./types";

@Resolver(Post)
export class PostResolver {
  @Query(() => Post, { nullable: true })
  async post(
    @Arg("id", () => Int) id: number,
    @Ctx() { prisma }: MyContext
  ): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { id }
    });
  }

  @Query(() => [Post])
  async posts(@Ctx() { prisma }: MyContext): Promise<Post[]> {
    return prisma.post.findMany();
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("content") content: string,
    @Ctx() { userId, prisma }: MyContext
  ): Promise<Post> {
    return prisma.post.create({
      data: {
        content,
        authorId: userId!
      }
    });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { prisma, userId }: MyContext
  ): Promise<boolean> {
    const { count } = await prisma.post.deleteMany({
      where: {
        id,
        authorId: userId
      }
    });

    return !!count;
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async editPost(
    @Arg("id", () => Int) id: number,
    @Arg("content") content: string,
    @Ctx() { prisma, userId }: MyContext
  ): Promise<Post | null> {
    const [{ count }, updatedPost] = await prisma.$transaction([
      prisma.post.updateMany({
        where: { id, authorId: userId },
        data: { content }
      }),
      prisma.post.findUnique({ where: { id } })
    ]);

    if (count === 0) return null;

    return updatedPost;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async like(
    @Arg("id", () => Int) id: number,
    @Ctx() { prisma, userId }: MyContext
  ): Promise<boolean> {
    await prisma.like.create({
      data: { postId: id, userId: userId! }
    });
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async dislike(
    @Arg("id", () => Int) id: number,
    @Ctx() { prisma, userId }: MyContext
  ): Promise<boolean> {
    await prisma.like.delete({
      where: { postId_userId: { postId: id, userId: userId! } }
    });
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async addBookmark(
    @Arg("id", () => Int) id: number,
    @Ctx() { prisma, userId }: MyContext
  ): Promise<boolean> {
    await prisma.bookmark.create({
      data: { postId: id, userId: userId! }
    });
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async removeBookmark(
    @Arg("id", () => Int) id: number,
    @Ctx() { prisma, userId }: MyContext
  ): Promise<boolean> {
    await prisma.bookmark.delete({
      where: { userId_postId: { postId: id, userId: userId! } }
    });
    return true;
  }
}
