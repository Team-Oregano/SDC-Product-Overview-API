const neo4j = require('neo4j-driver')

const driver = new neo4j.driver(process.env.dbURI, neo4j.auth.basic(process.env.user, process.env.password), { disableLosslessIntegers: true })

module.exports = {
  getRelatedPs: async (productId) => {
    try {
      var session = driver.session()
      const res = await session.readTransaction((tx) => tx.run(`MATCH (n:Product {id: ${productId}})-[:HAS_RELATED_PRODUCT]-(p:RelatedProduct) RETURN p.related_product_id`))
      return res.records.map((record) => record.get('p.related_product_id'))
    } catch (err) {
      throw err
      await session.close()
    }
  }
}
