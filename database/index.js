/* eslint-disable */
const util = require('util');
const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  "neo4j://localhost:7687",
  neo4j.auth.basic("neo4j", "letmein")
);

const session = driver.session();

driver.verifyConnectivity();

const getProducts = (page, count) => {
  var offset = (page - 1) * count;
  return session.readTransaction((tx) => {
    return tx
      .run(`MATCH (n:Product) RETURN n SKIP ${offset} LIMIT ${count}`)
      .then((res) => {
        if (res.records.length > 1) {
          const results = res.records.map((record) => {
            record = record._fields[0].properties;
            record.id = record.id.low;
            return record;
          });
          return results;
        } else {
          res = res.records[0]._fields[0].properties;
          res.id = res.id.low;
          return res;
        }
      })
      .catch((err) => console.error("Error retreiving product list ", err));
  });
};

const getStyles = (product_id) => {
  return session.readTransaction((tx) => {
    return tx.run(`MATCH (p:Product {id: 1}) CALL { WITH p OPTIONAL MATCH (p)-[:HAS_STYLE]->(s:Style) RETURN s } OPTIONAL MATCH (s)-[:HAS_PHOTO]->(photo:Photo) OPTIONAL MATCH (s)-[:HAS_SKU]->(sku:Sku) RETURN toString(p.id), s, photo, sku`)
      .then((res) => {

        if (res.records.length > 1) {
          const results = res.records.map((record, i) => {
            console.log(res.records[i]._fields[1]);




          })
        }
      })
      .catch((err) => console.error(err));
  });
};

const getRelatedPs = (productId) => {
  return session.readTransaction((tx) => {
    return tx.run(`MATCH (n:Product {id: ${productId}})-[:HAS_RELATED_PRODUCT]-(p:RelatedProduct) RETURN p`)
  })
    .then((res) => {
      return res.records.map((record) => {
        return record._fields[0].properties.related_product_id.low;
      });
    })
    .catch((err) => console.error(err));
}

const getFeatures = (productId) => {
  return session.readTransaction((tx) => {
    return tx.run(`MATCH (n:Product {id: ${productId}}) OPTIONAL MATCH (n)-[:HAS_FEATURE]->(f:Feature) return n, f`)
      .then((res) => {
        var product = res.records[0]._fields[0].properties;
        product.id = product.id.low;
        product['features'] = [];
        if (res.records.length > 1) {
          res.records.forEach((record, i) => {
            var feature = res.records[i]._fields[1].properties;
            delete feature.id, delete feature.product_id;
            product['features'].push(feature);
          });
        }
        return product;
      })
      .catch((err) => console.error(err));
  });
}
module.exports = {
  getProducts: getProducts,
  getStyles: getStyles,
  getRelatedPs: getRelatedPs,
  getFeatures: getFeatures
};

/*
DATA STRUCTURES

PRODUCTS ENDPOINT
{
  records: [
    Record {
      keys: [Array],
      length: 1,
      _fields: [Array],
      _fieldLookup: [Object]
    },
    Record {
      keys: [Array],
      length: 1,
      _fields: [Array],
      _fieldLookup: [Object]
    },
    Record {
      keys: [Array],
      length: 1,
      _fields: [Array],
      _fieldLookup: [Object]
    },
    Record {
      keys: [Array],
      length: 1,
      _fields: [Array],
      _fieldLookup: [Object]
    },
    Record {
      keys: [Array],
      length: 1,
      _fields: [Array],
      _fieldLookup: [Object]
    }
  ],
  summary: ResultSummary {
    query: {
      text: 'MATCH (n:Product) RETURN n SKIP 0 LIMIT 5',
      parameters: {}
    },
    queryType: 'r',
    counters: QueryStatistics { _stats: [Object], _systemUpdates: 0 },
    updateStatistics: QueryStatistics { _stats: [Object], _systemUpdates: 0 },
    plan: false,
    profile: false,
    notifications: [],
    server: ServerInfo {
      address: 'localhost:7687',
      version: 'Neo4j/4.4.5',
      agent: 'Neo4j/4.4.5',
      protocolVersion: 4.4
    },
    resultConsumedAfter: Integer { low: 6, high: 0 },
    resultAvailableAfter: Integer { low: 10, high: 0 },
    database: { name: 'neo4j' }
  }
}
*************************
Record {
  keys: [ 'n' ],
  length: 1,
  _fields: [
    Node { identity: [Integer], labels: [Array], properties: [Object] }
  ],
  _fieldLookup: { n: 0 }
}

STYLES ENDPOINT (per record)
[
  '1',
  Node {
    identity: Integer { low: 1000011, high: 0 },
    labels: [ 'Style' ],
    properties: {
      original_price: '140',
      default: true,
      productId: '1',
      name: 'Forest Green & Black',
      style_id: [Integer],
      sale_price: 'null'
    }
  },
  Node {
    identity: Integer { low: 21154094, high: 0 },
    labels: [ 'Photo' ],
    properties: {
      styleId: [Integer],
      id: [Integer],
      thumbnail_url: 'https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80',
      url: 'https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80'
    }
  },
  Node {
    identity: Integer { low: 9690183, high: 0 },
    labels: [ 'Sku' ],
    properties: { quantity: '16', size: 'S', styleId: '1', id: '2' }
  }
] record
*/
