const initialState = ''

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FILTER':
      return action.data.content
    default:
      return state
  }
}

//action creators
export const filterAnecdotes = (content) => {
  return {
    type: 'FILTER',
    data: { content }
  }
}

export default filterReducer
