import React from 'react'
import Comments from '../components/Comments'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import {
  Button,
} from '@material-ui/core'

const SingleBlog = () => {
  const id = useParams().id
  const blogs = useSelector(state => state.blogs)
  const loggedInUser = useSelector(state => state.user)
  const dispatch = useDispatch()
  const history = useHistory()

  const blog = blogs.find(blog => blog.id === id)
  if (blogs.length === 0) return null
  const { title,  url, likes, user, author, comments } = blog

  const handleLike = (blog) => {
    dispatch(likeBlog(blog))
  }

  const LikeButton = () => {
    return (
      <Button variant="contained" color="primary" value="like" onClick={() => handleLike(blog)}>
        like
      </Button>
    )
  }

  const handleRemove = (id) => {
    if(window.confirm(`Remove blog ${title} by ${author}`)) {
      dispatch(removeBlog(id))
      history.push('/')
    }
  }

  const removeButton = () => {
    if (user.id === loggedInUser.id) {
      return (
        <Button variant="contained" color="primary" value="remove" onClick={() => handleRemove(id)}>
          remove
        </Button>
      )
    }
  }

  return (
    <div>
      <h2>{title}</h2>
      <div><a href={url}>{url}</a></div>
      <div>{likes} likes <LikeButton /></div>
      <div>added by {user.name}</div>
      <div>{removeButton()}</div>
      <Comments comments={comments} id={id} />
    </div>
  )
}

export default SingleBlog
