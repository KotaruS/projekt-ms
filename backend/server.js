const express = require('express')
require('dotenv').config()
const port = process.env.PORT || 8000
const { errorHandler } = require('./middleware/errorMiddleware')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/posts', require('./routes/postRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

app.use(errorHandler)

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})