import express from 'express'
import journalRouter from './journal/journal-router'

const app = express()

app.use('/', journalRouter)

export default app
