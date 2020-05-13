import State from '../internal/types/State'
import MessageCreator from '../internal/types/MessageCreator'
import getOwnProp from '../internal/getOwnProp'

export default function when<T extends string, P, M, S extends State>(
  messageCreator: MessageCreator<T, P, M>,
  handle: (state: S, payload: P, meta: M) => S
) {
  return {
    type: messageCreator.type,
    
    reduce(state: S, msg: { type: T }): S {
      return handle(
        state,
        getOwnProp(msg, 'payload'),
        getOwnProp(msg, 'meta')
      )
    }
  }
}
