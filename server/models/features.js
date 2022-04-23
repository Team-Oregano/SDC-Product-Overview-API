/* eslint-disable */
const session = require('../../database/index')

module.exports = {
  getFeatures: (productId) => {
    return session.readTransaction(function (tx) {
      return tx.run(
          `MATCH (n:Product {id: ${productId}}) OPTIONAL MATCH (n)-[:HAS_FEATURE]->(f:Feature) return n, f`
        )
        .then((res) => {
          var product = res.records[0]._fields[0].properties
          product["features"] = []
          if (res.records.length > 1) {
            res.records.forEach(function (record, i) {
              var feature = res.records[i]._fields[1].properties
              delete feature.id, delete feature.product_id
              product["features"].push(feature)
            });
          }
          return product
        })
        .catch((err) => console.error(err))
    })
  }
}
