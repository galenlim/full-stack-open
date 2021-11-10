const initialState = ''

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'VOTE':
      return `you voted '${action.data.content}'`
    case 'NEW_ANECDOTE':
      return `you added '${action.data.content}'`
    case 'REMOVE':
      return ''
    default:
      return state
  }
}

//action creators
export const removeNotification = () => {
  return {
    type: 'REMOVE'
  }
}

export default notificationReducer
