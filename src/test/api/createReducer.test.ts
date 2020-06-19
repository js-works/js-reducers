import { describe, it } from 'mocha'
import { expect } from 'chai'

import { createReducer, on, when } from '../../main/index'
import defineMessage from '../utils/defineMessage'

const CounterMsg = {
  increment: defineMessage('increment', (delta: number = 1) => ({ delta })),
  increment2: defineMessage('increment2', (delta: number = 1) => ({ delta })),
  decrement: defineMessage('decrement', (delta: number = 1) => ({ delta })),
  decrement2: defineMessage('decrement2', (delta: number = 1) => ({ delta }))
}

const reduce = createReducer({ count: 0 }, [
  on(CounterMsg.increment, (state, { delta }) => {
    return { ...state, count: state.count + delta }
  }),

  on('decrement', (state, msg) => {
    return { ...state, count: state.count - msg.delta }
  }),

  when(CounterMsg.increment2, (state, { delta }) => {
    state.count += delta
  }),

  when('decrement2', (state, msg) => {
    state.count -= msg.delta
  })
])

describe('createReducer', () => {
  it('should create reducer that handles several message types', () => {
    expect(reduce({ count: 0 }, CounterMsg.increment())).to.eql({ count: 1 })

    expect(reduce({ count: 42 }, CounterMsg.decrement(2))).to.eql({ count: 40 })

    expect(reduce({ count: 0 }, CounterMsg.increment2())).to.eql({ count: 1 })

    expect(reduce({ count: 42 }, CounterMsg.decrement2(2))).to.eql({
      count: 40
    })
  })
})
