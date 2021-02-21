import express from 'express'
import journalsRouter from './journals/journals-router'

const app = express()

app.use('/api/v1/journals', journalsRouter)

export default app
