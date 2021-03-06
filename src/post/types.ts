import { Field, Int, ObjectType } from "type-graphql";
import { Comment } from "../comment/types";
import { User } from "../user/types";

@ObjectType()
export class Post {
  @Field()
  id: number;

  @Field()
  publicId: string;

  @Field()
  content: string;

  @Field(() => User, { nullable: true })
  author?: User;

  @Field()
  authorId: number;

  @Field(() => [User], { nullable: true })
  likedBy?: User[];

  @Field(() => Int)
  likes?: number;

  @Field()
  isLikedByMe?: boolean;

  @Field()
  isBookmarkedByMe?: boolean;

  @Field(() => Comment, { nullable: true })
  comments?: Comment[];

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}
