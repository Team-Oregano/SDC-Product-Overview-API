const Model = require("../models").related

module.exports = {
  get: async (req, res) => {
    try {
      const data = await Model.getRelatedPs(req.params.product_id)
      res.status(200).send(data)
    } catch (err) {
      console.error(err)
    }
  }
}
