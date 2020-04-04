import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "verdaocampeao12")
);
const session = driver.session();

async function test() {
  const personName = "Fernando";
  try {
    const result = await session.run(
      "CREATE (a:Person {name: $name}) RETURN a",
      { name: personName }
    );

    const singleRecord = result.records[0];
    const node = singleRecord.get(0);

    console.log(node.properties.name);
  } catch (e) {
    console.log("GOT ERROR", e);
    await session.close();
  }
}

export default async (req, res) => {
  await test();
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ name: "John Doe" }));
};
