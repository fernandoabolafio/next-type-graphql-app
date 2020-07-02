import "reflect-metadata";
import { ApolloServer, gql } from "apollo-server-micro";
import { buildSchemaSync } from "type-graphql";
import { graphql } from "graphql";
import { RecipeResolver } from "../../backend/Recipe";
import { UserResolver } from "../../backend/User";
import { DataSource } from "apollo-datasource";
import WirecardClient from "../../backend/wirecard/client";

import neo4j, { Session } from "neo4j-driver";

let app = null;

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "password")
);
const session = driver.session();

const APP_NAME = "Appingo";

async function init() {
  if (app) {
    return;
  }

  try {
    const result = await session.run(
      "MATCH (app:App { name: $name }) RETURN app",
      {
        name: APP_NAME
      }
    );
    if (result.records[0]) {
      app = result.records[0].get(0).properties;
      return;
    }

    const wcClient = new WirecardClient();
    const newApp = await wcClient.postApp({
      name: APP_NAME,
      description:
        "This is a new description asidoisnaoindo asoin oiand onaso noasn oans",
      site: "https://epertin.com",
      redirectUri: "https://epertin.com"
    });

    console.log("got new app", newApp);

    const res = await session.run(
      `CREATE (a:App 
        { 
          id: $id, 
          name: $name, 
          description: $description, 
          website: $website, 
          redirectUri: $redirectUri, 
          secret: $secret,  
          accessToken: $accessToken,
          createdAt: $createdAt,
          updatedAt: $updatedAt
        }) RETURN a`,
      newApp
    );
    const sr = res.records[0];
    const nd = sr.get(0);
    if (nd) {
      app = nd;
    }
  } catch (e) {
    console.log("got error", e);
  }
}

class Database extends DataSource {
  session: Session | null = null;
  constructor(session: Session) {
    super();
    this.session = session;
  }
}

const schema = buildSchemaSync({
  resolvers: [RecipeResolver, UserResolver]
});

const server = new ApolloServer({
  schema,
  dataSources: () => ({
    database: new Database(session),
    paymentService: new WirecardClient()
  })
});

export const config = {
  api: {
    bodyParser: false
  }
};

const handler = async (req, res) => {
  await init();
  console.log(app);
  return server.createHandler({ path: "/api/graphql" })(req, res);
};

export default handler;
