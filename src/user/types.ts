import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
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
  name?: string | null;

  @Field(() => String, { nullable: true })
  bio?: string | null;

  @Field(() => String, { nullable: true })
  portfolioLink?: string | null;

  @Field(() => [Post], { nullable: true })
  posts?: Post[];

  @Field(() => [User], { nullable: true })
  followers?: User[];

  @Field(() => Int, { nullable: true })
  numFollowers?: number;

  @Field(() => [User], { nullable: true })
  following?: User[];

  @Field(() => Int, { nullable: true })
  numFollowing?: number;

  @Field(() => [Post], { nullable: true })
  likes?: Post[];

  @Field(() => [Post], { nullable: true })
  bookmarks?: Post[];

  @Field(() => String, { nullable: true })
  createdAt?: Date;

  @Field(() => String, { nullable: true })
  updatedAt?: Date;
}

@InputType()
class EditUserInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  portfolioLink?: string;
}

export { User, EditUserInput };
