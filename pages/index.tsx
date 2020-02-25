import Head from "next/head";
import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo";
import Layout, { LayoutColumn } from "@kiwicom/orbit-components/lib/Layout";
import Heading from "@kiwicom/orbit-components/lib/Heading";
import { Recipe } from "../api/Recipe";

interface HomeProps {
  recipe: Recipe;
}

interface FetcherProps extends HomeProps {}

const RECIPES_QUERY = gql`
  {
    recipes {
      id
      title
    }
  }
`;

interface RecipesData {
  recipes: Recipe[];
}

const Fetcher = (props: FetcherProps) => {
  const { loading, error, data } = useQuery<RecipesData>(RECIPES_QUERY, {
    pollInterval: 3000,
    ssr: false
  });
  // console.log(loading);
  // console.log(data);
  console.log(error);
  return (
    <span>
      {loading
        ? "loading"
        : data.recipes
        ? data.recipes.length + " recipes"
        : "idle"}
    </span>
  );
};

const Home = ({ recipe }: HomeProps) => (
  <>
    <Layout type="MMB">
      <Heading>{recipe && recipe.title}</Heading>
      <LayoutColumn>This is the main section.</LayoutColumn>
    </Layout>
    <Fetcher recipe={recipe} />

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
  </>
);

Home.getInitialProps = async ctx => {
  const client = ctx.apolloClient;
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
    return result.data || {};
  } catch (e) {
    console.log("got error", e);
  }
  return {};
  // return {};
};

export default Home;
