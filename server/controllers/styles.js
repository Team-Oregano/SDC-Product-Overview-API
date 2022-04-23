const Model = require("../models").styles

module.exports = {
  get: (req, res) => {
    const retrieve = async (productId) => {
      try {
        const data = await Model.getStyles(productId)
        res.status(200).send(data)
      } catch (err) {
        res.status(404).send(err)
      }
    }
    retrieve(req.query.product_id)
    res.end()
  }
}
