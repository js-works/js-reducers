import State from '../internal/types/State'
import Message from '../internal/types/Message'
import MessageCreator from '../internal/types/MessageCreator'

export default pick

function pick<T extends string, M extends Message<T>, S extends State>(
  messageCreator: MessageCreator<T, M>,
  handle: (state: S, msg: M) => S
) {
  return {
    type: messageCreator.type,
    
    reduce(state: S, msg: M): S { 
      return handle(state, msg)
    }
  }
}
