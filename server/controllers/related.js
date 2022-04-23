const Model = require("../models").related

module.exports = {
  get: (req, res) => {
    const retrieve = async (productId) => {
      try {
        const data = await Model.getRelatedPs(productId)
        res.status(200).send(data);
      } catch (err) {
        console.error(err)
      }
    }
    retrieve(req.query.product_id)
  }
}
