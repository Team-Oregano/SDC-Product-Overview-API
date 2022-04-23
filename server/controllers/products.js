const Model = require('../models').products

module.exports = {
  get: async (req, res) => {
    try {
      const data = await Model.getProducts(req.query.page, req.query.count)
      res.status(200).send(data)
    } catch (err) {
      res.status(500).send(err)
    }
  }
}
