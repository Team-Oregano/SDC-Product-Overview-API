const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const router = require('./routes')
const cors = require('cors')
const app = express()

require('dotenv').config()

app.use(compression())
app.use(morgan('dev'))
app.use(cors())
app.use('/products', router)


const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on ${port}`)
})
