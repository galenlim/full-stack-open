import React, { useState } from 'react'
import Select from 'react-select'
import { gql, useQuery, useMutation } from '@apollo/client'

const UPDATE_AUTHOR = gql`
mutation editAuthor($name: String!, $born: Int!) {
    editAuthor(
      name: $name,
      setBornTo: $born,
    ) {
      id
      name
      born
    }
}
`

const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    id
  }
}
`

const SetBirthYear = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ updateAuthor ] = useMutation(UPDATE_AUTHOR)
  const { data: authorData, loading } = useQuery(ALL_AUTHORS)
  if (loading) return <div></div>
  const options = authorData.allAuthors.map(author => ({ label: author.name, value: author.name }))

  const submit = async (event) => {
    event.preventDefault()
    
    updateAuthor({ variables: { name, born: parseInt(born) } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <Select placeholder="Name" options={options} onChange={(event) => setName(event.value)} />
        </div>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default SetBirthYear
