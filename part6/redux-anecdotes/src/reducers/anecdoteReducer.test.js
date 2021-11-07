import anecdoteReducer from './anecdoteReducer'
import deepFreeze from 'deep-freeze'

const state = [
  {
    content: 'If it hurts, do it more often',
    id: 1,
    votes: 0
  },
  {
    content: 'Adding manpower to a late software project makes it later!',
    id: 2,
    votes: 2
  },
  {
    content: 'Adding manpower to a late software project makes it later!',
    id: 3,
    votes: 4
  }
]

describe('anecdoteReducer', () => {
  beforeEach(() => {
  })
  test('returns new state with action VOTE', () => {
    const action = {
      type: 'VOTE',
      data: { id: 2 }
    }

    deepFreeze(state)
    const newState = anecdoteReducer(state, action)

    expect(newState).toHaveLength(3)
    expect(newState).toContainEqual({
        content: 'Adding manpower to a late software project makes it later!',
        id: 2,
        votes: 3
      })
  })
  test('returns new state with action NEW_ANECDOTE', () => {
    const newAnecdote = {
      content: 'new stuff',
      id: 3,
      votes: 0
    }
    const action = {
      type: 'NEW_ANECDOTE',
      data: newAnecdote
    }

    deepFreeze(state)
    const newState = anecdoteReducer(state, action)

    expect(newState).toHaveLength(4)
    expect(newState).toContainEqual(newAnecdote)
  })
})
