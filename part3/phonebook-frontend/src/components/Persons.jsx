
const Persons = ({ personsShown, deletePerson }) => (
    <ul>
        {personsShown.map(person => <Person key={person.id} person={person} deletePerson={deletePerson} />)}
    </ul>
)

const Person = ({ person, deletePerson }) => (
    <li>{person.name} {person.number} <button onClick={() => deletePerson(person.id)}>delete</button></li>
)
export default Persons