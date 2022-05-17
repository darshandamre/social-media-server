import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../auth/middlewares";
import { MyContext } from "../context";
import { Post } from "./types";

@Resolver(Post)
export class PostResolver {
  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("content") content: string,
    @Ctx() { req, prisma }: MyContext
  ): Promise<Post> {
    return prisma.post.create({
      data: {
        content,
        authorId: req.userId!
      }
    });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { prisma, req }: MyContext
  ): Promise<boolean> {
    const { count } = await prisma.post.deleteMany({
      where: {
        id,
        authorId: req.userId
      }
    });

    return !!count;
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async editPost(
    @Arg("id", () => Int) id: number,
    @Arg("content") content: string,
    @Ctx() { prisma, req }: MyContext
  ): Promise<Post | null> {
    const [{ count }, updatedPost] = await prisma.$transaction([
      prisma.post.updateMany({
        where: { id, authorId: req.userId },
        data: { content }
      }),
      prisma.post.findUnique({ where: { id } })
    ]);

    if (count === 0) return null;

    return updatedPost;
  }
}
