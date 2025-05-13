const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'Test blog one',
    author: 'Harry Potter',
    url: 'http://www.example.com/firsttestblog',
    likes: 5,
  },
  {
    title: 'Second test blog',
    author: 'Hermione Granger',
    url: 'http://www.example.com/secondtestblog',
    likes: 2,
  }
]

beforeEach(async () => {
  await Blog.deleteMany()

  await Blog.insertMany(initialBlogs)
})

// 4.8: GET request to /blogs/api
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})

// 4.9: Write a test that verifies that the unique identifier property of the blog posts is named id,
//  by default the database names the property _id.


// 4.10 Write a test that verifies that making an HTTP POST request to the /api/blogs URL successfully creates a new blog post
// refactor to use async/await


// 4.11 Write a test that verifies that if the likes property is missing from the request, it will default to the value 0
// Make required changes to code so it passes test


// 4.12  Write tests related to creating new blogs via the /api/blogs endpoint, 
// that verify that if the title or url properties are missing from the request data, 
// the backend responds to the request with the status code 400 Bad Request.
// Make required changes to code so it passes test