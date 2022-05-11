import { Field, ID, ObjectType } from "type-graphql";
import { User } from "../user/types";

@ObjectType()
export class Post {
  @Field(type => ID)
  id: number;

  @Field()
  content: string;

  @Field(type => User)
  author: User;

  @Field(type => ID)
  authorId: number;

  // comments     Comment[]
  // likedBy      Like[]
  // bookmarkedBy Bookmark[]

  @Field(type => String)
  createdAt: Date;

  @Field(type => String)
  updatedAt: Date;
}
