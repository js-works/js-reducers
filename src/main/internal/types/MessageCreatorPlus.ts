export default MessageCreatorPlus

type MessageCreatorPlus<T extends string, P, M> = {
  (...args: any[]): {
    type: T,
    payload?: P,
    meta?: M 
  }
  
  type: T
}
