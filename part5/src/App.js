import React, { useEffect } from 'react'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Message from './components/Message'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'
import SingleBlog from './components/SingleBlog'
import Menu from './components/Menu'
import { connect } from 'react-redux'
import { useSelector, useDispatch } from 'react-redux'
import { setMessage } from './reducers/messageReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { recoverUser } from './reducers/loginReducer'
import {
  BrowserRouter as Router,
  Switch, Route,
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
        <Menu />
        <h2>blog app</h2>
        <Message />
      </div>

      <Switch>
        <Route path="/blogs/:id">
          <SingleBlog />
        </Route>
        <Route path="/users/:id">
          <User />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/">
          <Togglable buttonLabel="create new">
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
