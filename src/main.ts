// === imports =======================================================

import { produce } from 'immer'

// === exports =======================================================

export { createReducer, combineReducers, on, when }

// === types =========================================================

type Props = Record<string, any> // & { type?: never } // TODO
type State = Record<string, any>
type Message<T extends string = string, P extends Props = {}> = { type: T } & P

type Reducer<S extends State, M extends Message<any, any>> = (
  state: S | undefined,
  message: M
) => S

type StrictReducer<S extends State, M extends Message<any, any>> = (
  state: S,
  message: M
) => S

type Case<T extends string, S extends State> = {
  type: T
  reduce: StrictReducer<S, Message<T, any>>
}

type Reducers<M extends Message<any, any>> = {
  [key: string]: Reducer<any, M>
}

type CombinedState<R extends Reducers<any>> = {
  [K in keyof R]: R[K] extends Reducer<infer S, any> ? S : never
}

type MessageType<R> = R extends Reducer<any, infer M> ? M : never

type CombinedReducer<
  R extends Reducers<M>,
  M extends Message<any, any>
> = Reducer<CombinedState<R>, { [K in keyof R]: MessageType<R[K]> }[keyof R]>

type MessageCreator<
  T extends string,
  A extends any[] = [],
  P extends Props = {}
> = {
  (...args: A): Message<T, P>

  type: T
}

// === createReducer =================================================

function createReducer<S extends Readonly<State>>(
  initialState: S,
  cases: Case<any, S>[]
): Reducer<S, any> {
  const reducers: any = {}

  for (let i = 0; i < cases.length; ++i) {
    const { type, reduce } = cases[i]
    reducers[type] = reduce
  }

  return (state = initialState, msg: { type: string }): S => {
    let ret = state

    if (msg && hasOwnProp(msg, 'type') && hasOwnProp(reducers, msg.type)) {
      const result = reducers[msg.type](state, msg)

      if (result && result !== state) {
        ret = Object.assign({}, state, result)
      }
    }

    return ret
  }
}

// === combineReducers ================================================

function combineReducers<R extends Reducers<M>, M extends Message<any, any>>(
  reducers: R
): CombinedReducer<R, M> {
  return (state: CombinedState<R> | undefined, msg: Message<any, any>) => {
    let newState: CombinedState<R> | null = null

    for (const key in reducers) {
      if (hasOwnProp(reducers, key)) {
        const subState = state ? state[key] : undefined,
          newSubState = reducers[key](subState, msg)

        if (newSubState && newSubState !== subState) {
          if (!newState) {
            newState = Object.assign({}, state)
          }

          newState[key] = newSubState
        }
      }
    }

    return newState! || state
  }
}

// === when ==========================================================

function when<T extends string, P extends Props, S extends State>(
  messageCreator: MessageCreator<T, any, P>,
  reduce: StrictReducer<S, Message<T, P>>
): Case<T, S>

function when<S extends State>(
  type: string,
  reduce: StrictReducer<S, Message<string, any>>
): Case<any, S>

function when<S extends State>(
  kind: MessageCreator<any, any, any> | string,
  reduce: StrictReducer<S, any>
): Case<any, S> {
  return {
    type: typeof kind === 'string' ? kind : kind.type,
    reduce
  }
}

// === on ============================================================

function on<T extends string, P extends Props, S extends State>(
  messageCreator: MessageCreator<T, any, P>,
  update: (state: S, msg: Message<T, P>) => void
): Case<T, S>

function on<S extends State>(
  type: string,
  update: (state: S, msg: Message<string, any>) => void
): Case<any, S>

function on<S extends State>(
  kind: MessageCreator<any, any, any> | string,
  update: (state: S, msg: Message) => void
): Case<any, S> {
  return {
    type: typeof kind === 'string' ? kind : kind.type,

    reduce(state: S, msg: Message<any, any>): S {
      return produce(state, (draft: S) => update(draft, msg))
    }
  }
}

// === utils =========================================================

function hasOwnProp(obj: any, propName: string) {
  return !!obj && Object.prototype.hasOwnProperty.call(obj, propName)
}
