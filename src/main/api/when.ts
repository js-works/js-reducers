import State from '../internal/types/State'
import Message from '../internal/types/Message'
import MessageCreatorPlus from '../internal/types/MessageCreatorPlus'
import getOwnProp from '../internal/getOwnProp'

export default function when<T extends string, P, M, S extends State>(
  messageCreator: MessageCreatorPlus<T, P, M>,
  handle: (state: S, payload: P, meta: M, error: boolean) => S
) {
  return {
    type: messageCreator.type,
    
    reduce(state: S, msg: Message): S {
      return handle(
        state,
        getOwnProp(msg, 'payload'),
        getOwnProp(msg, 'meta'),
        getOwnProp(msg, 'error') === true
      )
    }
  }
}
