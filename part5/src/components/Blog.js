import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { likeBlog, removeBlog } from '../reducers/blogReducer'

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const { title, url, author, user, id, likes } = blog

  const [view, setView] = useState(false)

  const dispatch = useDispatch()
  const loggedInUser = useSelector(state => state.user)

  const handleView = () => {
    setView(!view)
  }

  const handleLike = (blog) => {
    dispatch(likeBlog(blog))
  }

  const handleRemove = (id) => {
    if(window.confirm(`Remove blog ${title} by ${author}`)) {
      dispatch(removeBlog(id))
    }
  }

  const HiddenBlog = () => (
    <div>
      {title} {author} <input type="button" value="view" onClick={handleView} />
    </div>
  )

  const removeButton = () => {
    if (user.id === loggedInUser.id) {
      return (
        <input type="button" value="remove" onClick={() => handleRemove(id)} />
      )
    }
  }

  const likeButton = () => {
    return (
      <input type="button" value="like" onClick={() => handleLike(blog)} />
    )
  }

  const DisplayedBlog = () => (
    <div>
      {title} {author} <input type="button" value="hide" onClick={handleView} />
      <div>{url}</div>
      <div>likes {likes} {likeButton()}</div>
      <div>{user.name}</div>
      <div>{removeButton()}</div>
    </div>
  )

  return (
    <div style={blogStyle} className="blogDiv">
      {view
        ? <DisplayedBlog />
        : <HiddenBlog />
      }
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
}

export default Blog
