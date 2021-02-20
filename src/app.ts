import express from 'express'
import journalsRouter from './journals/journals-router'

const app = express()

app.use('/', journalsRouter)

export default app
