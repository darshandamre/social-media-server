import { Field, InputType, ObjectType } from "type-graphql";
import { User } from "../user/types";

@InputType()
class RegisterInput {
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
class LoginInput {
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
class AuthResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

declare module "jsonwebtoken" {
  interface JwtPayload {
    id: number;
  }
}

export { RegisterInput, LoginInput, AuthResponse };
