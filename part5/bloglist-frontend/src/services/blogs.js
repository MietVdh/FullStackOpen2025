import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async (blog, updatedBlog) => {
  const url = `${baseUrl}/${blog.id}`
  const response = await axios.put(url, updatedBlog)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const url = `${baseUrl}/${id}`
  const response = await axios.delete(url, config)
}

export default { getAll, setToken, create, update, remove }