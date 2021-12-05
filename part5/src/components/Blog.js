import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const { title, id, author } = blog

  const HiddenBlog = () => (
    <div>
      <Link to={`/blogs/${id}`}>{title} {author}</Link>
    </div>
  )

  return (
    <div style={blogStyle} className="blogDiv">
      <HiddenBlog />
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
}

export default Blog
