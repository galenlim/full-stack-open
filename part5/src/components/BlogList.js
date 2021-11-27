import React from 'react'
import { connect } from 'react-redux'
import Blog from './Blog'

const BlogList = (props) => {
  return (
    <div>
      {props.blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog key={blog.id} blog={blog} />
          //<Blog key={blog.id} blog={blog} deleteBlog={deleteBlog} userid={user.id} />
        )}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs
  }
}

const ConnectedBlogList = connect(mapStateToProps)(BlogList)
export default ConnectedBlogList
