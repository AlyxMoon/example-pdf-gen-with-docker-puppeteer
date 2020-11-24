
const path = require('path')
const fs = require('fs')
const express = require('express')
const puppeteer = require('puppeteer')

const app = express()

const port = process.env.NODE_PORT || 3000
const pdfDir = path.resolve(__dirname, '..', process.env.PDF_DIR || './pdfs')

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
  const { name, url, selector } = req.query

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

  if (selector) {
    await page.waitForSelector('.pdf-content', { visible: true })
  }

  await page.waitForTimeout(2000)

  const filename = name ? `${name}.pdf` : `pdf-${Date.now()}.pdf`
  const savePath = path.join(pdfDir, filename)

  const buffer = await page.pdf({
    path: savePath,
    format: 'letter',
    printBackground: true,
  })

  await browser.close()

  res.status(200).json({
    filepath: savePath, 
  })
}))

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Express app started on port ${port}`)
})
