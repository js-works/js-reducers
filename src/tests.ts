// === imports =======================================================

import { describe, it } from 'mocha'
import { expect } from 'chai'
import { createReducer, combineReducers, on, $ } from './main'

// === types =========================================================

type Props = Record<string, any> // & { type?: never } // TODO
type Message<T extends string = string, P extends Props = {}> = { type: T } & P

type MessageCreator<
  T extends string,
  A extends any[] = [],
  P extends Props = {}
> = {
  (...args: A): Message<T, P>

  type: T
}

// === demo message creators =========================================

const CounterMsg = {
  increment: defineMessage('increment', (delta: number = 1) => ({ delta })),
  increment2: defineMessage('increment2', (delta: number = 1) => ({ delta })),
  decrement: defineMessage('decrement', (delta: number = 1) => ({ delta })),
  decrement2: defineMessage('decrement2', (delta: number = 1) => ({ delta }))
}
// === createReduers ==================================================

const reducer1 = createReducer({ count: 0 }, [
  $(CounterMsg.increment, (state, { delta }) => {
    return { ...state, count: state.count + delta }
  }),

  $('decrement', (state, msg) => {
    return { ...state, count: state.count - msg.delta }
  }),

  on(CounterMsg.increment2, (state, { delta }) => {
    state.count += delta
  }),

  on('decrement2', (state, msg) => {
    state.count -= msg.delta
  })
])

describe('createReducer', () => {
  it('should create reducer that handles several message types', () => {
    expect(reducer1({ count: 0 }, CounterMsg.increment())).to.eql({ count: 1 })

    expect(reducer1({ count: 42 }, CounterMsg.decrement(2))).to.eql({
      count: 40
    })

    expect(reducer1({ count: 0 }, CounterMsg.increment2())).to.eql({ count: 1 })

    expect(reducer1({ count: 42 }, CounterMsg.decrement2(2))).to.eql({
      count: 40
    })
  })
})

// === combineReducers ================================================

const counterReducer = createReducer({ count: 0 }, [
  on(CounterMsg.increment, (state, { delta }) => {
    return { count: state.count + delta }
  })
])

const doubleCounterReducer = createReducer({ count: 0 }, [
  on(CounterMsg.increment, (state, { delta }) => {
    return { count: state.count + 2 * delta }
  })
])

const reducer2 = combineReducers({
  counter: counterReducer,
  doubleCounter: doubleCounterReducer
})

describe('combineReducers', () => {
  it('should combine serveral reducers to one single reducer', () => {
    expect(
      reducer2(
        { counter: { count: 0 }, doubleCounter: { count: 0 } },
        CounterMsg.increment(10)
      )
    ).to.eql({ counter: { count: 10 }, doubleCounter: { count: 20 } })
  })
})

// === tools =========================================================

function defineMessage<T extends string, A extends any[], P extends Props>(
  type: T
): MessageCreator<T, A, P>

function defineMessage<T extends string, A extends any[], P extends Props>(
  type: T,
  getProps: (...args: A) => P
): MessageCreator<T, A, P>

function defineMessage<T extends string, A extends any[], P extends Props>(
  type: T,
  getProps?: (...args: A) => P
): MessageCreator<T, A, P> {
  const ret: any = (...args: A) =>
    getProps ? { type, ...getProps(...args) } : { type }

  ret.type = type

  return ret
}
