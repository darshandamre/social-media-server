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

@InputType()
class UserRegisterInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field()
  password: string;
}

@InputType()
class UserLoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

export { User, FieldError, UserResponse, UserLoginInput, UserRegisterInput };
