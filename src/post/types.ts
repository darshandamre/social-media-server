import { Field, ID, Int, ObjectType } from "type-graphql";
import { User } from "../user/types";

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field(() => User, { nullable: true })
  author?: User;

  @Field(() => ID)
  authorId: string;

  @Field(() => [User], { nullable: true })
  likedBy?: User[];

  @Field(() => Int)
  likes?: number;

  @Field()
  isLikedByMe?: boolean;

  @Field()
  isBookmarkedByMe?: boolean;

  // comments     Comment[]

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}
