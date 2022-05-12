import { Field, ID, InputType, ObjectType } from "type-graphql";

@ObjectType()
class User {
  @Field(type => ID)
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field(type => String, { nullable: true })
  firstName: string | null;

  @Field(type => String, { nullable: true })
  lastName: string | null;

  // @Field()
  // password: string;

  // @Field(type => [Post])
  // posts: Post[];

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
  @Field(type => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(type => User, { nullable: true })
  user?: User;
}

export { User, FieldError, UserResponse, UserLoginInput, UserRegisterInput };
