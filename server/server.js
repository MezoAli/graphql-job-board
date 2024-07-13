import cors from "cors";
import express from "express";
import { authMiddleware, handleLogin } from "./auth.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import fs from "node:fs/promises";
import { resolvers } from "./graphql/resolvers.js";
import { getUser } from "./db/users.js";
import { createCompanyLoader } from "./db/companies.js";

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post("/login", handleLogin);

const getContext = async ({ req }) => {
  const companyLoader = createCompanyLoader();
  const context = { companyLoader };
  if (req.auth) {
    const user = await getUser(req?.auth?.sub);
    context.user = user;
  }
  return context;
};

const typeDefs = await fs.readFile("./graphql/schema.graphql", "utf-8");

const server = new ApolloServer({ typeDefs, resolvers });
await server.start();
app.use("/graphql", apolloMiddleware(server, { context: getContext }));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server running on http://localhost:${PORT}/graphql`);
});
