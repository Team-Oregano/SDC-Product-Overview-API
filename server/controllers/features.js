const Model = require('../models').features

module.exports = {
  get: async (req, res) => {
    try {
      const data = await Model.getFeatures(req.params.product_id)
      res.status(200).send(data)
    } catch (err) {
      res.status(404).send(err)
    }
  }
}
