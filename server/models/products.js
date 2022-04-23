const session = require('../../database/index')

module.exports = {
  getProducts: (page, count) => {
    var offset = (page - 1) * count;
    return session.readTransaction((tx) => {
      return tx
        .run(`MATCH (n:Product) RETURN n SKIP ${offset} LIMIT ${count}`)
        .then((res) => {
          if (res.records.length > 1) {
            const results = res.records.map((record) => {
              record = record._fields[0].properties
              return record
            })
            return results
          } else {
            res = res.records[0]._fields[0].properties
            return res
          }
        })
        .catch((err) => console.error("Error retreiving product list ", err))
    })
  }
}