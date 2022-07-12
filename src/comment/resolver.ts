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
import { Comment } from "./types";

@Resolver(Comment)
export class CommentResolver {
  @Query(() => [Comment])
  async comments(
    @Arg("postId", () => Int) postId: number,
    @Ctx() { prisma }: MyContext
  ): Promise<Comment[]> {
    return await prisma.comment.findMany({
      where: { postId },
      include: { author: true }
    });
  }

  @Mutation(() => Comment)
  @UseMiddleware(isAuth)
  async createComment(
    @Arg("postId", () => Int) postId: number,
    @Arg("content") content: string,
    @Ctx() { prisma, userId }: MyContext
  ): Promise<Comment> {
    return await prisma.comment.create({
      data: { content, authorId: userId!, postId }
    });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteComment(
    @Arg("id", () => Int) id: number,
    @Ctx() { prisma, userId }: MyContext
  ): Promise<boolean> {
    const { count } = await prisma.comment.deleteMany({
      where: {
        id,
        authorId: userId
      }
    });

    return !!count;
  }

  @Mutation(() => Comment, { nullable: true })
  @UseMiddleware(isAuth)
  async editComment(
    @Arg("id", () => Int) id: number,
    @Arg("content") content: string,
    @Ctx() { prisma, userId }: MyContext
  ): Promise<Comment | null> {
    const [{ count }, updatedComment] = await prisma.$transaction([
      prisma.comment.updateMany({
        where: { id, authorId: userId },
        data: { content }
      }),
      prisma.comment.findUnique({ where: { id } })
    ]);

    if (count === 0) return null;

    return updatedComment;
  }
}
