import { produce } from 'immer'
import Case from '../internal/types/Case'
import Props from '../internal/types/Props'
import State from '../internal/types/State'
import Message from '../internal/types/Message'
import MessageCreator from '../internal/types/MessageCreator'

export default when

function when<T extends string, P extends Props, S extends State>(
  messageCreator: MessageCreator<T, any, P>,
  update: (state: S, msg: Message<T, P>) => void
): Case<T, S>

function when<S extends State>(
  type: string,
  update: (state: S, msg: Message<string, any>) => void
): Case<any, S>

function when<S extends State>(
  kind: MessageCreator<any, any, any> | string,
  update: (state: S, msg: Message) => void
): Case<any, S> {
  return {
    type: typeof kind === 'string' ? kind : kind.type,

    reduce(state: S, msg: Message<any, any>): S {
      return produce(state, (draft: S) => update(draft, msg))
    }
  }
}
