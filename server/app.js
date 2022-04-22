const express = require('express');

require('dotenv').config();

const db = require('../database/index');

const app = express();
const port = process.env.PORT || 3000;

// gzip compression
// const compression = require('compression');
// app.use(compression());

// products list
app.get('/products', (req, res) => {
  const retrieve = async (page = 1, count = 5) => {
    try {
      const data = await db.getProducts(page, count);
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send(err);
    }
  };
  retrieve(req.query.page, req.query.count);
});

// !!product styles
app.get('/products/:product_id/styles', (req, res) => {
  const retrieve = async (productId) => {
    try {
      const data = await db.getStyles(productId);
      res.status(200).send(data);
    } catch (err) {
      res.status(404).send(err);
    }
  };
  retrieve(req.query.product_id);
  res.end();
});

// product info
app.get('/products/:product_id', (req, res) => {
  const retrieve = async (productId) => {
    try {
      const data = await db.getFeatures(productId);
      res.status(200).send(data);
    } catch (err) {
      res.status(404).send(err);
    }
  };
  retrieve(req.query.product_id);
});

// related products
app.get('/products/:product_id/related', (req, res) => {
  const retrieve = async (productId) => {
    try {
      const data = await db.getRelatedPs(productId);
      res.status(200).send(data);
    } catch (err) {
      console.error(err);
    }
  };
  retrieve(req.query.product_id);
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
