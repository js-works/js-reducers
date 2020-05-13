import { describe, it } from 'mocha'
import { expect } from 'chai'

import createReducer from '../../main/api/createReducer'
import pick from '../../main/api/pick'
import when from '../../main/api/when'
import handle from '../../main/api/handle'
import on from '../../main/api/on'
import defineMessage from '../utils/defineMessage'

const CounterMsg = {
  increment: defineMessage('increment', (delta: number = 1) => ({ delta })),
  decrement: defineMessage('decrement', (delta: number = 1) => ({ delta })),
  reset: defineMessage('reset', (count: number = 0) => ({ count })),
  multiply: defineMessage('multiply', (factor: number) => ({ factor }))
}

const reduce = createReducer({ count: 0 }, [
  on(CounterMsg.increment, (state, { delta }) => {
    state.count += delta
  }),
  
  when(CounterMsg.decrement, (state, { delta }) => {
    return { ...state, count: state.count - delta }
  }),

  pick(CounterMsg.reset, (state, msg) => {
    return { ...state, count: msg.payload.count }
  }),
  
  handle(CounterMsg.multiply, (state, msg) => {
    state.count *= msg.payload.factor
  })
])

describe('createReducer', () => {
  it('should create reducer that handles several message types', () => {
    expect(reduce({ count: 0 }, CounterMsg.increment()))
      .to.eql({ count: 1 })
    
    expect(reduce({ count: 100 }, CounterMsg.increment()))
      .to.eql({ count: 101 })
    
    expect(reduce({ count: 42 }, CounterMsg.decrement(2)))
      .to.eql({ count: 40 })

    expect(reduce({ count: 100 }, CounterMsg.reset()))
      .to.eql({ count: 0 })
    
    expect(reduce({ count: 200 }, CounterMsg.reset(100)))
      .to.eql({ count: 100 })
    
    expect(reduce({ count: 100 }, CounterMsg.multiply(4)))
      .to.eql({ count: 400 })
  })
})
