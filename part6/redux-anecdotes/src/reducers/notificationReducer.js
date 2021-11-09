const initialState = 'hello world'

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ERROR':
      return state
    default:
      return state
  }
}

export default notificationReducer
