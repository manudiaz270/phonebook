import { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({message}) => {
    if (message.message === null) {
        return null
    }
    if (message.positive) {
    return(
        <div className='positive_message'>{message.message}</div>
    )
    }
    return(
        <div className='negative_message'>{message.message}</div>
    )
}
const Filter = (props) => {
    return(
        <input value={props.value} onChange={props.onChange}/>
    )
}
const Form = (props) => {
    return(
        <form onSubmit={props.onSubmit}>
         <div> name: <input value={props.nameValue} onChange={props.nameChange} /> </div>
          <div> number: <input value={props.numberValue} onChange={props.numberChange}/> </div>
          <div><button type="submit">add</button></div>
      </form>
    )
}
const Persons = ({filteredData, handleDelete}) => {
    return(
        <ul>
            {filteredData.map(person => <li key={Math.random()}> {person.name} {person.number}<button onClick={() => handleDelete(person.id)}>delete</button></li>)}
        </ul>
    )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [errorMessage, setErrorMessage] = useState({message: null, positive: true})

  useEffect(() => {
    personService
        .getAll()
        .then(response => {
            setPersons(response)
            setFilteredData(response)
            console.log(persons);
        })
  }, [])
  const handleDelete = (id) => {
    if (window.confirm('Delete this contact?')){
    personService
        .erase(id)
    setPersons(persons.filter(person => person.id !== id))
    setFilteredData(persons.filter(person => person.id !== id))
    }
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    const personObject ={
        name: newName,
        number: newNumber,
        id: Math.random()
    }
    if(!persons.some(person => person.name === newName)){
    
    personService   
    .create(personObject)    
    .then(response => {      
            setPersons(persons.concat(response))
            setFilteredData(persons.concat(response))
            setErrorMessage({message:`Added ${response.name}`,positive:true})
            setTimeout(() => {
                setErrorMessage({...errorMessage, message: null})
            },5000)
    })
    .catch(error => {
        console.log('error caught');
        setErrorMessage({message: error.response.data.error, positive:false})
        setTimeout(() => {
            setErrorMessage({...errorMessage, message:null})
        }, 5000)
    })
    }else{
        if(window.confirm("Change this contacts number?")){
        let personToChange = persons.find(person => person.name === newName)
        personService
        .change(personToChange.id, personObject)
        .then(response => {
            setPersons(persons.map(p => p.id !== personToChange.id ? p : response))
            setFilteredData(persons.map(p => p.id !== personToChange.id ? p : response))
            setErrorMessage({message:`Changed ${response.name}'s contanct number`,positive:true})
            setTimeout(() => {
                setErrorMessage({...errorMessage, message: null})
            },5000)
        })
        .catch(error => {
            console.log(error.response.data.error)
            console.log('catched error');
            setErrorMessage({message: error.response.data.error,positive:false})
            console.log(error.response.data.error);
            setTimeout(() => {
                setErrorMessage({...errorMessage, message: null})
            },5000)
            setPersons(persons.filter(person => person.id !== personToChange.id))
            setFilteredData(persons.filter(person => person.id !== personToChange.id))

        })
    }
    }
    setNewName('')
    setNewNumber('')
    }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleSearchChange = (event) => {
    setSearchInput(event.target.value)
    const entry = event.target.value.toLowerCase()
    setFilteredData(persons.filter((person) => {
        if(entry === ''){
            return person
        }
        else{
            return person.name.toLowerCase().includes(entry)
        }
    }))
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage}/>
      <Filter value={searchInput} onChange={handleSearchChange}/>
      <h2>Add new number</h2>
      <Form onSubmit={handleSubmit} nameValue={newName} nameChange={handleNameChange} numberChange={handleNumberChange}
            numberValue={newNumber}/>
      <h2>Numbers</h2>
      <Persons filteredData={filteredData} handleDelete={handleDelete}/>
    </div>
  )
}


export default App