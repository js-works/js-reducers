import Case from '../internal/types/Case'
import Props from '../internal/types/Props'
import State from '../internal/types/State'
import Message from '../internal/types/Message'
import MessageCreator from '../internal/types/MessageCreator'
import StrictReducer from '../internal/types/StrictReducer'

export default on

function on<T extends string, P extends Props, S extends State>(
  messageCreator: MessageCreator<T, any, P>,
  reduce: StrictReducer<S, Message<T, P>>
): Case<T, S>

function on<S extends State>(
  type: string,
  reduce: StrictReducer<S, Message<string, any>>
): Case<any, S>

function on<S extends State>(
  kind: MessageCreator<any, any, any> | string,
  reduce: StrictReducer<S, any>
): Case<any, S> {
  return {
    type: typeof kind === 'string' ? kind : kind.type,
    reduce
  }
}
