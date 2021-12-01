import React, { useEffect } from 'react'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Message from './components/Message'
import Togglable from './components/Togglable'
import Users from './components/Users'
import { connect } from 'react-redux'
import { useSelector, useDispatch } from 'react-redux'
import { setMessage } from './reducers/messageReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { logoutUser, recoverUser } from './reducers/loginReducer'
import {
  BrowserRouter as Router,
  Switch, Route
} from 'react-router-dom'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => { dispatch(initializeBlogs()) }, [dispatch])

  const user = useSelector(state => state.user)
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(recoverUser(user))
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
    <Router>
      <div>
        <h2>blogs</h2>
        <Message />
        <p id="logged-in-message">
          { user.name } logged in
          <input type="button" value="logout" onClick={handleLogout} />
        </p>
      </div>

      <Switch>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/">
          <Togglable buttonLabel="create new blog">
            <CreateBlogForm />
          </Togglable>
          <BlogList />
        </Route>
      </Switch>
    </Router>
  )
}

const mapDispatchToProps = {
  setMessage
}

const ConnectedApp = connect(null, mapDispatchToProps)(App)
export default ConnectedApp
