import React from 'react'
import { logoutUser } from '../reducers/loginReducer'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Button
} from '@material-ui/core'

const Menu = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        <Button color="inherit">
          { user.name } logged in
        </Button>
        <Button color="inherit" onClick={handleLogout}>
          logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Menu
