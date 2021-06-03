import React from 'react';

const Header = ({ name }) => {
  return (
    <h2>{name}</h2>
  )
}

const Total = ({ parts }) => {
  const sum = parts.reduce((total, part) => {
    return total + part.exercises;
  }, 0)

  return (
    <strong>total of {sum} exercises</strong>
  ) 
}

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>    
  )
}

const Content = ({ parts }) => {
  const listParts = parts.map(value =>
    <Part key={value.id} part={value} />
  )

  return (
    <div>{listParts}</div>
  )
}

const Course = ({ courses }) => {
  const listCourses = courses.map(course => {
    return (
      <div key={course.id}>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  })

  return (
    <div>{listCourses}</div>
  )
}

export default Course