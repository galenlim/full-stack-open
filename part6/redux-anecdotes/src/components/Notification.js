import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeNotification } from '../reducers/notificationReducer'

const Notification = () => {
  const dispatch = useDispatch()
  const notification = useSelector(state => state.notification)
  useEffect(() => {
    if (notification) {
      setTimeout(() => dispatch(removeNotification()), 5000)
    }
  })
  const style = notification
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
      {notification}
    </div>
  )
}

export default Notification
