import neo4j from "neo4j-driver";
import dotenv from "dotenv";

dotenv.config();



const driver = neo4j.driver(
  process.env.URI,
  neo4j.auth.basic(process.env.DB_USERNAME, process.env.DB_PASSWORD)
);

export async function connectDB() {
  try {
    await driver.verifyConnectivity();
    console.log("✅ Connected to CognoDB");
  } catch (err) {
    console.error("❌ Database Connection Failed", err);
  }
}

/**
 * Executes openCypher queries with automatic session cleanup
 * @param {string} cypher - The openCypher statement
 * @param {object} params - Query parameters
 */
export async function runQuery(cypher, params = {}) {
  const session = driver.session();
  try {
    const result = await session.run(cypher, params);
    return result.records.map((record) => {
      const obj = {};
      record.keys.forEach((key) => {
        const val = record.get(key);
        obj[key] = neo4j.isInt(val) ? val.toNumber() : val;
      });
      return obj;
    });
  } finally {
    await session.close();
  }
}

export default driver;