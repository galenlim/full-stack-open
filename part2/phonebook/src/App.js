import React, { useState, useEffect } from 'react'
import numberService from './services/numbers.js'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notice">
      {message}
    </div>
  )
}

const Number = ({ person, deleteNumber }) => {
  const handleDelete = () => { 
    if (window.confirm(`Delete ${person.name} ?`)) {
      deleteNumber(person.id)
    }   
  }

  return (
    <div>
      {person.name} {person.number} <input type="button" value="delete" onClick={handleDelete} />
    </div>
  )
}

const Numbers = (props) => {
  const filtered = props.persons.filter((person) => {
    return person.name.toLowerCase().includes(props.filter.toLowerCase())
  })

  return (
    <div>
      {filtered.map((person) => {
          return (
            <Number
              key={person.id} 
              person={person} 
              deleteNumber={props.deleteNumber}
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
  const [ notifyMessage, setNotifyMessage] = useState(null)

  useEffect(() => {
    numberService
      .getAll()
      .then(initialNumbers => {
        setPersons(initialNumbers)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const duplicatePerson = persons.filter((person) => person.name === newName)

    if (duplicatePerson.length !== 0) {

      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personObject = { 
          'name': newName, 
          'number': newNumber, 
        }
        numberService
          .updateNumber(personObject, duplicatePerson[0].id)
          .then(returnedObject => {
            setPersons(persons
              .filter(person => person.id !== returnedObject.id)
              .concat(returnedObject)
            )
            timedNotification(`Updated ${returnedObject.name}`, 5000)
          })
      }
    } else {
      const personObject = { 
        'name': newName, 
        'number': newNumber, 
      }

      numberService
        .create(personObject)
        .then(returnedObject => {
          setPersons(persons.concat(returnedObject))
          timedNotification(`Added ${returnedObject.name}`, 5000)
        })
    }
  }

  const timedNotification = (message, time) => {
    setNotifyMessage(message)
    setTimeout(() => {
      setNotifyMessage(null)
    }, time)
  }

  const deleteNumber = (id) => {
    numberService
      .deleteNumber(id)
      .then(setPersons(persons.filter(person => person.id !== id)))
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
      <Notification message={notifyMessage} />
      <Filter handler={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm submit={addName} handlers={{ 'name' : handleNameChange, 'number' : handleNumberChange }} />
      <h3>Numbers</h3>
      <Numbers persons={persons} filter={newFilter} deleteNumber={deleteNumber} />
    </div>
  )
}

export default App