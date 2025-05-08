const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sumOfLikes, blog) => sumOfLikes + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  tempFavorite = blogs[0]
  tempLikes = blogs[0].likes
  blogs.forEach((blog, idx) => {
    if (blog.likes > tempLikes) {
      tempFavorite = blog
      tempLikes = blog.likes
    }
  })
  return tempFavorite
}

const mostBlogs = (blogs) => {
  // return author with most blogs, plus number of blogs { author: "author", blogs: 3}
  if (blogs.length === 0) {
    return null
  }
  const blogCountByAuthor = _.countBy(blogs, 'author')
  const arr = Object.entries(blogCountByAuthor)
    .map((key, value) => ({ author: key[0], blogs: key[1] }))
    .sort((a, b) => b.blogs - a.blogs)
  return arr[0]
}

const mostLikes = (blogs) => {
  // { author: "author", likes: 17}
  if (blogs.length === 0) {
    return null
  }
  const byAuthor = _.groupBy(blogs, 'author')
  const arr = Object.entries(byAuthor)
    .map((key, value) => ({ author: key[0], likes: key[1].reduce((sum, item) => sum + item.likes, 0)}))
  return _.maxBy(arr, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}