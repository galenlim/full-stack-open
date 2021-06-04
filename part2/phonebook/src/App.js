import React, { useState } from 'react'

const Number = (props) => (
  <div>{props.name} {props.number}</div>
)

const Numbers = (props) => {
  return (
    <div>
      {props.persons.map((person) => 
        <Number 
          key={person.name} 
          name={person.name} 
          number={person.number}
        />
       )}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([
    { 
      name: 'Arto Hellas',
      number: '040-1234567',
    }
  ]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')

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
      setPersons(persons.concat(personObject))
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input onChange={handleNameChange} />
        </div>
        <div>
          number: <input onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Numbers persons={persons} />
    </div>
  )
}

export default App