import Case from '../internal/types/Case'
import State from '../internal/types/State'
import MessageCreator from '../internal/types/MessageCreator'
import getOwnProp from '../internal/getOwnProp'

export default on

function on<T extends string, P, M, S extends State>(
  messageCreator: MessageCreator<T, P, M>,
  handle: (state: S, payload: P, meta: M) => S
): Case<T, S>

function on<S extends State>(
  type: string,
  handle: (state: S, msg: { title: string } & Record<string, any>)  => S
): Case<any, S>

function on<S extends State>(arg1: any, arg2: any): Case<string, S> { // TODO
  if (typeof arg1 === 'string') {
    return {
      type: arg1,
      reduce: (state: S, msg: any) => arg2(state, msg) 
    }
  } else {
    return {
      type: arg1.type,

      reduce(state: S, msg: { type: string }): S {
        return arg2(
          state,
          getOwnProp(msg, 'payload'),
          getOwnProp(msg, 'meta')
        )
      }
    }
  }
}
