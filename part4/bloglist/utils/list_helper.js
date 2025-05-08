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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}