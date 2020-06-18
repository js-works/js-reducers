import Props from './Props'
import Message from './Message'

type MessageCreator<
  T extends string,
  A extends any[] = [],
  P extends Props = {}
> = {
  (...args: A): Message<T, P>

  type: T
}

export default MessageCreator
