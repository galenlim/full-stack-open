import React from 'react'
import { useSelector } from 'react-redux'

const Message = () => {
  const content = useSelector(state => state.message.content)
  const isError = useSelector(state => state.message.isError)
  if (!content) {
    return null
  }

  const style = isError ? 'error' : 'message'

  return (
    <div className={style}>
      {content}
    </div>
  )
}

export default Message
