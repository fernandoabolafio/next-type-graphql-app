import "reflect-metadata";
import { ApolloServer, gql } from "apollo-server-micro";
import { buildSchema, buildSchemaSync } from "type-graphql";
import { graphql } from "graphql";
import { RecipeResolver } from "../../api/Recipe";

const schema = buildSchemaSync({
  resolvers: [RecipeResolver]
});
const server = new ApolloServer({
  schema
});

export const config = {
  api: {
    bodyParser: false
  }
};

const handler = server.createHandler({ path: "/api/graphql" });

export default handler;
