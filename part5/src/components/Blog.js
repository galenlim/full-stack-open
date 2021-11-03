import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'

const Blog = ({ blog, deleteBlog, userid }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const { title, url, author, user, id } = blog
  const [view, setView] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  useEffect(() => {
  })

  const handleView = () => {
    setView(!view)
  }

  const handleLike = async () => {
    const blogObject = {
      user: user.id,
      likes: likes + 1,
      author,
      title,
      url
    }

    const updatedBlog = await blogService.update(id, blogObject)
    setLikes(updatedBlog.likes)
  }

  const handleRemove = async () => {
    if(window.confirm(`Remove blog ${title} by ${author}`)) {
      await deleteBlog(id)
    }
  }

  const HiddenBlog = () => (
    <div>
      {title} {author} <input type="button" value="view" onClick={handleView} />
    </div>
  )

  const removeButton = () => {
    if (user.id === userid || user === userid) {
      return (
        <div><input type="button" value="remove" onClick={handleRemove} /></div>
      )
    }
  }

  const likeButton = () => {
    return (
      <input type="button" value="like" onClick={handleLike} />
    )
  }

  const DisplayedBlog = () => (
    <div>
      {title} {author} <input type="button" value="hide" onClick={handleView} />
      <div>{url}</div>
      <div>likes {likes} {likeButton()}</div>
      <div>{user.name}</div>
      {removeButton()}
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
  deleteBlog: PropTypes.func.isRequired,
  userid: PropTypes.string.isRequired
}

export default Blog
