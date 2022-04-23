/* eslint-disable */
const session = require('../../database/index')

module.exports = {
  getFeatures: (productId) => {
    return session.run(`MATCH (n:Product {id: ${productId}}) OPTIONAL MATCH (n)-[:HAS_FEATURE]->(f:Feature) return n, f`)
      .then((res) => {
        const product = res.records[0].get('n').properties
        product["features"] = []
        res.records.forEach(function (record, i) {
          const feature = record.get('f').properties
          delete feature.id, delete feature.product_id
          product["features"].push(feature)
        })
        return product;
      })
      .catch((err) => console.error('Error retrieving product details: ', err))
  }
}