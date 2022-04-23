const session = require('../../database/index')

module.exports = {
  getRelatedPs: (productId) => {
    return session.run(`MATCH (n:Product {id: ${productId}})-[:HAS_RELATED_PRODUCT]-(p:RelatedProduct) RETURN p`)
      .then((res) => res.records.map((record) => record.get('p').properties.related_product_id))
      .catch((err) => console.error(err))
  }
}