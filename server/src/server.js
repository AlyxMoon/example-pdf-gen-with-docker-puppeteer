
const path = require('path')
const fs = require('fs')
const express = require('express')

const app = express()

const port = process.env.NODE_PORT || 3000

app.get('/', catchAsyncErrors(async (req, res) => {
  res.json({ message: 'okay' })
}))

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Express app started on port ${port}`)
})
