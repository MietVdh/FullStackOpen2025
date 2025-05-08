const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

test('dummy returns one', () => {
  const noBlogs = []

  const result = listHelper.dummy(noBlogs)
  assert.strictEqual(result, 1)
})


describe('total likes', () => {

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })


  test('of list of blogs is accurate', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })

  test('of empty list is 0', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })
})


describe('favorite blog', () => {
  test('when only one blog, returns that blog', () => {
    const oneBlog = {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
    assert.deepStrictEqual(listHelper.favoriteBlog(listWithOneBlog), oneBlog)
  })

  test('when no blogs, returns null', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog([]), null)
  })

  test('when multiple blogs, return blog with most likes', () => {
    const mostLiked = {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    }
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), mostLiked)
  })
})


describe('most blogs', () => {
  test('when one blog, returns author of that blog with a blog count of one', () => {
    const authorOfSingleBlog = {
      author: 'Edsger W. Dijkstra',
      blogs: 1
    }
    assert.deepStrictEqual(listHelper.mostBlogs(listWithOneBlog), authorOfSingleBlog)
  })

  test('when multiple blogs, returns author with most blog posts', () => {
    const authorWithMostBlogs = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    assert.deepStrictEqual(listHelper.mostBlogs(blogs), authorWithMostBlogs)
  })

  test('when no blogs, return null', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null)
  })
})


describe('most likes', () => {
  test('when no blogs, return null', () => {
    assert.strictEqual(listHelper.mostLikes([]), null)
  })

  test('when one blog, returns author of that blog, plus likes', () => {
    const authorWithMostLikes = {
      author: 'Edsger W. Dijkstra',
      likes: 5
    }
    assert.deepStrictEqual(listHelper.mostLikes(listWithOneBlog), authorWithMostLikes)
  })

  test('when multiple blogs, returns author with most cumulative likes', () => {
    const authorWithMostLikes = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }
    assert.deepStrictEqual(listHelper.mostLikes(blogs), authorWithMostLikes)
  })
})