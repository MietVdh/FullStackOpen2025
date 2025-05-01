import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
    .getAll()
    .then(response => setPersons(response.data))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name === newName)
    if (existingPerson) {
      if (confirm(`${newName} is already added to phonebook. Replace old number with this new one?`)) {
        const newPerson = {...existingPerson, number: newNumber}
        personService
        .update(existingPerson.id, newPerson)
        .then(response => {
          setPersons(persons.map(p => p.id === existingPerson.id ? response.data : p))
          setNotification(`${newName}'s number was updated successfully to ${newNumber}`)
          setTimeout(() => setNotification(null), 5000)
        })
        

      }

    } 
    else {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      personService
      .create(newPerson)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNotification(`${newName}'s number was successfully added`)
        setTimeout(() => setNotification(null), 5000)
    })
      
    }
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (id) => {
    const personToDelete = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService
      .deletePerson(id)
      .then(response => {
        setPersons(persons.filter(p => p.id !== response.data.id))
        setNotification(`${personToDelete.name} was deleted from phonebook`)
        setTimeout(() => setNotification(null), 5000)
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
    setFilter(event.target.value)
  }

  const personsShown = filter ? persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase())) : persons

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notification}/>
      <Filter handleFilterChange={handleFilterChange} filter={filter} />
      
      <h2>Add new</h2>
      <PersonForm 
          handleNameChange={handleNameChange}
          newName={newName}
          handleNumberChange={handleNumberChange}
          newNumber={newNumber}
          addPerson={addPerson}
      />
      
      <h2>Numbers</h2>
      <Persons personsShown={personsShown} deletePerson={deletePerson}/>
      
    </div>
  )
}

export default App