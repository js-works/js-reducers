import Message from '../internal/types/Message'
import Reducer from '../internal/types/Reducer'

type Reducers = {
  [key: string]: Reducer<any, any>
}

type CombinedState<R extends Reducers> = {
  [K in keyof R]: R[K] extends Reducer<infer S, any> ? S : never
}

type MessageType<R extends Reducer<any, any>> = R extends Reducer<any, infer M>
  ? M
  : never

type CombinedReducer<R extends Reducers> = Reducer<
  CombinedState<R>,
  { [K in keyof R]: MessageType<R[K]> }[keyof R]
>

export default function combineReducers<R extends Reducers>(
  reducers: R
): CombinedReducer<R> {
  const keys: (keyof R)[] = Object.keys(reducers)

  return (state: CombinedState<R> | undefined, msg: Message<any, any>) => {
    let newState: CombinedState<R> | null = null

    keys.forEach((key) => {
      const subState = state ? state[key] : undefined,
        newSubState = reducers[key](subState, msg)

      if (newSubState && newSubState !== subState) {
        if (!newState) {
          newState = Object.assign({}, state)
        }

        newState[key] = newSubState
      }
    })

    return newState! || state
  }
}
