import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Number = (props) => (
  <div>{props.name} {props.number}</div>
)

const Numbers = (props) => {
  const filtered = props.persons.filter((person) => {
    return person.name.toLowerCase().includes(props.filter.toLowerCase())
  })

  return (
    <div>
      {filtered.map((person) => {
          return (
            <Number
              key={person.name} 
              name={person.name} 
              number={person.number}
            />
          ) 
      }
       )}
    </div>
  )
}

const PersonForm = (props) => {

  return ( 
    <form onSubmit={props.submit}>
      <div>
        name: <input onChange={props.handlers.name} />
      </div>
      <div>
        number: <input onChange={props.handlers.number} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Filter = (props) => {

  return (
      <div>filter shown with <input onChange={props.handler} /></div>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const duplicateTest = persons.find((person) => person.name === newName)

    if (duplicateTest) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const personObject = { 
        'name': newName, 
        'number': newNumber, 
      }
      axios
        .post('http://localhost:3001/persons', personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handler={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm submit={addName} handlers={{ 'name' : handleNameChange, 'number' : handleNumberChange }} />
      <h3>Numbers</h3>
      <Numbers persons={persons} filter={newFilter}/>
    </div>
  )
}

export default App