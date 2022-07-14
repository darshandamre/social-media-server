import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { HelloResolver } from "./hello/resolver";
import { UserResolver } from "./user/resolver";
import { AuthResolver } from "./auth/resolver";
import { PostResolver } from "./post/resolver";
import { PrismaClient } from "@prisma/client";
import { CommentResolver } from "./comment/resolver";

const main = async () => {
  const app = express();

  app.set("trust proxy", true);
  app.use(
    cors({
      origin: [process.env.UI!, process.env.UI_PREVIEW!],
      credentials: true
    })
  );
  app.use(cookieParser());

  const httpServer = http.createServer(app);
  const schema = await buildSchema({
    resolvers: [
      HelloResolver,
      AuthResolver,
      UserResolver,
      PostResolver,
      CommentResolver
    ]
  });

  const prisma = new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query"
      },
      {
        emit: "stdout",
        level: "error"
      },
      {
        emit: "stdout",
        level: "info"
      },
      {
        emit: "stdout",
        level: "warn"
      }
    ]
  });

  // prisma.$on("query", e => {
  //   console.log("Query: " + e.query);
  //   // console.log("Params: " + e.params);
  //   console.log("Duration: " + e.duration + "ms");
  // });

  const server = new ApolloServer({
    schema,
    context: ({ req, res }: { req: Request; res: Response }) => ({
      req,
      res,
      prisma
    }),
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
