import React, { useState } from 'react'
import { useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import SetBirthYear from './components/SetBirthYear'
import Login from './components/Login'
import Recommendations from './components/Recommendations'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token
          ? <>
              <button onClick={() => setPage('add')}>add book</button>
              <button onClick={() => setPage('recommend')}>recommend</button>
              <button onClick={logout}>logout</button> 
            </>
          : <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Login
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
      />

      <Authors
        show={page === 'authors'}
      />

      <SetBirthYear
        show={page === 'authors' && token}
      />

      <Books
        show={page === 'books'}
      />

      {token
        ? <>
          <NewBook
            show={page === 'add'}
          />

          <Recommendations
            show={page === 'recommend'}
            token={token}
          />
        </>
          : <></>
      }
    </div>
  )
}

export default App
