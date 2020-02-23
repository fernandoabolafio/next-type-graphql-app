import Head from "next/head";
import fetch from "node-fetch";
import React from "react";
import ApolloClient, { gql } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import Layout, { LayoutColumn } from "@kiwicom/orbit-components/lib/Layout";
import Heading from "@kiwicom/orbit-components/lib/Heading";

const client = new ApolloClient({
  uri: "http://127.0.0.1:3000/api/graphql",
  fetch: fetch
});

const Home = ({ recipe }) => (
  <ApolloProvider client={client}>
    <Layout type="MMB">
      <Heading>{recipe && recipe.title}</Heading>
      <LayoutColumn>This is the main section.</LayoutColumn>
    </Layout>

    <style jsx global>{`
      html,
      body {
        padding: 0;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
          Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      }

      * {
        box-sizing: border-box;
      }
    `}</style>
  </ApolloProvider>
);

Home.getInitialProps = async () => {
  try {
    const result = await client.query({
      query: gql`
        {
          recipe(id: "test_recipe") {
            title
          }
        }
      `
    });
    return result.data;
  } catch (e) {
    console.log("got error", e);
  }
  return {};
};

export default Home;
