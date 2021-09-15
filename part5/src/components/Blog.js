import React, { useState } from 'react'
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
    <div style={blogStyle}>
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

  const DisplayedBlog = () => ( 
    <div style={blogStyle}>
      {title} {author} <input type="button" value="hide" onClick={handleView} />
      <div>{url}</div>
      <div>likes {likes} <input type="button" value="like" onClick={handleLike} /></div>
      <div>{user.name}</div>
      {removeButton()}
    </div>  
)

  if (view) {
    return <DisplayedBlog />
  }
  return <HiddenBlog />
  
}

export default Blog
