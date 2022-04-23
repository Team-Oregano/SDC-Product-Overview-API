const express = require('express')

require('dotenv').config()

const router = require('./routes')

const app = express()

// gzip compression
// const compression = require('compression')
// app.use(compression())

app.use('/products', router)

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on ${port}`)
})
