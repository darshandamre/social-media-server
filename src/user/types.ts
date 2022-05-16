import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Post } from "../post/types";

@ObjectType()
class User {
  @Field(() => ID)
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  firstName: string | null;

  @Field(() => String, { nullable: true })
  lastName: string | null;

  @Field(() => [Post], { nullable: true })
  posts?: Post[];

  // followers : Follow[]
  // following : Follow[]
  // likes     : Like[]
  // comments  : Comment[]
  // bookmarks : Bookmark[]

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}

export { User };
