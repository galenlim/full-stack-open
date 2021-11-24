import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const onReset = (event) => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    onReset
  }
}

export const useCountry = (name) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const onReset = (event) => {
    setValue('')
  }

  return {
    name,
    value,
    onChange,
    onReset
  }
}
