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
import { MyContext } from "../context";
import { nanoid } from "../utils/nanoid";
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
    @Arg("id", () => Int) id: number,
    @Ctx() { prisma }: MyContext
  ): Promise<Post | null> {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        _count: {
          select: {
            likedBy: true
          }
        }
      }
    });
    if (!post) return null;
    return { ...post, likes: post?._count.likedBy };
  }

  @Query(() => [Post])
  async posts(@Ctx() { prisma }: MyContext): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        _count: {
          select: {
            likedBy: true
          }
        }
      },
      take: 20
    });
    return posts.map(post => ({ ...post, likes: post._count.likedBy }));
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("content") content: string,
    @Ctx() { userId, prisma }: MyContext
  ): Promise<Post> {
    // TODO: add nanoid here
    const publicId = nanoid();
    return prisma.post.create({
      data: {
        publicId,
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

  @Query(() => [Post])
  @UseMiddleware(isAuth)
  async userFeed(@Ctx() { prisma, userId }: MyContext): Promise<Post[]> {
    const follows = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        user: {
          include: {
            posts: {
              include: {
                _count: {
                  select: {
                    likedBy: true
                  }
                }
              }
            }
          }
        }
      },
      take: 20
    });

    return follows.reduce<Post[]>(
      (allPosts, { user: { posts, ...user } }) => [
        ...allPosts,
        ...posts.map(post => ({
          ...post,
          likes: post._count.likedBy,
          author: user
        }))
      ],
      []
    );
  }

  @Query(() => [Post], { nullable: true })
  @UseMiddleware(isAuth)
  async likedPosts(
    @Ctx() { prisma, userId }: MyContext
  ): Promise<Post[] | undefined> {
    const user = await prisma.user.findUnique({
      select: {
        likes: {
          select: {
            post: {
              include: {
                author: true,
                _count: {
                  select: {
                    likedBy: true
                  }
                }
              }
            }
          }
        }
      },
      where: { id: userId }
    });

    return user?.likes.map(({ post }) => ({
      ...post,
      likes: post._count.likedBy
    }));
  }

  @Query(() => [Post], { nullable: true })
  @UseMiddleware(isAuth)
  async bookmarkedPosts(
    @Ctx() { prisma, userId }: MyContext
  ): Promise<Post[] | undefined> {
    const user = await prisma.user.findUnique({
      select: {
        bookmarks: {
          select: {
            post: {
              include: {
                author: true,
                _count: {
                  select: {
                    likedBy: true
                  }
                }
              }
            }
          }
        }
      },
      where: { id: userId }
    });

    return user?.bookmarks.map(({ post }) => ({
      ...post,
      likes: post._count.likedBy
    }));
  }
}
