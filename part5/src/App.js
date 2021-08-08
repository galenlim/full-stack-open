import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    const user = await loginService.login ({
      username, password
    })
    window.localStorage.setItem(
      'loggedBlogappUser', JSON.stringify(user)
    )
    blogService.setToken(user.token)
    setUser(user)
    setUsername('')
    setPassword('')
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const handleCreate = async (event) => {
    event.preventDefault()

    const createdBlog = await blogService.create({
      title, author, url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
    setBlogs(blogs.concat(createdBlog))
    //combine note into one state
  }

  const createBlogForm = () => (
    <form onSubmit={handleCreate}>
      title:<input type="text" value={title} onChange={({ target }) => setTitle(target.value)}/><br />
      author:<input type="text" value={author} onChange={({ target }) => setAuthor(target.value)}/><br />
      url:<input type="text" value={url} onChange={({ target }) => setUrl(target.value)}/><br />
      <button type="submit">create</button>
    </form>
  )
  if (user === null) {
    return (
      <div>
        <h2>Log in to the application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <p>
        { user.name } logged in 
        <input type="button" value="logout" onClick={handleLogout} />
      </p>
      <h2>create new</h2>
      { createBlogForm() }
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
