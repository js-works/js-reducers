# js-reducers

[![Licence](https://img.shields.io/badge/licence-LGPLv3-blue.svg?style=flat)](https://github.com/js-works/js-reducers/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/js-reducers.svg?style=flat)](https://www.npmjs.com/package/js-reducers)
[![Build status](https://travis-ci.com/js-works/js-reducers.svg)](https://travis-ci.org/js-works/js-reducers)
[![Coverage status](https://coveralls.io/repos/github/js-works/js-reducers/badge.svg?branch=master)](https://coveralls.io/github/js-works/js-reducers?branch=master)

A small library to when state reducers in an opinionated way.
This a sister project of [_js-messages_](https://github.com/js-works/js-messages).
In combination they provide a more concise way for application that base on
[_Redux_](https://redux.js.org) patterns.

### API

- `createReducer(config)`
  => concise way to implement state reducers

- `$(messageCreator | type, reduce)`
  => helper function to be used in combination with createReducer (see below)

- `on(messageCreator | type, update)`
  => helper function (based on "immer" library) to be used in
  combination with createReducer (see below)

- `combineReducers(config)`
  => combine multiple reducers to a more complex one that whens state
  of several domains (similar to the same-named function in redux)

### Usage (demo is completely type-safe with TypeScript)

```javascript
import { defineMessages } from 'js-messages'
import { createReducer, combineReducer, on, $ } from 'js-reducers'

// This will generate message creators for the counter domain.
const CounterMsg = defineMessages('counter', {
  increment: (delta: number = 1) => ({ delta }),
  reset: (count: number = 0) => ({ count })
})

// This will generate message creators for the log domain.
const LogMsg = defineMessages('log', {
  info: (text: string) => ({ text }),
  warn: (text: string) => ({ text }),
  error: (text: string) => ({ text })
})

const initialCounterState = {
  count: 0
}

const initialLogState = {
  entries: [] as { level: 'info' | 'warn' | 'error', text: string }[]
}

// The `on` helper is useful if you want to define
// reducers in a strict functional way.
const counterReducer = createReducer(initialCountState, [
  $(CounterMsg.increment, (state, { delta }) => {
    return { ...state, count: state.count + delta }
  }),

  $(CounterMsg.reset, (state, { count }) => {
    return { ...state, count }
  })
])

// The `when` helper is useful if you want to define
// reducers in an imperative way (using Immer internally).
// Be aware the created reducer will still behave completely
// strict functional externally - nobody will notice that
// Immer has been used internally.
const logReducer = createReducer(initialLogState, [
  on(LogMsg.info, (state, { text }) => {
    state.entries.push({ level: 'info', text })
  }),

  on(LogMsg.warn, (state, { text }) => {
    state.entries.push({ level: 'warn', text })
  }),

  on(LogMsg.error, (state, { text }) => {
    state.entries.push({ level: 'error', text })
  })
])

const rootReducer = combineReducers({
  counter: counterReducer,
  log: logReducer
})
```

### Project status

_js-reducers_ is in beta stage.
