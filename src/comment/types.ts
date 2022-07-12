import { Field, ObjectType } from "type-graphql";
import { Post } from "../post/types";
import { User } from "../user/types";

@ObjectType()
export class Comment {
  @Field()
  id: number;

  @Field()
  content: string;

  @Field()
  postId: number;

  @Field(() => Post, { nullable: true })
  post?: Post;

  @Field()
  authorId: number;

  @Field(() => User, { nullable: true })
  author?: User;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}
