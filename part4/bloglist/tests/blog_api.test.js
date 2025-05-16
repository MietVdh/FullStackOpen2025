const { test, after, beforeEach, describe } = require('node:test')
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

describe('retrieving all blogs', () => {

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

  test('blog post has property "id"', async () => {
    const response = await api.get('/api/blogs')
    const allBlogs = response.body
    const firstBlog = allBlogs[0]
    assert(firstBlog.hasOwnProperty('id'))
  })
})

describe('creating a new post', () => {

  test('succeeds with status code 201 if required fields are present', async () => {
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


  test('succeeds with status code 201 and likes property set to 0 if no likes were specified', async () => {
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


  test('fails with status code 400 if title is missing from POST request', async () => {
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

  test('fails with status code 400 if url is missing from POST request', async () => {
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
})

describe('deleting a blog', () => {

  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]
    console.log(blogToDelete.title)
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const titlesAtEnd = (await api.get('/api/blogs')).body.map(b => b.title)
    assert(!titlesAtEnd.includes(blogToDelete.title))
  })

})

describe('updating a post', () => {
  test('correctly updates number of likes in database', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]
    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({...blogToUpdate, likes: 12})
    assert.strictEqual(updatedBlog.body.likes, 12)
  })
})

after(async () => {
  await mongoose.connection.close()
})
