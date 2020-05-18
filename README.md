# js-reducers

[![Licence](https://img.shields.io/badge/licence-LGPLv3-blue.svg?style=flat)](https://github.com/js-works/js-reducers/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/js-reducers.svg?style=flat)](https://www.npmjs.com/package/js-reducers)
[![Build status](https://travis-ci.com/js-works/js-reducers.svg)](https://travis-ci.org/js-works/js-reducers)
[![Coverage status](https://coveralls.io/repos/github/js-works/js-reducers/badge.svg?branch=master)](https://coveralls.io/github/js-works/js-reducers?branch=master)


A small library to when state reducers in an opinionated way.
This a sister project of [*js-messages*](https://github.com/js-works/js-messages).
In combination they provide a more concise way for application that base on
[*Redux*](https://redux.js.org).

### API

* `createReducer(config)`
  => concise way to implement state reducers

* `on(messageCreator | type, reduce)`
  => helper function to use in combination with createReducer (see below)

* `when(messageCreator | type, reduce)`
  => helper function to use in combination with createReducer (see below)

* `combineReducers(config)`
  => combine multiple reducers to a more complex one that whens state
  of several domains (similar to the same-named function in redux)

### Usage (demo is completely type-safe with TypeScript)

```javascript
import { defineMessage } from 'js-messages'
import { createReducer, combineReducer, on, when } from 'js-reducers'

// This will generate message creators for the counter domain.
const CounterMsg = {
  increment: defineMessage('counter.increment',
    (delta: number = 1) => ({ delta })),
  
  reset: defineMessage('counter.reset',
    (count: number = 0) => ({ count }))
}

// This will generate message creators for the counter domain.
const LogMsg = {
  info: defineMessage('log.info',
    (text: string) => ({ text })),

  warn: defineMessage('log.info',
    (text: string) => ({ text })),

  error: defineMessage('log.error',
    (text: string) => ({ text })
}

const initialCounterState = {
  count: 0
}

const initialLogState = {
  entries: [] as { level: 'info' | 'warn' | 'error', text: string }[]
}

// The `on` helper is useful if you want to define
// reducers in a strict functional way.
const counterReducer = createReducer(initialCountState, [
  on(CounterMsg.increment, (state, { delta }) => {
    return { ...state, count: state.count + delta }
  }),

  on(CounterMsg.reset, (state, { count }) => {
    return { ...state, count }
  })
]) 

// The `when` helper is useful if you want to define
// reducers in an imperative way (using Immer internally).
// Be aware the created reducer will still behave completely
// strict functional externally - nobody will notice that
// Immer has been used internally.
const logReducer = createReducer(initialLogState, [
  when(LogMsg.info, (state, { text }) => {
    state.entries.push({ level: 'info', text })
  }),
  
  when(LogMsg.warn, (state, { text }) => {
    state.entries.push({ level: 'warn', text })
  }),
  
  when(LogMsg.error, (state, { text }) => {
    state.entries.push({ level: 'error', text })
  })
]) 

const rootReducer = combineReducers({
  counter: counterReducer,
  log: logReducer
})
```
### Project status

*js-reducers* is still in alpha stage.
