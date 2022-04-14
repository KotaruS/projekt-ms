const express = require('express')
require('dotenv').config()
const port = process.env.PORT || 8000
const errorHandler = require('./middleware/errorMiddleware')
const app = express()
const connectDB = require('./config/database')
const cors = require('cors')
const path = require('path')
const { devMiddleware } = require('./middleware/parseMiddleware')

connectDB()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/status', (req, res) => res.status(200).send('Running...'))
app.use('/api/echo', devMiddleware, (req, res) => res.status(200).send(req.body))

app.use(express.static(path.join(__dirname, '../build')))
app.use('/cdn', express.static(path.join(__dirname, 'cdn')))

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/posts', require('./routes/postRoutes'))
app.use('/api/groups', require('./routes/groupRoutes'))
app.use('/api/comments', require('./routes/commentRoutes'))

app.use(errorHandler)

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})