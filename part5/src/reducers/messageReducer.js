const initialState = ''

const messageReducer = (state = initialState, action) => {
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
export const removeMessage = () => {
  return {
    type: 'REMOVE'
  }
}

let timer = 0

export const setMessage = (content, isError, secondsToShow) => {
  return async dispatch => {
    clearTimeout(timer)
    await dispatch({
      type: 'SET',
      data: {
        content,
        isError
      }
    })
    timer = setTimeout(() => dispatch(removeMessage()), secondsToShow*1000)
  }
}

export default messageReducer
