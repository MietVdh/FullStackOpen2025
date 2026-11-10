const _ = require('lodash')

const totalLikes = (blogs) => {
  return blogs.reduce((sumOfLikes, blog) => sumOfLikes + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  let tempFavorite = blogs[0]
  let tempLikes = blogs[0].likes
  blogs.forEach((blog) => {
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
    .map(([author, count]) => ({ author, blogs: count }))
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
    .map(([author, authorBlogs]) => ({ author, likes: authorBlogs.reduce((sum, item) => sum + item.likes, 0) }))
  return _.maxBy(arr, 'likes')
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}