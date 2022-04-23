const session = require('../../database/index')

module.exports = {
  getStyles: (productId) => {
    return session.readTransaction((tx) => {
      return tx.run(`MATCH (p:Product {id: ${productId}}) CALL { WITH p OPTIONAL MATCH (p)-[:HAS_STYLE]->(s:Style) RETURN s } OPTIONAL MATCH (s)-[:HAS_PHOTO]->(photo:Photo) OPTIONAL MATCH (s)-[:HAS_SKU]->(sku:Sku) RETURN toString(p.id), s, photo, sku`)
        .then((res) => {

          if (res.records.length > 1) {
            const results = res.records.map((record, i) => {
              console.log(res.records[i]._fields[1])




            })
          }
        })
        .catch((err) => console.error(err))
    })
  }
}