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


// 4.9: Write a test that verifies 
// that the unique identifier property of the blog posts is named id,
//  by default the database names the property _id.
test('blog post has property "id"', async () => {
  const response = await api.get('/api/blogs')
  const allBlogs = response.body
  const firstBlog = allBlogs[0]
  assert(firstBlog.hasOwnProperty('id'))
})


// 4.10 Write a test that verifies that making an HTTP POST request to the /api/blogs URL successfully creates a new blog post
// refactor to use async/await
test('making a POST request creates a new blog', async () => {
  const newBlog = {
    title: 'A newly created post',
    author: 'me',
    url: 'http://www.here.com',
    likes: 2,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = (await api.get('/api/blogs')).body
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)
  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('A newly created post'))
})


// 4.11 Write a test that verifies that if the likes property is missing from the request, it will default to the value 0
// Make required changes to code so it passes test
test('if POST request is sent without "likes" property, it defaults to 0', async () => {
  const newBlog = {
    title: 'A blog with no likes',
    author: 'author of blog with no likes',
    url: 'www.nolikes.test'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
  
  const newlyAddedBlog = response.body

  assert.strictEqual(newlyAddedBlog.likes, 0)
})


// 4.12  Write tests related to creating new blogs via the /api/blogs endpoint, 
// that verify that if the title or url properties are missing from the request data, 
// the backend responds to the request with the status code 400 Bad Request.
// Make required changes to code so it passes test
test('if title is missing from POST request, response status code is 400', async () => {
  const newBlog = {
    author: 'Author with no blog',
    url: 'www.example.com/nothing',
    likes: 12
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('if url is missing from POST request, response status code is 400', async () => {
  const newBlog = {
    title: 'Blog with no url',
    author: 'Author with no blog',
    likes: 12
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('when blog gets deleted, it is no longer in list of blogs', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]
  console.log(blogToDelete.title)
  await api.delete(`/api/blogs/${blogToDelete.id}`)

  const titlesAtEnd = (await api.get('/api/blogs')).body.map(b => b.title)
  assert(!titlesAtEnd.includes(blogToDelete.title))
})

test('the number of likes for a blog post can be updated', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToUpdate = blogsAtStart.body[0]
  const updatedBlog = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({...blogToUpdate, likes: 12})
  assert.strictEqual(updatedBlog.body.likes, 12)
})

after(async () => {
  await mongoose.connection.close()
})
