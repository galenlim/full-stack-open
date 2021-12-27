import React, { useState } from 'react'
import Select from 'react-select'
import { useQuery, useMutation } from '@apollo/client'
import { UPDATE_AUTHOR, ALL_AUTHORS } from '../queries'

const SetBirthYear = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ updateAuthor ] = useMutation(UPDATE_AUTHOR)
  const { data: authorData, loading } = useQuery(ALL_AUTHORS)
  if (loading) return <div></div>
  const options = authorData.allAuthors.map(author => ({ label: author.name, value: author.name }))

  if (!props.show) {
    return null
  }

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
