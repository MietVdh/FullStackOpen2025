const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const Blog = require('./models/blog')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

const app = express()

const url = config.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB, error.message')
  })


app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(middleware)

module.exports = app
