import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Post } from "../post/types";

@ObjectType()
class User {
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

@InputType()
class UserRegisterInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  password: string;
}

@ObjectType()
export class UserRegister {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

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
  @Field(type => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(type => User, { nullable: true })
  user?: User;
}

export { User, UserRegisterInput, FieldError, UserResponse };
