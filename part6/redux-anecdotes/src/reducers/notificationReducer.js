const initialState = ''

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    //case 'VOTE':
    //  return `you voted '${action.data.content}'`
    //case 'NEW_ANECDOTE':
    //  return `you added '${action.data.content}'`
    case 'SET':
      return action.data
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

export const setNotification = (message, secondsToShow) => {
  return async dispatch => {
    await dispatch({
      type: 'SET',
      data: message
    })
    setTimeout(() => dispatch(removeNotification()), secondsToShow*1000)
  }
}

export default notificationReducer
