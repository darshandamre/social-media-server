import { Field, ID, ObjectType } from "type-graphql";
import { Post } from "../post/types";

@ObjectType()
export class User {
  @Field(type => ID)
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  // @Field()
  // password: string;

  @Field(type => [Post])
  posts: Post[];

  // followers : Follow[]
  // following : Follow[]
  // likes     : Like[]
  // comments  : Comment[]
  // bookmarks : Bookmark[]

  @Field(type => String)
  createdAt: Date;

  @Field(type => String)
  updatedAt: Date;
}
