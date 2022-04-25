const neo4j = require('neo4j-driver')

const driver = new neo4j.driver(process.env.dbURI, neo4j.auth.basic(process.env.user, process.env.password), { disableLosslessIntegers: true })

module.exports = {
  getProducts: async (page = 1, count = 5) => {
    try {
      var offset = (page - 1) * count
      var session = driver.session()
      const res = await session.readTransaction((tx) => tx.run(`MATCH (n:Product) RETURN n SKIP ${offset} LIMIT ${count}`))
      return !res.records.length ? res.records[0].get('n').properties : res.records.map((record) => record.get('n').properties)
    } catch (err) {
      await session.close()
      throw err
    }
  }
}