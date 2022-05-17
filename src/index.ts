import "reflect-metadata";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { context } from "./context";
import { HelloResolver } from "./hello/resolver";
import { UserResolver } from "./user/resolver";
import { AuthResolver } from "./auth/resolver";
import { PostResolver } from "./post/resolver";

const main = async () => {
  const app = express();

  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "https://studio.apollographql.com",
        process.env.UI!,
        process.env.UI_PREVIEW!
      ],
      credentials: true
    })
  );
  app.use(cookieParser());

  const httpServer = http.createServer(app);
  const schema = await buildSchema({
    resolvers: [HelloResolver, AuthResolver, UserResolver, PostResolver]
  });

  const server = new ApolloServer({
    schema,
    context,
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  });
  await server.start();
  server.applyMiddleware({ app, cors: false });

  await new Promise<void>(resolve =>
    httpServer.listen({ port: process.env.PORT ?? 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
};

main().catch(err => {
  console.error(err);
});
