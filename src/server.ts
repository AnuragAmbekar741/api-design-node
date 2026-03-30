import express from 'express'

const app = express()

app.get('/health', (req, res) => {
  res.send(`Something raw...`)
})

export { app }
