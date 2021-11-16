import React from 'react'
import { connect } from 'react-redux'
import { filterAnecdotes  } from '../reducers/filterReducer'

const Filter = (props) => {
  const handleChange = (event) =>{
    const content = event.target.value
    props.filterAnecdotes(content)
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

const mapDispatchToProps= {
  filterAnecdotes
}

const ConnectedFilter = connect(null, mapDispatchToProps)(Filter)
export default ConnectedFilter
