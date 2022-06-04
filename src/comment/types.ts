import { Field, ID, ObjectType } from "type-graphql";
import { Post } from "../post/types";
import { User } from "../user/types";

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field(() => ID)
  postId: String;

  @Field(() => Post, { nullable: true })
  post?: Post;

  @Field(() => ID)
  authorId: string;

  @Field(() => User, { nullable: true })
  author?: User;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}
