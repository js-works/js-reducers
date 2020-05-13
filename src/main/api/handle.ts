import { produce } from 'immer'
import State from '../internal/types/State'
import Message from '../internal/types/Message'
import MessageCreator from '../internal/types/MessageCreator'

export default on

function on<T extends string, M extends Message<T>, S extends State>(
  messageCreator: MessageCreator<T, M>,
  handle: (state: S, msg: M) => void
) {
  return {
    type: messageCreator.type,
    
    reduce(state: S, msg: M): S {
      return produce(state, draft => handle(
        draft as S,
        msg
      ))
    }
  }
}
