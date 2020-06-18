import Message from '../internal/types/Message'
import Reducer from '../internal/types/Reducer'

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

export default function combineReducers<
  R extends Reducers<M>,
  M extends Message<any, any>
>(reducers: R): CombinedReducer<R, M> {
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
