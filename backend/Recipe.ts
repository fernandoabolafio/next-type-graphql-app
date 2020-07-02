import "reflect-metadata";
import { Field, ObjectType, ID, Resolver, Query, Arg } from "type-graphql";

@ObjectType("recipe")
export class Recipe {
  @Field(type => ID)
  id: string;

  @Field(type => String)
  title: string;

  @Field(type => Date)
  creationDate: Date;

  @Field(type => [String])
  ingredients: string[];
}

const example = new Recipe();

example.id = "test_recipe";
example.title = "coxinha";

@Resolver(Recipe)
export class RecipeResolver {
  private recipesCollection: Recipe[] = [example];

  @Query(returns => Recipe)
  async recipe(@Arg("id", { nullable: true }) id?: string) {
    const recipe = this.recipesCollection.find(r => r.id === id);
    if (recipe) return recipe;
    throw new Error("recipe not found");
  }

  @Query(returns => [Recipe])
  async recipes() {
    return await this.recipesCollection;
  }
}
