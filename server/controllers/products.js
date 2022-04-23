const Model = require('../models').products

module.exports = {
  get: (req, res) => {
    const retrieve = async (page = 1, count = 5) => {
      try {
        const data = await Model.getProducts(page, count)
        res.status(200).send(data)
      } catch (err) {
        res.status(500).send(err)
      }
    }
    retrieve(req.query.page, req.query.count)
  }
}
