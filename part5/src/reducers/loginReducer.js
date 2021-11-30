import loginService from '../services/login'
import blogService from '../services/blogs'
import { setMessage } from '../reducers/messageReducer'

const reducer = (state = null, action) => {
  switch (action.type) {
  case 'LOGIN':
    return action.data
  case 'LOGOUT':
    return action.data
  default:
    return state
  }
}

export const loginUser = ({ username, password }) => {
  return async dispatch => {
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatch({
        type: 'LOGIN',
        data: user
      })
    } catch(error) {
      dispatch(setMessage('wrong username or password', true, 5))
    }
  }
}

export const logoutUser = () => {
  return async dispatch => {
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      dispatch({
        type: 'LOGOUT',
        data: null
      })
    } catch(error) {
      dispatch(setMessage(error, true, 5))
    }
  }
}

export default reducer
