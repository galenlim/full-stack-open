import React, { useState } from 'react'

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  
  const { title, url, author, likes, user } = blog
  const [view, setView] = useState(false)

  const handleView = () => {
    setView(!view)

  }

  const HiddenBlog = () => (
    <div style={blogStyle}>
      {title} {author} <input type="button" value="view" onClick={handleView} />
    </div>  
  )

  const DisplayedBlog = () => (
    <div style={blogStyle}>
      {title} {author} <input type="button" value="hide" onClick={handleView} />
      <div>{url}</div>
      <div>likes {likes} <input type="button" value="like" /></div>
      <div>{user.name}</div>
    </div>  
  )

  if (view) {
    return <DisplayedBlog />
  }
  return <HiddenBlog />
  
}

export default Blog
