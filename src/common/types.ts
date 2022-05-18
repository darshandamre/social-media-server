import { Field, ObjectType } from "type-graphql";
import { User } from "../user/types";

@ObjectType()
class FieldError {
  @Field({ nullable: true })
  field?: string;

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

export { FieldError, UserResponse };
