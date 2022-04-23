const session = require('../../database/index')

// module.exports = {
//   getStyles: (productId) => {
//     return session.readTransaction((tx) => {
//       return tx.run(`MATCH (s:Style {productId: '${productId}'})
//       MATCH (s)-[:HAS_SKU]-(sku:Sku)
//       MATCH (sku)-[:SKU_HAS_PHOTO]-(ph:Photo)
//       RETURN s, sku, ph`)
//         .then((res) => {
//           var response = {
//             product_id: toString(productId),
//             results: []
//           }
//           res.records.forEach((record) => {
//             if (!response.results.includes(record.get('s').properties)) {
//               response.results.push(record.get('s').properties);
//             }
//             var photos = [];
//             var skus = [];
//             photos.push(record.get('ph').properties);
//             skus.push(record.get('sku').properties);
//             response.results['photos'] = photos;
//             response.results['skus'] = skus;
//             console.log(response);




//             console.log(record.get('sku').properties);
//             console.log(record.get('s').properties);
//             console.log(record.get('ph').properties);
//           })
//         })
//         .catch((err) => console.error(err))
//     })
//   }
// }

module.exports = {
  getStyles: (productId) => {
    return session.run(`MATCH (s:Style)-[:HAS_SKU]-(sku)
      WHERE s.productId = '${productId}'
      WITH s, collect(sku) AS skus
      MATCH (s)-[:HAS_PHOTO]-(ph)
      RETURN s, skus, collect(ph) as photos`)
        .then((res) => {
          var product = {product_id: toString(productId), results: []}
          res.records.map((record, i) => {
            const style = record._fields[0].properties
            product.results.push(style)
            const skus = record._fields[1].map((sku) => {
              delete sku.properties.styleId
              return {[sku.properties.id]: {'quantity': sku.properties.quantity, 'size': sku.properties.size}}
            })
            const photosArr = record._fields[2].map((photo) => {
              delete photo.properties.id, delete photo.properties.styleId
              return photo.properties
            })
            product.results.photos = photosArr;
            product.results.sku = skus;
          })
          return product;
        })
        .catch((err) => console.error(err))
  }
}

