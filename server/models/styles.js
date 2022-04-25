const neo4j = require('neo4j-driver')

const driver = new neo4j.driver(process.env.dbURI, neo4j.auth.basic(process.env.user, process.env.password), { disableLosslessIntegers: true })

module.exports = {
  getStyles: async (productId) => {
    try {
        var session = driver.session()
        const res = await session.readTransaction((tx) => {
          return tx.run(`MATCH (s:Style)-[:HAS_SKU]-(sku) WHERE s.productId = '${productId}' WITH s, collect(sku) AS skus MATCH (s)-[:HAS_PHOTO]-(ph) RETURN s, skus, collect(ph) as photos`)
        })
        var product = { product_id: productId.toString(), results: [] }
        res.records.map((record, i) => {
          const style = record._fields[0].properties
          style.skus = {}
          const skus = record._fields[1].forEach((sku) => {
            delete sku.properties.styleId
            style.skus[sku.properties.id] = {'quantity': Number(sku.properties.quantity), 'size': sku.properties.size }
          })
          const photosArr = record._fields[2].map((photo) => {
            delete photo.properties.id, delete photo.properties.styleId
            return photo.properties
          })
          style.photos = photosArr
          product.results.push(style)
        })
        return product
      } catch (err) {
        await session.close()
        throw err
      }
  }
}



