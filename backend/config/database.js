const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.DATABASE_URI)
    console.log(`MongoDB connected to ${db.connection.host}`)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

module.exports = connectDB 