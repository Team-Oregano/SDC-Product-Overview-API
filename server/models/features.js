require('dotenv').config()

const neo4j = require('neo4j-driver')

const driver = new neo4j.driver(process.env.dbURI, neo4j.auth.basic(process.env.user, process.env.password), { disableLosslessIntegers: true })

module.exports = {
  getFeatures: async (productId) => {
    try {
      const session = driver.session()
      const res = await session.readTransaction((tx) => tx.run(`MATCH (n:Product {id: ${productId}}) OPTIONAL MATCH (n)-[:HAS_FEATURE]->(f:Feature) return n, f`))
      const product = res.records[0].get('n').properties
      product["features"] = []
      res.records.forEach(function (record, i) {
        const feature = record.get('f').properties
        delete feature.id, delete feature.product_id
        product["features"].push(feature)
      })
      return product;
    } catch (err) {
      await session.close()
      throw err
    }
  }
}