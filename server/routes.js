const router = require('express').Router();

const controller = require('./controllers');

router.get('/products', controller.products.get);

router.get('/products/:product_id/styles', controller.styles.get);

router.get('/products/:product_id', controller.products.get);

router.get('/products/:product_id/related', controller.get.related);
