import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Users = () => {
  const blogs = useSelector(state => state.blogs)
  const users = []
  const usersMap = new Map()
  blogs.forEach(blog => {
    if (!usersMap.has(blog.user.id)) {
      usersMap.set(blog.user.id, true)
      users.push({
        id: blog.user.id,
        name: blog.user.name
      })
    }
  })

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {
            users.map(user =>
              <tr key={user.id}>
                <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
                <td>{blogs.filter(blog => blog.user.id === user.id).length}</td>
              </tr>
            )
          }
        </tbody>
      </table>
    </div>
  )
}

export default Users
