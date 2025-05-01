const Persons = ({ personsShown }) => (
    <ul>
        {personsShown.map(person => <li key={person.name}>{person.name} {person.number}</li>)}
    </ul>
)

export default Persons