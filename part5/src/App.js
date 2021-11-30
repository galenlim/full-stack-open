import React, { useEffect } from 'react'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Message from './components/Message'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import { connect } from 'react-redux'
import { useSelector, useDispatch } from 'react-redux'
import { setMessage } from './reducers/messageReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { loginUser, logoutUser } from './reducers/loginReducer'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => { dispatch(initializeBlogs()) }, [dispatch])

  const user = useSelector(state => state.user)
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(loginUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to the application</h2>
        <Message />
        <LoginForm />
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
        <CreateBlogForm />
      </Togglable>
      <BlogList />
    </div>
  )
}

const mapDispatchToProps = {
  setMessage
}

const ConnectedApp = connect(null, mapDispatchToProps)(App)
export default ConnectedApp
