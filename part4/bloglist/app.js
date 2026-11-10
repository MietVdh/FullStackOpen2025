const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const Blog = require('./models/blog')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
// import dns from 'dns'; // or 
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); 

const app = express()

const url = config.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.set('bufferCommands', false);

mongoose.connect(url, {
  family: 4 // Forces the driver to use IPv4 instead of IPv6
})
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })


app.use(express.json())
app.use(middleware.tokenExtractor)
// app.use(middleware.userExtractor, blogsRouter)
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.errorHandler)

module.exports = app
