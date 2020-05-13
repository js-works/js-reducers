import { produce } from 'immer'
import State from '../internal/types/State'
import Case from '../internal/types/Case'
import MessageCreator from '../internal/types/MessageCreator'
import getOwnProp from '../internal/getOwnProp'

export default handle

function handle<T extends string, P, M, S extends State>(
  messageCreator: MessageCreator<T, P, M>,
  handle: (state: S, payload: P, meta: M) => void
): Case<T, S>

function handle<T extends string, P, M, S extends State>(
  type: T,
  handle: (state: S, msg: { title: string } & Record<string, any>)  => void
): Case<T, S>

function handle<S extends State>(arg1: any, arg2: any): Case<any, S> {
  if (typeof arg1 === 'string') {
    return {
      type: arg1,
      reduce(state: S, msg: { type: string }): S {
        return arg2(state, msg)
      }
    }
  } else {
    return {
      type: arg1.type,
      
      reduce(state: S, msg: { type: string }): S {
        return produce(state, draft => {
          arg2(
            draft as S,
            getOwnProp(msg, 'payload'),
            getOwnProp(msg, 'meta')
          )
        })
      }
    }
  }
}
