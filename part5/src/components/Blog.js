import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const Blog = ({ blog }) => {
  const { title, id, author } = blog

  return (
    <div>
      <Link to={`/blogs/${id}`}>{title} {author}</Link>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
}

export default Blog
