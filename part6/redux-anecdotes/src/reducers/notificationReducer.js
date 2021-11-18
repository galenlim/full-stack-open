const initialState = ''

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
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

let timer = 0

export const setNotification = (message, secondsToShow) => {
  return async dispatch => {
    clearTimeout(timer)
    await dispatch({
      type: 'SET',
      data: message
    })
    timer = setTimeout(() => dispatch(removeNotification()), secondsToShow*1000)
  }
}

export default notificationReducer
