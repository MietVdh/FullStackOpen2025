const Filter = ({ handleFilterChange, filter}) => (
    <div>Filter shown with <input onChange={handleFilterChange} value={filter}/></div>
)

export default Filter