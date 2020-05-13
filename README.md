# js-reducers

A small library to handle state reducers in an opinionated way.
This a sister project of [*js-messages*](https://github.com/js-works/js-messages).
In combination they provide a more concise way for application that base on
[*Redux*](https://redux.js.org).

### API

* `createReducer(config)`
  => concise way to implement state reducers

* `when(messageCreator | type, reduce)`
  => helper function to use in combination with createReducer (see below)

* `handle(messageCreator | type, reduce)`
  => helper function to use in combination with createReducer (see below)

* `combineReducers(config)`
  => combine multiple reducers to a more complex one that (similar to the
  same-named function in redux)

### Usage (demo is completely type-safe with TypeScript)

```javascript
import { defineMessages } from 'js-messages'
import { createReducer, combineReducer, handle, when } from 'js-reducers'

const CounterMsg = defineMessages({
  increment: (delta: number = 1) => ({ delta }),
  reset: (count: number = 0) => ({ count })
})

const LogMsg = defineMessages({
  info: (text: string) => ({ text })
  warn: (text: string) => ({ text })
  error: (text: string) => ({ text })
})

const initialCounterState = {
  count: 0
}

const initialLogState = {
  entries: [] as { level: 'info' | 'warn' | 'error', text: string }[]
}

// The `when` helper is useful if you want to define
// reducers in a strict functional way
const counterReducer = defineReducer(initialCountState, [
  when(CounterMsg.increment, (state, { delta }) => {
    return { ...state, count: state.count + delta }
  }),

  when(CounterMsg.reset, (state, { count }) => {
    return { ...state, count }
  }
]) 

// The `handle` helper is useful if you want to define
// reducers in an imperative way (using Immer internally).
// Be aware the created reducer will still behave completely
// strict functional externally - nobody will notice that
// Immer has been used internally.
const logReducer = defineReducer(initialLogState, [
  handle(LogMsg.info, (state, { text }) => {
    state.entries.push({ level: 'info', text })
  }),
  
  handle(LogMsg.warn, (state, { text }) => {
    state.entries.push({ level: 'warn', text })
  }),
  
  handle(LogMsg.error, (state, { text }) => {
    state.entries.push({ level: 'error', text })
  }),
]) 

const rootReducer = combineReducers({
  counter: counterReducer,
  log: logReducer
})
```
