import React from 'react'
import { connect } from 'react-redux'

const Notification = (props) => {
  const style = props.notification
    ? {
        border: 'solid',
        padding: 10,
        borderWidth: 1
      }
    : {
        display: 'none'
      }
  return (
    <div style={style}>
      {props.notification}
    </div>
  )
}

const mapStateToProps= (state) => {
  return {
    notification: state.notification
  }
}

const ConnectedNotification = connect(mapStateToProps)(Notification)
export default ConnectedNotification
