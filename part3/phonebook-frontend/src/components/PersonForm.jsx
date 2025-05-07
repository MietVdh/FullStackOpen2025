const PersonForm = ({ handleNameChange, newName, handleNumberChange, newNumber, addPerson }) => (
    <form>
        <div>
          name: <input onChange={handleNameChange} value={newName}/>
        </div>
        <div>
          number: <input onChange={handleNumberChange} value={newNumber}/>
        </div>
        <div>
          <button type="submit" onClick={addPerson}>add</button>
        </div>
      </form>
)

export default PersonForm