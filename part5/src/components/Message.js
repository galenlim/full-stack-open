import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from '@material-ui/lab'

const Message = () => {
  const content = useSelector(state => state.message.content)
  const isError = useSelector(state => state.message.isError)
  if (!content) {
    return null
  }

  const style = isError ? 'error' : 'success'

  return (
    <Alert severity={style}>
      {content}
    </Alert>
  )
}

export default Message
