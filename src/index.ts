import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./hello/resolver";
import { UserResolver } from "./user/resolvers";
import { context } from "./context";

const main = async () => {
  const app = express();
  const httpServer = http.createServer(app);
  const schema = await buildSchema({
    resolvers: [HelloResolver, UserResolver]
  });
  const server = new ApolloServer({
    schema,
    context,
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  });
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>(resolve =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
};

main().catch(err => {
  console.error(err);
});
