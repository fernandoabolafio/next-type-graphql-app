import "reflect-metadata";
import {
  Field,
  ObjectType,
  ID,
  Resolver,
  Query,
  Arg,
  Mutation
} from "type-graphql";

@ObjectType("user")
export class User {
  @Field(type => ID)
  id: string;

  @Field(type => String)
  name: string;

  @Field(type => String)
  email: string;

  @Field(type => String)
  password: string;

  constructor(name: string, email: string, password: string) {
    this.id = "something";
    this.name = name;
    this.email = email;
    this.password = password;
  }
}

@Resolver(User)
export class UserResolver {
  private users: User[] = [];

  @Mutation(returns => User)
  async newUser(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const user = new User(name, email, password);
    this.users.push(user);
    return user;
  }
}
