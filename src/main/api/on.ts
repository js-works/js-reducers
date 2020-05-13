import { produce } from 'immer'
import State from '../internal/types/State'
import Message from '../internal/types/Message'
import MessageCreator from '../internal/types/MessageCreatorPlus'
import getOwnProp from '../internal/getOwnProp'

export default on

function on<T extends string, P, M, S extends State>(
  messageCreator: MessageCreator<T, P, M>,
  handle: (state: S, payload: P, meta: M, error: boolean) => void
) {
  return {
    type: messageCreator.type,
    
    reduce(state: S, msg: Message): S {
      return produce(state, draft => handle(
        draft as S,
        getOwnProp(msg, 'payload'),
        getOwnProp(msg, 'meta'),
        getOwnProp(msg, 'error') === true
      ))
    }
  }
}
