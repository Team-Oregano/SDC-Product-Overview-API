require('dotenv').config()
const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  process.env.dbURI,
  neo4j.auth.basic(process.env.user, process.env.password),
  { disableLosslessIntegers: true }
);

const session = driver.session();

driver.verifyConnectivity();

module.exports = session;

