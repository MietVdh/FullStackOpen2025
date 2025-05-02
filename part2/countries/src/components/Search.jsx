const Search = ({ onFilterChange, filter }) => (
    <p>find countries: <input onChange={onFilterChange} value={filter}/></p>
)

export default Search