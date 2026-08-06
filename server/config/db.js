import neo4j from "neo4j-driver";
import dotenv from "dotenv";

dotenv.config();

const driver = neo4j.driver(
  process.env.URI,
  neo4j.auth.basic(process.env.DB_USERNAME, process.env.DB_PASSWORD)
);

let isDatabaseAvailable = false;

const isConnectivityError = (error) =>
  error?.code?.includes("ServiceUnavailable") ||
  error?.code?.includes("SessionExpired") ||
  /connect|connection|network|database is unavailable/i.test(error?.message || "");

export const getConnectionStatus = () => ({
  available: isDatabaseAvailable,
});

export async function connectDB() {
  try {
    await driver.verifyConnectivity();
    isDatabaseAvailable = true;
    console.log("✅ Connected to CognoDB");
    return true;
  } catch (err) {
    isDatabaseAvailable = false;
    console.error("❌ Database Connection Failed", err);
    return false;
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
    isDatabaseAvailable = true;
    return result.records.map((record) => {
      const obj = {};
      record.keys.forEach((key) => {
        const val = record.get(key);
        obj[key] = neo4j.isInt(val) ? val.toNumber() : val;
      });
      return obj;
    });
  } catch (error) {
    if (isConnectivityError(error)) {
      isDatabaseAvailable = false;
    }
    throw error;
  } finally {
    await session.close();
  }
}

export default driver;
