import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const User = () => {
  const id = useParams().id
  const blogs = useSelector(state => state.blogs)
  if (blogs.length === 0) return null

  const name = blogs.find(blog => blog.user.id === id).user.name

  return (
    <div>
      <h2>{name}</h2>
      <h3>added blogs</h3>
      {blogs
        .filter(blog => blog.user.id === id)
        .map(blog =>
          <li key={blog.id}>{blog.title}</li>
        )}
    </div>
  )
}

export default User
