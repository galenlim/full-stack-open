import anecdoteReducer from './anecdoteReducer'
import deepFreeze from 'deep-freeze'


describe('anecdoteReducer', () => {
  test('returns new state with action VOTE', () => {
    const state = []
    const action = {
      type: 'VOTE',
      data: { id: 1 }
    }

    deepFreeze(state)
    const newState = anecdoteReducer(state, action)

    expect(newState
