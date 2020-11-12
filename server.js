
const path = require('path')
const fs = require('fs')
const express = require('express')
const puppeteer = require('puppeteer')

const app = express()

const port = process.env.NODE_PORT || 3000
const pdfDir = process.env.PDF_DIR || './pdfs'

if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir)
}

const catchAsyncErrors = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error)

  console.error('ErrorHandler:', error)
  res.status(500).json({ error: error.stack })
}

app.get('/', catchAsyncErrors(async (req, res) => {
  const url = req.query.url
  if (!url) {
    return res.status(200).json({ message: 'No URL provided, nothing done' })
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
    ],
  })

  const page = await browser.newPage()
  await page.goto(url, {
    waitUntil: 'networkidle2',
  })

  const savePath = path.join(pdfDir, `pdf-${Date.now()}.pdf`)

  await age.pdf({
    path: savePath,
    format: 'letter',
  })

  await browser.close()

  res.status(200).json({ message: `PDF file generated, saved to ${savePath}` })
}))

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Express app started on port ${port}`)
})
