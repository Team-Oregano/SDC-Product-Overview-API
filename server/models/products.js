const session = require('../../database/index')

module.exports = {
  getProducts: (page = 1, count = 5) => {
    var offset = (page - 1) * count
    return session.run(`MATCH (n:Product) RETURN n SKIP ${offset} LIMIT ${count}`)
      .then((res) => !res.records.length ? res.records[0].get('n').properties : res.records.map((record) => record.get('n').properties))
      .catch((err) => console.error('Error retreiving product list ', err))
  }
}