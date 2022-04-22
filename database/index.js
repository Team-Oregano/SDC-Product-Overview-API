const neo4j = require('neo4j-driver');
const driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', 'letmein'));

const session = driver.session();

driver.verifyConnectivity();

const getProducts = (id) => {
  session.readTransaction((tx) => {
    return tx.run(`MATCH (n) WHERE n.id = ${id} RETURN n LIMIT 3`)
      .then((res) => {
        res = res.records[0]._fields[0].properties;
        // res.id = res.id.Integer.low;
        res.id = res.id.low;
        console.log(res);
      })
      .then((res) => res)
      .catch((err) => console.error('Unable to retreive information from the database: ', err));
  });
};


module.exports = {
  getProducts: getProducts
}