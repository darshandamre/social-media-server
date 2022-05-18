import { Field, InputType } from "type-graphql";

@InputType()
class RegisterInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  name?: string;

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

declare module "jsonwebtoken" {
  interface JwtPayload {
    id: string;
  }
}

export { RegisterInput, LoginInput };
