//Completed 2-19 to 2-20

import React, { useState, useEffect} from 'react'
import contacts from "./services/contacts"

const FilterInput = (props) => <div> Filter: <input onChange={props.handleFilterChange}/></div>

const PersonForm = (props) => {
  const addName = props.addName;
  const newName = props.newName;
  const newNumber = props.newNumber;
  const handleNameChange = props.handleNameChange;
  const handleNumberChange = props.handleNumberChange;

  return(
  <form onSubmit={addName}>
    <div>
      name: <input value={newName} onChange={handleNameChange}/>
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

const DisplayName = (props) => {
    const persons=props.persons;
    const newFilter=props.newFilter.toLowerCase();
    const triggerUpdateList=props.triggerUpdateList;
    const setNotifClass = props.setNotifClass;
    const setNotifMessage = props.setNotifMessage;

    const filteredData = persons.filter(person => person.name.toLowerCase().substring(0,newFilter.length)===newFilter);

//Called server in external file (contacts) and used .then here to update state and trigger useEffect (Same for delete and put)
    const deleteFunc = (person) =>{
        if(window.confirm("Are you sure you want to delete?")){
        return(
          contacts.remove(person.id)
          .then(res=>{
            triggerUpdateList(res)
            setNotifClass("greenNotif")
            setNotifMessage(person.name + " removed")
          })
          .then(setTimeout(() => {
            setNotifMessage(null)
          }, 5000))
      )}}

    const data = filteredData.map(person =>{
      return(
        <p key={person.name}>
          {person.name} {person.number+" "}
          <button onClick={()=>{deleteFunc(person)}}>delete</button>
        </p>
      )})
    return <div>{data}</div>
}

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber] = useState('')
  const [ newFilter, setNewFilter] = useState("")
  const [ updateList, triggerUpdateList] = useState("") //Used to update when adding/deleting
  const [ notifMessage, setNotifMessage] = useState(null)
  const [ notifClass, setNotifClass] = useState("")

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterChange = (event) => setNewFilter(event.target.value);

  const addName = (event) => {
    event.preventDefault();
    let name=newName;
    let number=newNumber;

    let duplicateCheck = persons.find(person => person["name"].toLowerCase() === name.toLowerCase());

    const updateContactNum = (id) => {
      //"_id" from mongoDB
      const contact = persons.find(n => n._id === id)
      console.log(contact);
      //Copies properties of specific contact, then updates the number property
      //This "Shallow Copy" method is recommended (Instead of changing the number directly)
      const updatedContact = {...contact, number: newNumber}

      contacts.put(id, updatedContact)
      .then(res=>triggerUpdateList(res))
      .then(()=>{
          setNotifClass("greenNotif")
          setNotifMessage(contact.name + "'s number has been updated!")
        })
      .then(setTimeout(() => {
        setNotifMessage(null)
      }, 5000))
      .catch(error=>{
        console.log(error);
        setNotifClass("redNotif")
        setNotifMessage("Information for " + updatedContact.name + " not found")
      })
    }
    if(name===""||number===""){
      alert("No fields can be blank")
    }
    else if(duplicateCheck!==undefined){
      if(window.confirm(newName + " is already taken. Would you like to update this contact?")){
        //"_id" from mongoDB
        updateContactNum(duplicateCheck._id);
      }
      else alert("Contact Not Modified");
    }
    else {
      setPersons(persons.concat({name,number}));
      contacts.create({name,number})
        .then(res => triggerUpdateList(res))
        .then(()=>{
          setNotifClass("greenNotif")
          setNotifMessage("Added " + name + "!")
          console.log("greenNotif");
        })
        .then(setTimeout(() => {
          setNotifMessage(null)
        }, 5000))
    }
  }

  const Notification = (props) => {
    if (props.message === null){
      return null;
    }
    return (
      <div className={props.notifClass}>
        {props.message}
      </div>
    )
  }

  useEffect(()=>{
    contacts.getAll()
    .then(response => {
      setPersons(response.data);
    })
  },[updateList])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
      message={notifMessage}
      notifClass={notifClass}
      />
      <FilterInput handleFilterChange={handleFilterChange}/>
      <h3>Add a new</h3>
      <PersonForm
        addName={addName}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}/>
      <h3>Numbers</h3>
      <DisplayName
        persons={persons}
        newFilter={newFilter}
        triggerUpdateList={triggerUpdateList}
        setNotifClass={setNotifClass}
        setNotifMessage={setNotifMessage}
        />
    </div>
  )
}

export default App
