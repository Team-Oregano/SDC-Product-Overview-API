const session = require('../../database/index')

module.exports = {
  getRelatedPs: (productId) => {
    return session.readTransaction((tx) => {
      return tx.run(`MATCH (n:Product {id: ${productId}})-[:HAS_RELATED_PRODUCT]-(p:RelatedProduct) RETURN p`)
    })
      .then((res) => {
        return res.records.map((record) => {
          return record._fields[0].properties.related_product_id
        })
      })
      .catch((err) => console.error(err))
  }
}