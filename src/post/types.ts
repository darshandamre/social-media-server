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

  @Field(() => [User], { nullable: true })
  likedBy?: User[];

  // comments     Comment[]

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}
