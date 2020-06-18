import Props from '../../main/internal/types/Props'
import Message from '../../main/internal/types/Message'
import MessageCreator from '../../main/internal/types/MessageCreator'

export default defineMessage

function defineMessage<T extends string, A extends any[], P extends Props>(
  type: T
): MessageCreator<T, A, P>

function defineMessage<T extends string, A extends any[], P extends Props>(
  type: T,
  getProps: (...args: A) => P
): MessageCreator<T, A, P>

function defineMessage<T extends string, A extends any[], P extends Props>(
  type: T,
  getProps?: (...args: A) => P
): MessageCreator<T, A, P> {
  const ret: any = (...args: A) =>
    getProps ? { type, ...getProps(...args) } : { type }

  ret.type = type

  return ret
}
