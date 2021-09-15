import React from 'react'

const Message = ({ isError, content }) => {
  if (!content) {
    return null
  }

  const style = isError ? 'error' : 'message'

  return (
    <div className={style}>{content}</div>
  )
}

export default Message
