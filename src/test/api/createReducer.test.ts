import { describe, it } from 'mocha'
import { expect } from 'chai'

import createReducer from '../../main/api/createReducer'
import when from '../../main/api/when'
import handle from '../../main/api/handle'
import defineMessage from '../utils/defineMessage'

const CounterMsg = {
  increment: defineMessage('increment', (delta: number = 1) => ({ delta })),
  increment2: defineMessage('increment2', (delta: number = 1) => ({ delta })),
  decrement: defineMessage('decrement', (delta: number = 1) => ({ delta })),
  decrement2: defineMessage('decrement2', (delta: number = 1) => ({ delta })),
}

const reduce = createReducer({ count: 0 }, [
  when(CounterMsg.increment, (state, { delta }) => {
    return { ...state, count: state.count + delta}
  }),
  
  when('decrement', (state, msg) => {
    return { ...state, count: state.count - msg.payload.delta }
  }),
  
  handle(CounterMsg.increment2, (state, { delta }) => {
    state.count += delta
  }),
  
  handle('decrement2', (state, msg) => {
    state.count -= msg.payload.delta
  })
])

describe('createReducer', () => {
  it('should create reducer that handles several message types', () => {
    expect(reduce({ count: 0 }, CounterMsg.increment()))
      .to.eql({ count: 1 })

    expect(reduce({ count: 42 }, CounterMsg.decrement(2)))
      .to.eql({ count: 40 })

    expect(reduce({ count: 0 }, CounterMsg.increment2()))
      .to.eql({ count: 1 })

    expect(reduce({ count: 42 }, CounterMsg.decrement2(2)))
      .to.eql({ count: 40 })
  })
})
