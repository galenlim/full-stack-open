import React from 'react'
import { logoutUser } from '../reducers/loginReducer'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

const Menu = () => {
  const menuStyle = { backgroundColor: '#C0C0C0' }
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <div style={menuStyle}>
      <Link to="/">blogs</Link> <Link to="/users"> users</Link> { user.name } logged in <input type="button" value="logout" onClick={handleLogout} />
    </div>
  )
}

export default Menu
