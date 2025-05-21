const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

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

const userInfo = {
  name: 'Harry Potter',
  username: 'harry',
  password: 'quidditch'
}

let token = ''

beforeEach(async () => {
  await Blog.deleteMany()
  await User.deleteMany()

  const newUser = new User({
    username: userInfo.username,
    name: userInfo.name,
    passwordHash: await bcrypt.hash(userInfo.password, 10)
  })
  const savedUser = await newUser.save()
  const userForToken = {
    username: savedUser.username,
    id: savedUser._id
  }
  token = jwt.sign(userForToken, process.env.SECRET)
  initialBlogs.forEach(b => b.user = savedUser)
  
    
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

  test('succeeds with status code 201 if token and required fields are present', async () => {
    const newBlog = {
      title: 'A newly created post',
      author: 'me',
      url: 'http://www.here.com',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
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
      .set({ Authorization: `Bearer ${token}` })
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
      .set({ Authorization: `Bearer ${token}` })
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
      .set({ Authorization: `Bearer ${token}` })
      .send(newBlog)
      .expect(400)
  })

  test('fails with status code 401 if token is missing', async () => {
    const newBlog = {
      title: 'A newly created post',
      author: 'me',
      url: 'http://www.here.com',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

  })
})

describe('deleting a blog', () => {

  test('succeeds with status code 204 if id and token are valid', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]
    console.log(blogToDelete.title)
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(204)

    const titlesAtEnd = (await api.get('/api/blogs')).body.map(b => b.title)
    assert(!titlesAtEnd.includes(blogToDelete.title))
  })

  test('fails with status code 401 if token is invalid or missing', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]
    console.log(blogToDelete.title)
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const titlesAtEnd = (await api.get('/api/blogs')).body.map(b => b.title)
    assert(titlesAtEnd.includes(blogToDelete.title))
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

describe('testing user creation', () => {
  describe('when there is initially one user in db', () => {
    beforeEach(async () => {
      await User.deleteMany({})

      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash})

      await user.save()
    })

    test('creating a user with valid new username succeeds with status code 201', async () => {
      const usersAtStart = (await User.find({}))

      const newUser = {
        username: 'thechosenone',
        name: 'Harry Potter',
        password: 'quidditch',
      }

      await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

      const usersAtEnd = (await User.find({}))
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))

    })

    test('creating a user with too short a username fails with status 400', async () => {
        const usersAtStart = (await User.find({}))

        const newUser = {
          username: 'HP',
          name: 'Harry Potter',
          password: 'quidditch',
        }

        await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = (await User.find({}))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
