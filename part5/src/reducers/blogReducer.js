import blogService from '../services/blogs'
import { setMessage } from '../reducers/messageReducer'

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_BLOGS':
    return action.data
  case 'NEW_BLOG':
    return state.concat(action.data)
  case 'LIKE_BLOG': {
    const id = action.data.id
    return state
      .map(blog =>
        blog.id === id ? { ...action.data, user: blog.user } : blog)
  }
  case 'COMMENT_BLOG': {
    const id = action.data.id
    return state
      .map(blog =>
        blog.id === id ? { ...action.data, user: blog.user } : blog)
  }
  case 'REMOVE_BLOG': {
    const id = action.data
    return state
      .filter(blog => blog.id !== id)
  }
  default:
    return state
  }
}

//action creators
export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const createBlog = (blog) => {
  return async dispatch => {
    const newBlog = await blogService.create(blog)
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog
    })
  }
}

export const likeBlog = ({ likes, id, ...rest }) => {
  return async dispatch => {
    const changedBlog = {
      ...rest,
      likes: likes + 1,
    }
    const likedBlog = await blogService.update(id, changedBlog)
    dispatch({
      type: 'LIKE_BLOG',
      data: likedBlog
    })
  }
}

export const removeBlog = (id) => {
  return async dispatch => {
    try {
      await blogService.remove(id)
      dispatch({
        type: 'REMOVE_BLOG',
        data: id
      })
      dispatch(setMessage('blog deleted', false, 5))
    } catch(error) {
      dispatch(setMessage(error.message, true, 3))
    }
  }
}

export const commentBlog = ({ newComments, id }) => {
  return async dispatch => {
    try {
      const updatedComments = {
        comments: newComments
      }
      const commentedBlog = await blogService.comment(id, updatedComments)
      dispatch({
        type: 'COMMENT_BLOG',
        data: commentedBlog
      })
    } catch(error) {
      console.log(error)
    }
  }
}

export default reducer
