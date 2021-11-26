import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Message from './components/Message'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { connect } from 'react-redux'
import { setMessage } from './reducers/messageReducer'

const App = (props) => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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
    } catch(error) {
      props.setMessage('wrong username or password', true, 5)
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
      props.setMessage(`a new blog ${createdBlog.title} by ${createdBlog.author} added`, false, 5)
    } catch (error) {
      props.setMessage(error.message, true, 3)
    }
  }

  const deleteBlog = async (id) => {
    await blogService.remove(id)
    setBlogs(blogs.filter((blog) => blog.id !== id))
    props.setMessage('blog deleted', false, 5)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to the application</h2>
        <Message />
        <LoginForm handleLogin={handleLogin} username={username} password={password} setUsername={setUsername} setPassword={setPassword} />
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Message />
      <p id="logged-in-message">
        { user.name } logged in
        <input type="button" value="logout" onClick={handleLogout} />
      </p>
      <Togglable buttonLabel="create new blog">
        <div>
          <h2>create new</h2>
          <CreateBlogForm createBlog={createBlog} />
        </div>
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog key={blog.id} blog={blog} deleteBlog={deleteBlog} userid={user.id} />
        )}
    </div>
  )
}

const mapDispatchToProps = {
  setMessage
}

const ConnectedApp = connect(null, mapDispatchToProps)(App)
export default ConnectedApp
