const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const db = require('../database/index.js');

// test
app.get('/', (req, res) => {
  var product_id = req.query.product_id;
  const retreive = async (product_id) => {
    try {
      const data = await db.getProducts(product_id);
      console.log(data, 'data');
      res.status(200).send(data);
    }
    catch(err) {
      console.error(err);
      res.status(404).send(err);
    }
  }
  retreive(product_id);
  // db.getProducts(product_id)
  //   .then((data) => res.status(201).send(data))
  //   .catch((err) => res.status(404).send(err));
});

// products list
app.get('/products', (req, res) => {

});

// product styles
app.get('/products/:product_id/styles', (req, res) => {

});

// product info
app.get('/products/:product_id', (req, res) => {

});

// related products
app.get('/products/:product_id/related', (req, res) => {

});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});