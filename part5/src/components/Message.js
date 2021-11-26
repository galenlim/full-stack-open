import React from 'react'
import { connect } from 'react-redux'

//const Message = ({ isError, content }) => {
const Message = ({ content, isError }) => {
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

const mapStateToProps = (state) => {
  return {
    content: state.message.content,
    isError: state.message.isError
  }
}

const ConnectedMessage = connect(mapStateToProps)(Message)
export default ConnectedMessage
