import { Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResolver {
  @Query(_ => String)
  async hello() {
    return "hello graphql";
  }
}
