import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Message from './components/Message'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

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

    try {
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
    } catch {
        setErrorMessage('wrong username or password')
        setTimeout(() => setErrorMessage(''), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    try {
        const createdBlog = await blogService.create(blogObject)
        setBlogs(blogs.concat(createdBlog))
        setNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
        setTimeout(() => setNotification(''), 5000)
    } catch (error) {
        setNotification(error.message)
        setTimeout(() => setNotification(''), 3000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to the application</h2>
        <Message content={errorMessage} isError={true} />
          <LoginForm handleLogin={handleLogin} username={username} password={password} setUsername={setUsername} setPassword={setPassword} />
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Message content={notification} isError={false} />
      <p>
        { user.name } logged in 
        <input type="button" value="logout" onClick={handleLogout} />
      </p>
      <Togglable buttonLabel="create new blog">
        <div>
          <h2>create new</h2>
          <CreateBlogForm createBlog={createBlog} /> 
        </div>
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
