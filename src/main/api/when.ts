import State from '../internal/types/State'
import Message from '../internal/types/Message'

export default function when<T extends string, P, M, S extends State>(
  messageCreator: MessageCreator<T, P, M>,
  handle: (state: S, payload: P, meta: M, error: boolean) => Partial<S> | void
) {
  return {
    type: messageCreator.type,
    
    reduce(state: S, msg: Message) {
      return msg && msg.type === messageCreator.type
        ? handle(
            state,
            getOwnProp(msg, 'payload'),
            getOwnProp(msg, 'meta'),
            getOwnProp(msg, 'error') === true
          )
        : undefined
    }
  }
}

// -------------------------------------------------------------------

type MessageCreator<T extends string, P, M> = {
  (...args: any[]): {
    type: T,
    payload?: P,
    meta?: M 
  }
  
  type: T
}

// -------------------------------------------------------------------

const hasOwnProperty = Object.prototype.hasOwnProperty

function getOwnProp(obj: any, propName: string) {
  return obj === undefined || obj === null || hasOwnProperty.call(obj, propName)
    ? obj[propName]
    : undefined
}