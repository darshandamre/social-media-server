import { Field, ID, ObjectType } from "type-graphql";
import { User } from "../user/types";

@ObjectType()
export class Post {
  @Field(() => ID)
  id: number;

  @Field()
  content: string;

  @Field(() => User, { nullable: true })
  author?: User;

  @Field(() => ID)
  authorId: number;

  // comments     Comment[]
  // likedBy      Like[]
  // bookmarkedBy Bookmark[]

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}
