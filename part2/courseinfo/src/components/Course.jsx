const Course = ({ course }) => {
    const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
      <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total
          total={ total }
        />
      </div>
    )
  }
  
  const Header = ({ course }) => <h1>{course}</h1>
  
  const Content = ({ parts} ) => (
    <div>
      {parts.map(part => <Part key={part.id} part={part} />)}
    </div>
  )
  
  const Part = ({ part }) => (
    <p>
      {part.name} {part.exercises}
    </p>
  )
  
  const Total = ({ total }) => <p><b>Total of {total} exercises</b></p>

export default Course