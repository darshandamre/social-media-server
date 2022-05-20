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
import { MyContext } from "../context";
import { Post } from "./types";

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => Boolean)
  @UseMiddleware(isAuth)
  async isLikedByMe(
    @Root() post: Post,
    @Ctx() { prisma, userId }: MyContext
  ): Promise<boolean> {
    const like = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: post.id,
          userId: userId!
        }
      }
    });

    return !!like;
  }

  @FieldResolver(() => Boolean)
  @UseMiddleware(isAuth)
  async isBookmarkedByMe(
    @Root() post: Post,
    @Ctx() { prisma, userId }: MyContext
  ): Promise<boolean> {
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: userId!,
          postId: post.id
        }
      }
    });

    return !!bookmark;
  }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg("id") id: string,
    @Ctx() { prisma }: MyContext
  ): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: true
      }
    });
  }

  @Query(() => [Post])
  async posts(@Ctx() { prisma }: MyContext): Promise<Post[]> {
    return prisma.post.findMany({
      include: {
        author: true
      },
      take: 30
    });
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
    @Arg("id") id: string,
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
    @Arg("id") id: string,
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
    @Arg("id") id: string,
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
    @Arg("id") id: string,
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
    @Arg("id") id: string,
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
    @Arg("id") id: string,
    @Ctx() { prisma, userId }: MyContext
  ): Promise<boolean> {
    await prisma.bookmark.delete({
      where: { userId_postId: { postId: id, userId: userId! } }
    });
    return true;
  }

  @Query(() => [Post])
  @UseMiddleware(isAuth)
  async userFeed(@Ctx() { prisma, userId }: MyContext): Promise<Post[]> {
    const follows = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        user: {
          include: {
            posts: true
          }
        }
      }
    });

    return follows.reduce<Post[]>(
      (allPosts, { user: { posts, ...user } }) => [
        ...allPosts,
        ...posts.map(post => ({ ...post, author: user }))
      ],
      []
    );
  }
}
