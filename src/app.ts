import express from 'express'
import journalsRouter from './journals/journals-router'
import inspirationsRouter from './inspirations/inspirations-router'

const app = express()

app.use('/api/v1/journals', journalsRouter)
app.use('/api/v1/inspirations', inspirationsRouter)

export default app
