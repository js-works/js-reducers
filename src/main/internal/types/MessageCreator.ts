import Message from './Message'

export default MessageCreator

type MessageCreator<T extends string, M extends Message<T>> = {
  (...args: any[]): M
  type: T
}
